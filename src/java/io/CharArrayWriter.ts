/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { char, int } from "../../types";

import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { CharSequence } from "../lang/CharSequence";
import { Writer } from "./Writer";
import { JavaString } from "../lang/String";
import { convertStringToUTF16 } from "../../string-helpers";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

/**
 * This class implements a character buffer that can be used as an Writer. The buffer automatically grows when data is
 * written to the stream. The data can be retrieved using toCharArray() and toString().
 */
export class CharArrayWriter extends Writer {
    protected buf: Uint16Array;
    protected count: int;

    /** Creates a new CharArrayWriter. */
    public constructor();
    /** Creates a new CharArrayWriter with the specified initial size. */
    public constructor(initialSize: int);
    public constructor(...args: unknown[]) {
        super();

        let initialSize = 32;
        if (args.length > 0) {
            initialSize = args[0] as int;
        }

        this.buf = new Uint16Array(initialSize);
        this.count = 0;
    }

    /** Appends the specified character to this writer. */
    public override append(c: char): this;
    /** Appends the specified character sequence to this writer. */
    public override append(csq: CharSequence | null): this;
    /** Appends a subsequence of the specified character sequence to this writer. */
    public override append(csq: CharSequence | null, start: int, end: int): this;
    public override append(...args: unknown[]): this {
        switch (args.length) {
            case 1: {
                const arg = args[0] as char | CharSequence | null;

                if (typeof arg === "number") {
                    this.expandBuffer(1);
                    this.buf[this.count++] = arg;
                } else {
                    const length = arg?.length() ?? "null".length;
                    this.expandBuffer(length);

                    const s = arg?.toString().valueOf() ?? "null";
                    const text = convertStringToUTF16(s);
                    this.buf.set(text, this.count);

                    this.count += length;
                }

                return this;
            }

            case 3: {
                const [csq, start, end] = args as [CharSequence | null, int, int];
                const length = csq?.length() ?? "null".length;
                if (start < 0 || start > end || end > length) {
                    throw new IndexOutOfBoundsException();
                }

                const s = csq?.toString().valueOf() ?? "null";
                const text = convertStringToUTF16(s.substring(start, end));
                this.buf.set(text, this.count);

                this.count += end - start;

                return this;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /** Close this stream. */
    public override close(): void {
        // Nothing to do here.
    }

    /** Flush the stream. */
    public override flush(): void {
        // Nothing to do here.
    }

    /** Resets the buffer so that you can use it again without throwing away the already allocated buffer. */
    public reset(): void {
        this.count = 0;
    }

    /** @returns the current size of the buffer. */
    public size(): int {
        return this.count;
    }

    /** @returns a copy of the input data. */
    public toCharArray(): Uint16Array {
        return this.buf.slice(0, this.count);
    }

    /**
     * Converts input data to a string.
     *
     * @returns a string copy of the input data.
     */
    public override toString(): JavaString {
        return new JavaString(String.fromCharCode(...this.buf.subarray(0, this.count)));
    }

    /** Writes characters to the buffer. */
    public override write(c: Uint16Array, offset: int, length: int): void;
    /** Writes a character to the buffer. */
    public override write(c: int): void;
    public override write(c: Uint16Array): void;
    public override write(str: JavaString | string): void;
    /** Write a portion of a string to the buffer. */
    public override write(str: JavaString | string, offset: int, length: int): void;
    /** Writes the contents of the buffer to another character stream. */
    public override write(out: Writer): void;
    public override write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const arg = args[0] as int | Uint16Array | JavaString | string | Writer;

                if (typeof arg === "number") {
                    this.expandBuffer(1);
                    this.buf[this.count++] = arg;
                } else if (arg instanceof Uint16Array) {
                    this.expandBuffer(arg.length);
                    this.buf.set(arg, this.count);
                    this.count += arg.length;
                } else if (arg instanceof Writer) {
                    arg.write(this.buf.subarray(0, this.count));
                } else if (typeof arg === "string") {
                    this.expandBuffer(arg.length);
                    const array = convertStringToUTF16(arg);
                    this.buf.set(array, this.count);
                    this.count += arg.length;
                } else {
                    this.expandBuffer(arg.length());
                    this.buf.set(arg.array(), this.count);
                    this.count += arg.length();
                }

                break;
            }

            case 3: {
                const [str, offset, length] = args as [Uint16Array | JavaString | string, int, int];
                const sourceLength = str instanceof JavaString ? str.length() : str.length;
                if (offset < 0 || offset > length || length > sourceLength) {
                    throw new IndexOutOfBoundsException();
                }

                this.expandBuffer(length);
                if (str instanceof Uint16Array) {
                    this.buf.set(str.subarray(offset, offset + length), this.count);
                } else {
                    const s = str.toString().valueOf();
                    const array = convertStringToUTF16(s.substring(offset, offset + length));
                    this.buf.set(array, this.count);
                }

                this.count += length;

                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /**
     * Extends the internal buffer to fit the given number of additional characters.
     *
     * @param min The minimum number of additional characters that must fit in the buffer.
     */
    private expandBuffer(min: int): void {
        if (this.count + min <= this.buf.length) {
            return;
        }

        let newLength = this.buf.length * 2;
        if (this.count + min > newLength) {
            newLength = this.count + min;
        }

        const newBuffer = new Uint16Array(newLength);
        newBuffer.set(this.buf);
        this.buf = newBuffer;
    }
}
