/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import printf from "printf";

import { NotImplementedError } from "../../NotImplementedError";
import { char } from "../lang";
import { CharSequence } from "../lang/CharSequence";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { System } from "../lang/System";
import { Locale } from "../util/Locale";
import { JavaFile } from "./File";
import { FileOutputStream } from "./FileOutputStream";

import { FilterOutputStream } from "./FilterOutputStream";
import { OutputStream } from "./OutputStream";

/** A print stream is an output stream that prints representations of various data values conveniently. */
export class PrintStream extends FilterOutputStream {

    private static supportedEncodings = new Set<string>([
        "ascii",   // alias to latin1
        "utf8",
        "utf-8",
        "utf16le",
        "ucs2",    // alias to utf16le
        "ucs-2",   // alias to utf16le
        "latin1",
        "binary",  // alias to latin11
    ]);

    private static lineSeparator: JavaString | null;

    private autoFlush = false;
    private encoding: BufferEncoding = "utf-8";

    /** Creates a new print stream, without automatic line flushing, with the specified file and charset. */
    public constructor(file: JavaFile, csn?: JavaString);
    public constructor(out: OutputStream, autoFlush?: boolean, encoding?: JavaString);
    public constructor(fileName: JavaString, csn?: JavaString);
    public constructor(fileOrOutOrFileName: JavaFile | OutputStream | JavaString,
        csnOrAutoFlush?: JavaString | boolean, encoding?: JavaString) {
        if (fileOrOutOrFileName instanceof JavaFile) {
            /* @ts-expect-error, because the super call is not in the root block of the constructor. */
            super(new FileOutputStream(fileOrOutOrFileName));
        } else if (fileOrOutOrFileName instanceof OutputStream) {
            super(fileOrOutOrFileName);
        } else {
            super(new FileOutputStream(fileOrOutOrFileName));
        }

        if (typeof csnOrAutoFlush === "boolean") {
            this.autoFlush = csnOrAutoFlush;
        } else if (encoding || csnOrAutoFlush) {
            let charset = encoding ?? csnOrAutoFlush ?? "utf-8";

            charset = charset.valueOf().toLowerCase();
            if (!PrintStream.supportedEncodings.has(charset)) {
                new IllegalArgumentException(new JavaString(`Invalid encoding specified: ${charset}`));
            }

            this.encoding = charset as BufferEncoding;
        }

        if (!PrintStream.lineSeparator) {
            PrintStream.lineSeparator = System.getProperty(new JavaString("line.separator"));
        }
    }

    /**
     * Appends the specified character ((sub) sequence) to this output stream.
     * Because the JS string type does not implement CharSequence, a separate signature only for a string is added.
     */
    public append(c: char | JavaString | CharSequence): PrintStream;
    public append(csq: CharSequence, start: number, end: number): PrintStream;
    public append(cOrSOrCsq: char | JavaString | CharSequence, start?: number,
        end?: number): PrintStream {
        let text: string;
        if (cOrSOrCsq instanceof JavaString) {
            text = cOrSOrCsq.valueOf();
        } else if (typeof cOrSOrCsq === "number") {
            text = String.fromCodePoint(cOrSOrCsq);
        } else {
            start = start ?? 0;
            end = end ?? cOrSOrCsq.length();
            text = `${cOrSOrCsq.subSequence(start, end).toString()}`;
        }

        const buffer = Buffer.from(text, this.encoding);
        this.out.write(buffer.valueOf());

        return this;
    }

    /**
     * Flushes the stream and checks its error state.
     *
     * @returns tbd
     */
    public checkError(): boolean {
        try {
            this.out.flush();

            return true;
        } catch (e) {
            return false;
        }
    }

    /** Closes the stream. */
    public close(): void {
        this.out.close();
    }

    /** Flushes the stream. */
    public flush(): void {
        this.out.flush();
    }

    /**
     * Writes a formatted string to this output stream using the specified format string and arguments.
     *
     * @param format tbd
     * @param args tbd
     *
     * @returns tbd
     */
    public format(l: Locale, format: JavaString, ...args: unknown[]): PrintStream;
    public format(format: JavaString, ...args: unknown[]): PrintStream;
    public format(...args: unknown[]): PrintStream {
        let index = 0;
        if (args[0] instanceof Locale) {
            ++index; // Ignore the locale for now.
        }

        const text = printf(`${args[index]}`, args.slice(index + 1));
        this.append(new JavaString(text));

        return this;
    }

    public print(v: boolean | char | number | JavaObject | JavaString | null): void {
        if (v === null) {
            this.append(new JavaString("null"));
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

    // Terminates the current line by writing the line separator string.
    public println(v?: boolean | char | number | JavaObject | JavaString | null): void {
        if (v !== undefined) {
            this.print(v);
        }

        this.print(PrintStream.lineSeparator);

        if (this.autoFlush) {
            this.flush();
        }
    }

    /** Writes len bytes from the specified byte array starting at offset off to this stream. */
    public write(b: Uint8Array): void;
    public write(b: Uint8Array, off: number, len: number): void;
    /** Writes the specified byte to this output stream. */
    public write(b: number): void;
    public write(b: Uint8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            this.out.write(b);
        } else if (off === undefined || len === undefined) {
            this.out.write(b);
        } else {
            this.out.write(b, off, len);
        }
    }

    /** Clears the internal error state of this stream. */
    protected clearError(): void {
        throw new NotImplementedError();
    }

    /** Sets the error state of the stream to true. */
    protected setError(): void {
        throw new NotImplementedError();
    }

}
