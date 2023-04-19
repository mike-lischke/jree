/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { S } from "../../templates";
import { int, long } from "../../types";

import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { JavaString } from "../lang/String";
import { CharBuffer } from "../nio";
import { Reader } from "./Reader";

/** A character stream whose source is a string. */
export class StringReader extends Reader {
    #content: JavaString;
    #mark = -1;
    #position = 0;

    /**
     * Creates a new string reader.
     *
     * @param s String providing the character stream.
     */
    public constructor(s: JavaString | string) {
        super();
        this.#content = typeof s === "string" ? new JavaString(s) : s;
    }

    /**
     * Closes the stream and releases any system resources associated with it.
     */
    public close(): void {
        // Nothing to do.
    }

    /**
     * Marks the present position in the stream.
     *
     * @param readAheadLimit Limit on the number of characters that may be read while still preserving the mark.
     *                       Because the stream's input comes from a string, there is no actual limit, so this
     *                       argument must not be negative, but is otherwise ignored.
     */
    public override mark(readAheadLimit: int): void {
        if (readAheadLimit < 0) {
            throw new IllegalArgumentException(S`readAheadLimit < 0`);
        }

        this.#mark = this.#position;
    }

    /**
     * Tells whether this stream supports the mark() operation.
     *
     * @returns true
     */
    public override markSupported(): boolean {
        return true;
    }

    public override read(): int;
    public override read(target: CharBuffer): int;
    public override read(target: Uint16Array): int;
    public override read(target: Uint16Array, offset: int, length: int): int;
    public override read(...args: unknown[]): int {
        switch (args.length) {
            case 0: {
                if (this.#position >= this.#content.length()) {
                    return -1;
                }

                return this.#content.codePointAt(this.#position++);
            }

            case 1: {
                if (args[0] instanceof CharBuffer) {
                    return super.read(args[0]);
                } else {
                    return super.read(args[0] as Uint16Array);
                }
            }

            case 3: {
                const [target, offset, length] = args as [Uint16Array, number, number];

                if (offset < 0 || length < 0 || offset + length > target.length) {
                    throw new IndexOutOfBoundsException();
                }

                if (this.#position >= this.#content.length()) {
                    return -1;
                }

                const count = Math.min(this.#content.length() - this.#position, length);
                for (let i = 0; i < count; ++i) {
                    target[offset + i] = this.#content.codePointAt(this.#position + i);
                }

                this.#position += count;

                return count;
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Tells whether this stream is ready to be read.
     * A StringReader is always ready to be read.
     *
     * @returns true
     */
    public override ready(): boolean {
        return true;
    }

    /**
     * Resets the stream to the most recent mark, or to the beginning of the string if it has never been marked.
     */
    public override reset(): void {
        if (this.#mark === -1) {
            this.#position = 0;
        } else {
            this.#position = this.#mark;
        }
    }

    /**
     * Skips characters.
     *
     * @param n The number of characters to skip.
     *
     * @returns The number of characters actually skipped.
     */
    public override skip(n: long): long {
        let count = 0;
        const nn = Number(n);

        if (n < 0) {
            count = -Math.min(this.#position, -nn);
        } else {
            count = Math.min(this.#content.length() - this.#position, nn);
        }
        this.#position += count;

        return BigInt(count);
    }

}
