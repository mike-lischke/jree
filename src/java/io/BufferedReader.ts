/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { int, long } from "../../types";

import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { JavaString } from "../lang/String";
import { Stream } from "../util/stream/Stream";
import { IOException } from "./IOException";
import { Reader } from "./Reader";

/**
 * Reads text from a character-input stream, buffering characters so as to provide for the efficient reading of
 * characters, arrays, and lines.
 */
export class BufferedReader extends Reader {
    static #bufferSize = 10000;

    #buffer: Uint16Array;
    #currentIndex: int = 0;

    #input: Reader;

    /** Creates a buffering character-input stream that uses a default-sized input buffer. */
    public constructor(input: Reader);
    /** Creates a buffering character-input stream that uses an input buffer of the specified size. */
    public constructor(input: Reader, sz: int);
    public constructor(...args: unknown[]) {
        super();

        let size = BufferedReader.#bufferSize;
        if (args.length === 2) {
            size = args[1] as int;
        }

        if (size <= 0) {
            throw new IllegalArgumentException(new JavaString("Buffer size <= 0"));
        }

        this.#buffer = new Uint16Array(size);
        this.#input = args[0] as Reader;
    }

    public override close(): void {
        this.#input.close();
        this.#buffer = new Uint16Array(0);
        this.#currentIndex = 0;
    }

    /** Returns a Stream, the elements of which are lines read from this BufferedReader. */
    public lines(): Stream<JavaString> {
        throw new NotImplementedError();
    }

    /**
     * Marks the present position in the stream.
     *
     * @param readAheadLimit Limit on the number of characters that may be read while still preserving the mark. After
     *                       reading this many characters, attempting to reset the stream may fail.
     */
    public override mark(readAheadLimit: int): void {
        this.checkOpen();

        this.#input.mark(readAheadLimit);
    }

    /**
     *  Tells whether this stream supports the mark() operation, which it does.
     *
     * @returns true if and only if this stream supports the mark operation.
     */
    public override markSupported(): boolean {
        return this.#input.markSupported();
    }

    /** Reads a single character. */
    public override read(): int;
    /** Reads characters into a portion of an array. */
    public override read(buffer: Uint16Array, offset: int, count: int): int;
    public override read(...args: unknown[]): int {
        this.checkOpen();

        if (args.length === 0) {
            // Read a single character.
            if (this.#currentIndex >= this.#buffer.length) {
                this.#currentIndex = 0;
                const read = this.#input.read(this.#buffer);
                if (read === -1) {
                    return -1;
                }
            }

            return this.#buffer[this.#currentIndex++];
        } else {
            // Read a (possibly large) amount of characters.
            const [buffer, offset, count] = args as [Uint16Array, int, int];
            if (offset < 0 || count < 0 || count + offset > buffer.length) {
                throw new IndexOutOfBoundsException();
            }

            // Check if we have enough data in the buffer.
            const remaining = this.#buffer.length - this.#currentIndex;
            if (count <= remaining) {
                // If so, just copy it.
                buffer.set(this.#buffer.subarray(this.#currentIndex, this.#currentIndex + count), offset);
                this.#currentIndex += count;

                return count;
            }

            // Otherwise, copy what we have and read more.
            buffer.set(this.#buffer.subarray(this.#currentIndex), offset);

            let read = remaining;
            this.#currentIndex = 0;
            while (read < count) {
                if (!this.ready()) { // Do not block if no more data is available.
                    break;
                }

                const result = this.#input.read(this.#buffer);
                if (result === -1) {
                    return read === 0 ? -1 : read;
                }

                if (result > count - read) {
                    // We got more data than we need. Copy what we need and save the rest for later.
                    buffer.set(this.#buffer.subarray(0, count - read), offset + read);
                    this.#currentIndex = count - read;
                    read = count;

                    break;
                }

                buffer.set(this.#buffer.subarray(0, result), offset + read);
                read += result;
            }

            return read;
        }
    }

    /** Reads a line of text. */
    public readLine(): JavaString | null {
        throw new NotImplementedError();
    }

    public override ready(): boolean {
        return this.#input.ready();
    }

    /** Resets the stream to the most recent mark. */
    public override reset(): void {
        this.#input.reset();
    }

    /**
     * Skips characters.
     *
     * @param n The number of characters to skip.
     *
     * @returns The number of characters actually skipped.
     */
    public override skip(n: long): long {
        this.checkOpen();

        if (n <= 0n) {
            return 0n;
        }

        // Check if we have enough data in the buffer.
        const remaining = this.#buffer.length - this.#currentIndex;
        if (n <= remaining) {
            // If so, just skip it.
            this.#currentIndex += Number(n);

            return n;
        }

        // Otherwise, skip what we have and read more.
        let skipped = BigInt(remaining);
        this.#currentIndex = 0;
        while (skipped < n) {
            if (!this.ready()) { // Do not block if no more data is available.
                break;
            }

            const result = this.#input.read(this.#buffer);
            if (result === -1) {
                return skipped;
            }

            if (result > n - skipped) {
                // We got more data than we need. Skip what we need and save the rest for later.
                this.#currentIndex = Number(n - skipped);
                skipped = n;

                break;
            }

            skipped += BigInt(result);
        }

        return skipped;
    }

    /** @throws IOException if the underlying reader has been closed. */
    private checkOpen(): void {
        if (this.#buffer.length === 0) {
            throw new IOException(new JavaString("Stream closed"));
        }
    }
}
