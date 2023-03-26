/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import printf from "printf";

import { char, double, float, int, long } from "../../types";
import { CharSequence } from "../lang";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Charset } from "../nio/charset/Charset";
import { Locale } from "../util/Locale";
import { JavaFile } from "./File";
import { FileOutputStream } from "./FileOutputStream";
import { OutputStream } from "./OutputStream";
import { OutputStreamWriter } from "./OutputStreamWriter";
import { Writer } from "./Writer";

/**
 * Prints formatted representations of objects to a text-output stream. This class implements all of the print
 * methods found in PrintStream. It does not contain methods for writing raw bytes, for which a program should use
 * unencoded byte streams.
 */
export class PrintWriter extends Writer {
    protected out: Writer;

    #autoFlush = false;

    /** Creates a new PrintWriter, without automatic line flushing, with the specified file. */
    public constructor(file: JavaFile);
    /** Creates a new PrintWriter, without automatic line flushing, with the specified file and charset. */
    public constructor(file: JavaFile, csn: JavaString | string);
    /** Creates a new PrintWriter, without automatic line flushing, with the specified file and charset. */
    public constructor(file: JavaFile, charset: Charset);
    /** Creates a new PrintWriter, without automatic line flushing, from an existing OutputStream. */
    public constructor(out: OutputStream);
    /** Creates a new PrintWriter from an existing OutputStream. */
    public constructor(out: OutputStream, autoFlush: boolean);
    /** Creates a new PrintWriter from an existing OutputStream. */
    public constructor(out: OutputStream, autoFlush: boolean, charset: Charset);
    /** Creates a new PrintWriter, without automatic line flushing. */
    public constructor(out: Writer);
    /** Creates a new PrintWriter. */
    public constructor(out: Writer, autoFlush: boolean);
    /** Creates a new PrintWriter, without automatic line flushing, with the specified file name. */
    public constructor(fileName: JavaString | string);
    /** Creates a new PrintWriter, without automatic line flushing, with the specified file name and charset. */
    public constructor(fileName: JavaString | string, csn: JavaString | string);
    /** Creates a new PrintWriter, without automatic line flushing, with the specified file name and charset. */
    public constructor(fileName: JavaString | string, charset: Charset);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                const [arg] = args as [JavaFile | OutputStream | Writer | JavaString | string];
                if (arg instanceof JavaFile) {
                    this.out = new OutputStreamWriter(new FileOutputStream(arg));
                } else if (arg instanceof OutputStream) {
                    this.out = new OutputStreamWriter(arg);
                } else if (arg instanceof Writer) {
                    this.out = arg;
                } else if (typeof arg === "string" || arg instanceof JavaString) {
                    this.out = new OutputStreamWriter(new FileOutputStream(arg.toString()));
                } else {
                    throw new IllegalArgumentException("Invalid argument");
                }

                break;
            }

            case 2: {
                const [arg1, arg2] = args as [
                    JavaFile | OutputStream | Writer | JavaString | string, JavaString | string | Charset | boolean
                ];

                if (arg1 instanceof JavaFile) {
                    if (typeof arg2 === "string" || arg2 instanceof JavaString) {
                        this.out = new OutputStreamWriter(new FileOutputStream(arg1), arg2);
                    } else if (arg2 instanceof Charset) {
                        this.out = new OutputStreamWriter(new FileOutputStream(arg1), arg2);
                    } else {
                        this.out = new OutputStreamWriter(new FileOutputStream(arg1));
                        this.#autoFlush = arg2;
                    }

                } else if (arg1 instanceof OutputStream) {
                    if (typeof arg2 === "boolean") {
                        this.out = new OutputStreamWriter(arg1);
                        this.#autoFlush = arg2;
                    } else {
                        throw new IllegalArgumentException("Invalid argument");
                    }
                } else if (arg1 instanceof Writer) {
                    if (typeof arg2 === "boolean") {
                        this.out = arg1;
                        this.#autoFlush = arg2;
                    } else {
                        throw new IllegalArgumentException("Invalid argument");
                    }
                } else {
                    if (typeof arg2 === "string" || arg2 instanceof JavaString) {
                        this.out = new OutputStreamWriter(new FileOutputStream(arg1.toString()), arg2.toString());
                    } else if (arg2 instanceof Charset) {
                        this.out = new OutputStreamWriter(new FileOutputStream(arg1.toString()), arg2);
                    } else {
                        throw new IllegalArgumentException("Invalid argument");
                    }
                }

                break;
            }

            case 3: {
                const [out, autoFlush, charset] = args as [OutputStream, boolean, Charset];

                this.out = new OutputStreamWriter(out, charset);
                this.#autoFlush = autoFlush;

                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /** Appends the specified character to this writer. */
    public override append(c: char): this;
    /** Appends the specified character sequence to this writer. */
    public override append(csq: CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this writer. */
    public override append(csq: CharSequence, start: int, end: int): this;
    public override append(...args: unknown[]): this {
        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    this.out.append(args[0]);
                } else {
                    this.out.append(args[0] as CharSequence);
                }

                break;
            }

            case 3: {
                this.out.append(args[0] as CharSequence, args[1] as int, args[2] as int);

                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }

        if (this.#autoFlush) {
            this.flush();
        }

        return this;
    }

    /**
     * Flushes the stream if it's not closed and checks its error state.
     *
     * @returns `true` if the print stream has encountered an error, either on the underlying output stream or during
     *          a format conversion.
     */
    public checkError(): boolean {
        this.out.flush();

        return false;
    }

    /** Clears the error state of this stream. */
    public clearError(): void {
        // Nothing to do here.
    }

    /** Closes the stream and releases any system resources associated with it. */
    public close(): void {
        this.out.close();
    }

    /** Flushes the stream. */
    public flush(): void {
        this.out.flush();
    }

    /** Writes a formatted string to this writer using the specified format string and arguments. */
    public format(format: JavaString | string, ...args: unknown[]): this;
    /** Writes a formatted string to this writer using the specified format string and arguments. */
    public format(l: Locale, format: JavaString | string, ...args: unknown[]): this;
    public format(...args: unknown[]): this {
        let index = 0;
        if (args[0] instanceof Locale) {
            ++index; // Ignore the locale for now.
        }

        const text = printf(`${args[index]}`, args.slice(index + 1));
        this.append(new JavaString(text));

        if (this.#autoFlush) {
            this.flush();
        }

        return this;
    }

    /** Prints a boolean value. */
    public print(b: boolean): void;
    /** Prints a character. */
    public print(c: char): void;
    /** Prints a character array. */
    public print(s: Uint16Array): void;
    /** Prints a double-precision floating-point number. */
    public print(d: double): void;
    /** Prints a floating-point number. */
    public print(f: float): void;
    /** Prints an integer. */
    public print(i: int): void;
    /** Prints a long integer. */
    public print(l: long): void;
    /** Prints an object. */
    public print(obj: JavaObject | null): void;
    /** Prints a string. */
    public print(s: JavaString | string): void;
    public print(...args: unknown[]): void {
        const s = JavaString.valueOf(args[0]);
        this.write(s);
    }

    /**
     * A convenience method to write a formatted string to this writer using the specified format string and arguments.
     */
    public printf(format: JavaString | string, ...args: unknown[]): this;
    /**
     * A convenience method to write a formatted string to this writer using the specified format string and arguments.
     */
    public printf(l: Locale, format: JavaString | string, ...args: unknown[]): this;
    public printf(...args: unknown[]): this {
        let index = 0;
        if (args[0] instanceof Locale) {
            ++index; // Ignore the locale for now.
        }

        const text = printf(`${args[index]}`, args.slice(index + 1));
        this.append(new JavaString(text));

        if (this.#autoFlush) {
            this.flush();
        }

        return this;
    }

    /** Terminates the current line by writing the line separator string. */
    public println(): void;
    /** Prints a boolean value and then terminates the line. */
    public println(b: boolean): void;
    /** Prints a character and then terminates the line. */
    public println(c: char): void;
    /** Prints a character array and then terminates the line. */
    public println(s: Uint16Array): void;
    /** Prints a double-precision floating-point number and then terminates the line. */
    public println(d: double): void;
    /** Prints a floating-point number and then terminates the line. */
    public println(f: float): void;
    /** Prints an integer and then terminates the line. */
    public println(i: int): void;
    /** Prints a long integer and then terminates the line. */
    public println(l: long): void;
    /** Prints an object and then terminates the line. */
    public println(obj: JavaObject | null): void;
    /** Prints a string and then terminates the line. */
    public println(s: JavaString | string): void;
    public println(...args: unknown[]): void {
        if (args.length > 0) {
            const s = JavaString.valueOf(args[0]);
            this.write(s);
        }

        this.write("\n");
    }

    /** Writes an array of characters. */
    public override write(buf: Uint16Array): void;
    /** Writes A Portion of an array of characters. */
    public override write(buf: Uint16Array, off: int, len: int): void;
    /** Writes a single character. */
    public override write(c: char): void;
    /** Writes a string. */
    public override write(s: JavaString | string): void;
    /** Writes a portion of a string. */
    public override write(s: JavaString | string, off: int, len: int): void;
    public override write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                if (args[0] instanceof Uint16Array) {
                    this.out.write(args[0]);
                } else if (typeof args[0] === "number") {
                    this.out.write(args[0]);
                } else {
                    this.out.write(args[0] as JavaString | string);
                }

                break;
            }

            case 3: {
                const [buf, off, len] = args as [Uint16Array | JavaString | string, int, int];
                if (buf instanceof Uint16Array) {
                    this.out.write(buf, off, len);
                } else {
                    this.out.write(buf, off, len);
                }

                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /** Indicates that an error has occurred. */
    protected setError(): void {
        // Nothing to do here.
    }
}
