/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { S } from "../../templates.js";
import type { int } from "../../types.js";

import { JavaString } from "../lang/String.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException.js";
import { System } from "../lang/System.js";
import { IOException } from "./IOException.js";

import { Writer } from "./Writer.js";
import { convertStringToUTF16 } from "../../string-helpers.js";

/**
 * Writes text to a character-output stream, buffering characters so as to provide for the efficient writing of single
 * characters, arrays, and strings.
 */
export class BufferedWriter extends Writer {
    #out: Writer | null;
    #buffer: Uint16Array;
    #currentPosition = 0;

    /**
     * Creates a new buffered character-output stream that uses an output
     * buffer of the given size.
     *
     * @param out A Writer
     * @param sz Output-buffer size, a positive integer
     */
    public constructor(out: Writer, sz = 10000) {
        super(out);
        if (sz <= 0) {
            throw new IllegalArgumentException(S`Buffer size <= 0`);
        }

        this.#out = out;
        this.#buffer = new Uint16Array(sz);
        this.#currentPosition = 0;
    }

    public close(): void {
        if (this.#out === null) {
            return;
        }

        try {
            this.flush();
        } finally {
            this.#out.close();
            this.#out = null;
            this.#buffer = new Uint16Array();
        }
    }

    public flush(): void {
        this.checkOpen();

        if (this.#currentPosition > 0) {
            this.#out?.write(this.#buffer, 0, this.#currentPosition);
            this.#currentPosition = 0;
        }

        this.#out?.flush();
    }

    /** Writes a line separator. */
    public newLine(): void {
        this.write(System.lineSeparator());
    }

    /** Writes an array of characters. */
    public override write(buffer: Uint16Array): void;
    /** Writes a portion of an array of characters. */
    public override write(buffer: Uint16Array, offset: int, length: int): void;
    /** Writes a single character. */
    public override write(c: int): void;
    /** Writes a string. */
    public override write(str: string | JavaString): void;
    /** Writes a portion of a string. */
    public override write(str: string | JavaString, offset: int, length: int): void;
    public override write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const source = args[0] as Uint16Array | int | string | JavaString;
                if (typeof source === "number") {
                    if (this.#currentPosition >= this.#buffer.length) {
                        this.flush();
                    }

                    this.#buffer[this.#currentPosition++] = source;
                } else {
                    let data;
                    if (typeof source === "string" || source instanceof JavaString) {
                        data = convertStringToUTF16(source.valueOf());
                    } else {
                        data = source;
                    }

                    if (this.#currentPosition + data.length > this.#buffer.length) {
                        this.flush();
                    }

                    if (data.length >= this.#buffer.length) {
                        this.#out?.write(data);
                    } else {
                        this.#buffer.set(data, this.#currentPosition);
                    }
                }

                break;
            }

            case 3: {
                const [source, offset, length] = args as [Uint16Array | string | JavaString, int, int];

                let data;
                if (typeof source === "string" || source instanceof JavaString) {
                    data = convertStringToUTF16(source.valueOf());
                } else {
                    data = source;
                }

                if ((offset < 0) || (length < 0) || ((offset + length) > data.length)) {
                    throw new IndexOutOfBoundsException();
                }

                if (length > 0) {
                    if (this.#currentPosition + length > this.#buffer.length) {
                        this.flush();
                    }

                    if (length >= this.#buffer.length) {
                        this.#out?.write(data, offset, length);
                    } else {
                        this.#buffer.set(data.subarray(offset, offset + length), this.#currentPosition);
                    }

                    this.#currentPosition += length;
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /** Checks to make sure that the stream has not been closed */
    private checkOpen(): void {
        if (this.#out === null) {
            throw new IOException(S`Stream closed`);
        }
    }
}
