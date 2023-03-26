/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { char, int, long } from "../../types";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

import { JavaObject } from "../lang/Object";
import { Readable } from "../lang/Readable";
import { JavaString } from "../lang/String";
import { CharBuffer } from "../nio/CharBuffer";
import { ReadOnlyBufferException } from "../nio/ReadOnlyBufferException";
import { Closeable } from "./Closeable";
import { IOException } from "./IOException";
import { Writer } from "./Writer";

/**
 * Abstract class for reading character streams. The only methods that a subclass must implement are
 * read(char[], int, int) and close(). Most subclasses, however, will override some of the methods defined here
 * in order to provide higher efficiency, additional functionality, or both.
 *
 */
export abstract class Reader extends JavaObject implements Closeable, Readable {

    // Skip buffer, null until allocated.
    private skipBuffer?: Uint16Array;

    public static nullReader(): Reader {
        return new class extends Reader {
            public override close(): void {
                // Do nothing.
            }

            public override read(): char;
            public override read(target: Uint16Array, offset: int, length: int): int;
            public override read(target: CharBuffer): int;
            public override read(...args: unknown[]): int {
                return -1;
            }
        }();
    }

    /**
     * Marks the present position in the stream.
     *
     * @param readAheadLimit Limit on the number of characters that may be read while still preserving the mark. After
     *                       reading this many characters, attempting to reset the stream may fail.
     */
    public mark(readAheadLimit: number): void {
        throw new IOException(new JavaString("mark() not supported"));
    }

    /**
     * Tells whether this stream supports the mark() operation.
     *
     * @returns true if and only if this stream supports the mark operation.
     */
    public markSupported(): boolean {
        return false;
    }

    /** Reads a single character. */
    public read(): char;
    /** Reads characters into an array. */
    public read(buffer: Uint16Array): int;
    /** Reads characters into a portion of an array. */
    public /* abstract */ read(target: Uint16Array, offset: int, length: int): int;
    /** Attempts to read characters into the specified character buffer. */
    public read(target: CharBuffer): int;
    public read(...args: unknown[]): int {
        switch (args.length) {
            case 0: {
                const temp = new Uint16Array(1);
                this.read(temp, 0, 1);

                return temp[0];
            }

            case 1: {
                const target = args[0] as Uint16Array | CharBuffer;
                if (target instanceof Uint16Array) {
                    if (args.length !== 1) {
                        throw new NotImplementedError("abstract");
                    }

                    return this.read(target, 0, target.length);
                } else {
                    if (target.isReadOnly()) {
                        throw new ReadOnlyBufferException();
                    }

                    let readCount = 0;
                    if (target.hasArray()) {
                        const buffer = target.array();
                        const pos = target.position();
                        const rem = Math.max(target.remaining(), 0);
                        const n = this.read(buffer, pos, rem);
                        if (n > 0) {
                            target.position(pos + n);
                        }

                        readCount = n;
                    } else {
                        const temp = new Uint16Array(10000);
                        while (target.hasRemaining()) {
                            const n = this.read(temp, 0, Math.min(temp.length, target.remaining()));
                            if (n === -1) {
                                break;
                            }

                            target.put(temp, 0, n);
                            readCount += n;
                        }
                    }

                    return readCount;
                }
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Wrong number of arguments"));
            }
        }
    }

    /**
     * Tells whether this stream is ready to be read.
     *
     * @returns true if the next read() is guaranteed not to block for input, false otherwise. Note that returning
     *               false does not guarantee that the next read will block.
     */
    public ready(): boolean {
        return false;
    }

    /** Resets the stream. */
    public reset(): void {
        // Do nothing.
    }

    /**
     * Skips characters.
     *
     * @param n The number of characters to skip
     *
     * @returns The number of characters actually skipped
     */
    public skip(n: long): long {
        if (n < 0) {
            throw new IllegalArgumentException(new JavaString("skip value is negative"));
        }

        const nn = n < 10000n ? n : 10000n;

        if ((!this.skipBuffer) || (this.skipBuffer.length < nn)) {
            this.skipBuffer = new Uint16Array(Number(nn));
        }

        let r = n;
        while (r > 0) {
            const nc = this.read(this.skipBuffer, 0, Number(r < nn ? r : nn));
            if (nc === -1) {
                break;
            }
            r -= BigInt(nc);
        }

        return n - r;

    }

    /**
     * Reads all characters from this reader and writes the characters to the given writer in the order that they
     * are read.
     *
     * @param target The writer to write the characters to.
     *
     * @returns The number of characters that were read and written.
     */
    public transferTo(target: Writer): long {
        let total = 0n;
        const buffer = new Uint16Array(10000);
        while (true) {
            const n = this.read(buffer);
            if (n === -1) {
                break;
            }

            target.write(buffer, 0, n);
            total += BigInt(n);
        }

        return total;
    }

    /**
     * Closes the stream and releases any system resources associated with it.
     */
    public abstract close(): void;
}
