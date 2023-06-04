/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";

import type { int, long } from "../../types";
import { OutOfMemoryError, StringBuilder } from "../lang";

import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import type { JavaString } from "../lang/String";
import { CharBuffer } from "../nio";
import type { Stream } from "../util/stream/Stream";
import { IOException } from "./IOException";
import { Reader } from "./Reader";

/**
 * Reads text from a character-input stream, buffering characters so as to provide for the efficient reading of
 * characters, arrays, and lines.
 */
export class BufferedReader extends Reader {
    #buffer: Uint16Array;
    #currentIndex: int = 0;
    #limit: int;
    #mark: int = -1;

    #skipNextLineFeed = false;

    #input: Reader;

    /** Creates a buffering character-input stream that uses a default-sized input buffer. */
    public constructor(input: Reader);
    /** Creates a buffering character-input stream that uses an input buffer of the specified size. */
    public constructor(input: Reader, sz: int);
    public constructor(...args: unknown[]) {
        super();

        let size = 4096;
        if (args.length === 2) {
            size = args[1] as int;
        }

        if (size <= 0) {
            throw new IllegalArgumentException("Buffer size <= 0");
        }

        this.#buffer = new Uint16Array(size);
        this.#input = args[0] as Reader;

        this.#limit = 0;
    }

    public override close(): void {
        this.#input.close();
        this.#buffer = new Uint16Array(0);
        this.#currentIndex = 0;
        this.#limit = 0;
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

        if (readAheadLimit < 0) {
            throw new IllegalArgumentException("Read-ahead limit < 0");
        }

        // TS will happily allocate a MAX_INT sized buffer, but Java would throw an OutOfMemoryError.
        // We have to simulate that here.
        if (readAheadLimit > 1024 * 1024) {
            throw new OutOfMemoryError("Read-ahead limit exceeds buffer size");
        }

        if (readAheadLimit > this.#buffer.length) {
            const newBuffer = new Uint16Array(readAheadLimit);
            newBuffer.set(this.#buffer);
            this.#buffer = newBuffer;
        }

        this.#mark = this.#currentIndex;
    }

    /**
     *  Tells whether this stream supports the mark() operation, which it does.
     *
     * @returns true if and only if this stream supports the mark operation.
     */
    public override markSupported(): boolean {
        return true;
    }

    public override read(): int;
    public override read(buffer: Uint16Array): int;
    public override read(buffer: Uint16Array, offset: int, count: int): int;
    public override read(target: CharBuffer): int;
    public override read(...args: unknown[]): int {
        this.checkOpen();

        switch (args.length) {
            case 0: {
                // Read a single character.
                if (this.#currentIndex >= this.#limit) {
                    this.#currentIndex = 0;
                    const count = this.#input.read(this.#buffer);
                    if (count === -1) {
                        return -1;
                    }
                    this.#limit = count;
                }

                return this.#buffer[this.#currentIndex++];
            }

            case 1: {
                const target = args[0] as CharBuffer | Uint16Array;
                if (target instanceof CharBuffer) {
                    const buffer = new Uint16Array(target.remaining());
                    const read = this.read(buffer, 0, buffer.length);
                    if (read > 0) {
                        target.put(buffer.subarray(0, read));
                    }

                    return read;
                }

                return this.read(target, 0, target.length);
            }

            case 3: {
                // Read a (possibly large) amount of characters.
                const [buffer, offset, count] = args as [Uint16Array, int, int];
                if (offset < 0 || count < 0 || count + offset > buffer.length) {
                    throw new IndexOutOfBoundsException();
                }

                // Check if we have enough data in the buffer.
                const remaining = this.#limit - this.#currentIndex;
                if (count <= remaining) {
                    // If so, just copy it.
                    buffer.set(this.#buffer.subarray(this.#currentIndex, this.#currentIndex + count), offset);
                    this.#currentIndex += count;

                    return count;
                }

                // Otherwise, copy what we have and read more.
                buffer.set(this.#buffer.subarray(this.#currentIndex, this.#limit), offset);
                this.#limit = 0;
                this.#currentIndex = 0;

                let read = remaining;
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
                        this.#limit = result;
                        read = count;

                        break;
                    }

                    buffer.set(this.#buffer.subarray(0, result), offset + read);
                    read += result;
                }

                return read;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /**
     * Reads a line of text.
     *
     * @returns A String containing the contents of the line, not including any line-termination characters, or null if
     *          the end of the stream has been reached.
     */
    public readLine(): JavaString | null {
        if (this.#currentIndex >= this.#limit) {
            this.fillBuffer();
            if (this.#limit === 0) {
                return null;
            }
        }

        const builder = new StringBuilder();
        while (this.#limit > 0) {
            let run = this.#currentIndex;
            while (run < this.#limit) {
                if (this.#buffer[run] === 0xA || this.#buffer[run] === 0xD) {
                    builder.append(this.#buffer.subarray(this.#currentIndex, run));
                    const result = builder.toString();

                    // Since we have our line, we are done here. However, if the line break is a \r\n sequence, we
                    // need to skip the \n on next buffer fill. We could do that instead by filling the buffer again
                    // and read the next character, but that would be a waste of time.
                    if (this.#buffer[run++] === 0xD) {
                        if (run === this.#limit) {
                            this.#skipNextLineFeed = true;
                        } else if (this.#buffer[run] === 0xA) {
                            run++;
                        }
                    }
                    this.#currentIndex = run;

                    return result;
                }

                run++;
            }

            // Input buffer exhausted. Read more.
            builder.append(this.#buffer.subarray(this.#currentIndex, run));
            this.fillBuffer();
        }

        const result = builder.toString();
        this.#currentIndex = this.#limit;

        return result;
    }

    /**
     * Tells whether this stream is ready to be read. A buffered character stream is ready if the buffer is not empty,
     * or if the underlying character stream is ready.
     *
     * @returns True if the next read() is guaranteed not to block for input, false otherwise. Note that returning
     *          false does not guarantee that the next read will block.
     */
    public override ready(): boolean {
        if (this.#skipNextLineFeed) {
            // We have to skip the next \n after a \r, which may require to read more data.
            if (this.#currentIndex === this.#limit && this.#input.ready()) {
                this.checkOpen();
                this.fillBuffer(); // This will also skip the \n if it is the next character.
            }
        }

        // Ready when we have data in the buffer or more data is available.
        return this.#currentIndex < this.#limit || this.#input.ready();
    }

    /** Resets the stream to the most recent mark. */
    public override reset(): void {
        if (!this.markSupported()) {
            throw new IOException("Mark not supported");
        }

        if (this.#mark === -1) {
            throw new IOException("Mark not set");
        }

        this.#currentIndex = this.#mark;
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

    public fillBuffer(): void {
        this.#currentIndex = 0;
        const count = this.#input.read(this.#buffer);
        this.#limit = count === -1 ? 0 : count;

        if (this.#skipNextLineFeed) {
            if (this.#limit > 0 && this.#buffer[0] === 0xA) {
                this.#currentIndex++;
            }

            this.#skipNextLineFeed = false;
        }
    }

    /** @throws IOException if the underlying reader has been closed. */
    private checkOpen(): void {
        if (this.#buffer.length === 0) {
            throw new IOException("Stream closed");
        }
    }
}
