/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import printf from "printf";

import { NotImplementedError } from "../../NotImplementedError";
import { char, double, float, int, long } from "../../types";

import { CharSequence } from "../lang/CharSequence";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { System } from "../lang/System";
import { CharBuffer } from "../nio/CharBuffer";
import { Charset } from "../nio/charset/Charset";
import { CharsetEncoder } from "../nio/charset/CharsetEncoder";
import { Locale } from "../util/Locale";
import { JavaFile } from "./File";
import { FileOutputStream } from "./FileOutputStream";

import { FilterOutputStream } from "./FilterOutputStream";
import { OutputStream } from "./OutputStream";

/** A print stream is an output stream that prints representations of various data values conveniently. */
export class PrintStream extends FilterOutputStream {
    static #lineSeparator: JavaString | null;

    #autoFlush = false;
    #encoder: CharsetEncoder;
    #haveError = false;

    /** Creates a new print stream, without automatic line flushing, with the specified file. */
    public constructor(file: JavaFile);
    /** Creates a new print stream, without automatic line flushing, with the specified file and charset. */
    public constructor(file: JavaFile, csn: JavaString);
    /** Creates a new print stream, without automatic line flushing, with the specified file and charset. */
    public constructor(file: JavaFile, charset: Charset);
    /** Creates a new print stream. */
    public constructor(out: OutputStream);
    /** Creates a new print stream. */
    public constructor(out: OutputStream, autoFlush: boolean);
    /** Creates a new print stream. */
    public constructor(out: OutputStream, autoFlush: boolean, encoding: JavaString);
    /** Creates a new print stream, with the specified OutputStream, automatic line flushing and charset. */
    public constructor(out: OutputStream, autoFlush: boolean, charset: Charset);
    /** Creates a new print stream, without automatic line flushing, with the specified file name. */
    public constructor(fileName: JavaString);
    /** Creates a new print stream, without automatic line flushing, with the specified file name and charset. */
    public constructor(fileName: JavaString, csn: JavaString);
    /** Creates a new print stream, without automatic line flushing, with the specified file name and charset. */
    public constructor(fileName: JavaString, charset: Charset);
    public constructor(...args: unknown[]) {
        let output: OutputStream;
        let autoFlush = false;
        let charset: Charset;

        switch (args.length) {
            case 1: {
                const arg = args[0] as OutputStream | JavaFile | JavaString;
                if (arg instanceof JavaFile) {
                    output = new FileOutputStream(arg);
                } else if (arg instanceof OutputStream) {
                    output = arg;
                } else {
                    output = new FileOutputStream(arg);
                }

                charset = Charset.defaultCharset();

                break;
            }

            case 2: {
                if (args[0] instanceof OutputStream) {
                    [output, autoFlush] = args as [OutputStream, boolean];
                    charset = Charset.defaultCharset();
                } else if (args[0] instanceof JavaFile) {
                    const [file, arg2] = args as [JavaFile, JavaString | Charset];
                    if (arg2 instanceof Charset) {
                        charset = arg2;
                    } else {
                        const cs = Charset.forName(arg2);
                        if (cs === null) {
                            throw new IllegalArgumentException(new JavaString("Invalid charset name"));
                        }

                        charset = cs;
                    }

                    output = new FileOutputStream(file);
                } else {
                    const [fileName, arg2] = args as [JavaString, JavaString | Charset];
                    if (arg2 instanceof Charset) {
                        charset = arg2;
                    } else {
                        const cs = Charset.forName(arg2);
                        if (cs === null) {
                            throw new IllegalArgumentException(new JavaString("Invalid charset name"));
                        }

                        charset = cs;
                    }

                    output = new FileOutputStream(fileName);
                }

                break;
            }

            case 3: {
                let arg2;
                [output, autoFlush, arg2] = args as [OutputStream, boolean, JavaString | Charset];
                if (arg2 instanceof Charset) {
                    charset = arg2;
                } else {
                    const cs = Charset.forName(arg2);
                    if (cs === null) {
                        throw new IllegalArgumentException(new JavaString("Invalid charset name"));
                    }

                    charset = cs;
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }

        super(output);
        this.#autoFlush = autoFlush;
        this.#encoder = charset.newEncoder();

        // Initialize this static field here to avoid static initialization order issues.
        if (!PrintStream.#lineSeparator) {
            PrintStream.#lineSeparator = System.getProperty(new JavaString("line.separator"));
        }
    }

    /** Appends the specified character to this output stream. */
    public append(c: char): PrintStream;
    /** Appends the specified character sequence to this output stream. */
    public append(csq: CharSequence): PrintStream;
    /** Appends a subsequence of the specified character sequence to this output stream. */
    public append(csq: CharSequence, start: number, end: number): PrintStream;
    public append(...args: unknown[]): PrintStream {
        if (args.length === 1) {
            const arg = args[0] as char | CharSequence;
            if (typeof arg === "number") {
                this.write(arg);
            } else {
                const buffer = this.encode(arg);
                this.write(buffer);
            }
        } else {
            const [csq, start, end] = args as [CharSequence, number, number];
            const buffer = this.encode(csq.subSequence(start, end));
            this.write(buffer);
        }

        return this;
    }

    /**
     * Flushes the stream and checks its error state.
     *
     * @returns `true` if the print stream has encountered an error, either on the underlying output stream or during
     *           a format conversion.
     */
    public checkError(): boolean {
        try {
            this.out.flush();
        } catch (e) {
            this.#haveError = true;
        }

        return this.#haveError;
    }

    /** Closes the stream. */
    public override close(): void {
        this.out.close();
    }

    /** Flushes the stream. */
    public override flush(): void {
        this.out.flush();
    }

    /** Writes a formatted string to this output stream using the specified format string and arguments. */
    public format(format: JavaString, ...args: unknown[]): PrintStream;
    /** Writes a formatted string to this output stream using the specified format string and arguments. */
    public format(l: Locale, format: JavaString, ...args: unknown[]): PrintStream;
    public format(...args: unknown[]): PrintStream {
        let index = 0;
        if (args[0] instanceof Locale) {
            ++index; // Ignore the locale for now.
        }

        const text = printf(`${args[index]}`, args.slice(index + 1));
        this.append(new JavaString(text));

        return this;
    }

    /** Prints a boolean value. */
    public print(b: boolean): void;
    /** Prints a character. */
    public print(c: char): void;
    /** Prints an array of characters. */
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
    public print(str: JavaString | null): void;
    public print(v: unknown): void {
        if (v === null) {
            this.append(new JavaString("null"));
        } else if (v instanceof JavaString) {
            this.append(v);
        } else {
            this.append(new JavaString(`${v}`));
        }
    }

    /**
     * A convenience method to write a formatted string to this output stream using the specified format string
     * and arguments.
     *
     * @param format tbd
     * @param args tbd
     *
     * @returns tbd
     */
    public printf(format: JavaString, ...args: unknown[]): PrintStream {
        return this.format(format, args);
    }

    /** Terminates the current line by writing the line separator string. */
    public println(): void;
    /** Prints a boolean and then terminate the line. */
    public println(b: boolean): void;
    /** Prints a character and then terminate the line. */
    public println(c: char): void;
    /** Prints an array of characters and then terminate the line. */
    public println(s: Uint16Array): void;
    /** Prints a double and then terminate the line. */
    public println(d: double): void;
    /** Prints a float and then terminate the line. */
    public println(f: float): void;
    /** Prints an integer and then terminate the line. */
    public println(i: int): void;
    /** Prints a long and then terminate the line. */
    public println(l: long): void;
    /** Prints an object and then terminate the line. */
    public println(obj: JavaObject | null): void;
    /** Prints a string and then terminate the line. */
    public println(str: JavaString | null): void;
    public println(v?: unknown): void {
        if (v !== undefined) {
            if (v === null) {
                const buffer = this.encode(new JavaString("null"));
                this.write(buffer);
            } else if (v instanceof JavaString) {
                const buffer = this.encode(v);
                this.write(buffer);
            } else {
                const buffer = this.encode(new JavaString(`${v}`));
                this.write(buffer);
            }
        }

        this.print(PrintStream.#lineSeparator);
        if (this.#autoFlush) {
            this.flush();
        }
    }

    public override write(b: Int8Array): void;
    public override write(b: Int8Array, off: number, len: number): void;
    public override write(b: int): void;
    public override write(...args: unknown[]): void {
        if (args.length === 1) {
            const b = args[0] as Int8Array | number;
            if (b instanceof Int8Array) {
                this.out.write(b, 0, b.length);
            } else {
                this.out.write(b);
            }
        } else {
            const [b, off, len] = args as [Int8Array, number, number];
            this.out.write(b.subarray(off, off + len));
        }
    }

    /** Clears the internal error state of this stream. */
    protected clearError(): void {
        this.#haveError = false;
    }

    /** Sets the error state of the stream to true. */
    protected setError(): void {
        throw new NotImplementedError();
    }

    /**
     * Converts a character sequence to a byte array.
     *
     * @param s The character sequence to convert.
     *
     * @returns A byte array containing the encoded string.
     */
    private encode(s: CharSequence): Int8Array {
        const buffer = this.#encoder.encode(CharBuffer.wrap(s));

        return buffer.array();
    }
}
