/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { char, int } from "../../types";
import { convertStringToUTF16 } from "../../string-helpers";

import { JavaString } from "../lang/String";
import { Charset } from "../nio/charset/Charset";
import { InputStream } from "./InputStream";
import { Reader } from "./Reader";
import { UnsupportedEncodingException } from "./UnsupportedEncodingException";
import { CharsetDecoder } from "../nio/charset/CharsetDecoder";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

/**
 * An InputStreamReader is a bridge from byte streams to character streams: It reads bytes and decodes them into
 * characters using a specified charset. The charset that it uses may be specified by name or may be given explicitly,
 * or the platform's default charset may be accepted.
 */
export class InputStreamReader extends Reader {
    private eof = false;

    #decoder: TextDecoder;
    #input: InputStream;

    #currentContent = new Uint16Array(0);
    #currentIndex = 0;

    /** Creates an InputStreamReader that uses the default charset. */
    public constructor(input: InputStream);
    /** Creates an InputStreamReader that uses the named charset. */
    public constructor(input: InputStream, charsetName: JavaString);
    /** Creates an InputStreamReader that uses the given charset. */
    public constructor(input: InputStream, cs: Charset);
    /** Creates an InputStreamReader that uses the given charset decoder. */
    public constructor(input: InputStream, dec: CharsetDecoder);
    public constructor(...args: unknown[]) {
        super();

        this.#input = args[0] as InputStream;
        if (args.length === 1) {
            this.#decoder = new TextDecoder(Charset.defaultCharset().name().valueOf());
        } else {
            const arg = args[1] as CharsetDecoder | Charset | JavaString;
            if (arg instanceof CharsetDecoder) {
                this.#decoder = new TextDecoder(arg.charset().name().valueOf());
            } else if (arg instanceof Charset) {
                this.#decoder = new TextDecoder(arg.name().valueOf());
            } else {
                const cs = Charset.forName(arg);
                if (!cs) {
                    throw new UnsupportedEncodingException(arg);
                }

                this.#decoder = new TextDecoder(cs.name().valueOf());
            }
        }
    }

    public override close(): void {
        this.#input.close();
    }

    /** @returns the name of the character encoding being used by this stream. */
    public getEncoding(): JavaString {
        return new JavaString(this.#decoder.encoding);
    }

    /** Reads a single character. */
    public override read(): char;
    /** Reads characters into an array. */
    public override read(buffer: Uint16Array): int;
    /** Reads characters into a portion of an array. */
    public override read(chars: Uint16Array, offset: int, length: int): int;
    public override read(...args: unknown[]): char | int {
        if (!this.ready()) {
            return -1;
        }

        switch (args.length) {
            case 0: {
                if (this.#currentIndex >= this.#currentContent.length) {
                    this.#currentContent = this.nextChunk();
                    this.#currentIndex = 0;
                }

                return this.#currentContent[this.#currentIndex++];
            }

            case 1: {
                const [buffer] = args as [Uint16Array];

                return this.read(buffer, 0, buffer.length);
            }

            case 3: {
                const [chars, offset, length] = args as [Uint16Array, int, int];
                if (offset < 0 || length < 0 || offset + length > chars.length) {
                    throw new IndexOutOfBoundsException();
                }

                let count = 0;
                const remaining = this.#currentContent.length - this.#currentIndex;
                if (remaining > 0) {
                    const toCopy = Math.min(remaining, length);
                    chars.set(this.#currentContent.subarray(this.#currentIndex, this.#currentIndex + toCopy), offset);
                    this.#currentIndex += toCopy;
                    count += toCopy;
                }

                while (count < length && !this.eof) {
                    this.#currentContent = this.nextChunk();
                    this.#currentIndex = 0;

                    const toCopy = Math.min(this.#currentContent.length, length - count);
                    chars.set(this.#currentContent.subarray(0, toCopy), offset + count);
                    this.#currentIndex += toCopy;
                    count += toCopy;
                }

                return count > 0 ? count : -1;
            }

            default: {
                throw new IllegalArgumentException("Wrong number of arguments");
            }
        }
    }

    /**
     * Tells whether this stream is ready to be read.
     *
     * @returns true if the next read() is guaranteed not to block for input, false otherwise.
     */
    public override ready(): boolean {
        return this.#currentIndex < this.#currentContent.length || this.#input.available() > 0;
    }

    /** @returns as many characters as can be decoded with one buffer content. */
    private nextChunk(): Uint16Array {
        const buffer = new Int8Array(10000);
        const count = this.#input.read(buffer);
        if (count < 10000) {
            this.eof = true;
        }

        const text = this.#decoder.decode(buffer.subarray(0, count), { stream: !this.eof });

        return convertStringToUTF16(text);
    }
}
