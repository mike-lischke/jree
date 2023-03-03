/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { StringDecoder } from "string_decoder";

import { char } from "../lang";
import { JavaString } from "../lang/String";
import { CharBuffer } from "../nio/CharBuffer";
import { Charset } from "../nio/charset/Charset";
import { InputStream } from "./InputStream";
import { Reader } from "./Reader";
import { UnsupportedEncodingException } from "./UnsupportedEncodingException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

export class InputStreamReader extends Reader {
    // The size of the raw buffer used to keep input data.
    private static readonly readBufferSize = 8192;

    private buffer = Buffer.alloc(InputStreamReader.readBufferSize);

    private encoding: JavaString;
    private decoder: StringDecoder;
    private currentText = "";

    private eof = false;

    public constructor(input: InputStream, charsetName?: JavaString);
    public constructor(input: InputStream, cs?: Charset);
    public constructor(private input: InputStream,
        charsetNameOrCs?: JavaString | Charset) {
        super();

        if (!charsetNameOrCs) {
            this.encoding = Charset.defaultCharset().name();
        } else if (charsetNameOrCs instanceof Charset) {
            this.encoding = charsetNameOrCs.name();
        } else {
            this.encoding = charsetNameOrCs;
        }

        const encoding = this.encoding.valueOf();
        if (Buffer.isEncoding(encoding)) {
            this.decoder = new StringDecoder(encoding);
        } else {
            throw new UnsupportedEncodingException(new JavaString("Invalid charset specified"));
        }
    }

    /** Closes the stream and releases any system resources associated with it. */
    public close(): void {
        this.input.close();
    }

    /** @returns the name of the character encoding being used by this stream. */
    public getEncoding(): JavaString {
        return this.encoding;
    }

    /** Reads a single character. */
    public override read(): char;
    public override read(chars: Uint16Array | CharBuffer): number;
    /** Reads characters into a portion of an array. */
    public override read(chars: Uint16Array, offset: number, length: number): number;
    public override read(chars?: Uint16Array | CharBuffer, offset?: number, length?: number): char | number {
        if (!this.ready()) {
            return -1;
        }

        if (!chars) {
            // Single character variant.
            if (this.currentText.length === 0) {
                this.currentText = this.readNextChunk();
            }

            if (this.currentText.length === 0) {
                return -1;
            }

            const c = this.currentText.charCodeAt(0)!;
            this.currentText = this.currentText.substring(1);

            return c;
        }

        offset ??= 0;
        length ??= chars instanceof Uint16Array ? chars.length : chars.length();

        const end = offset + length;
        if (offset < 0 || length < 0 || end > chars.length) {
            throw new IndexOutOfBoundsException();
        }

        let processed = 0;
        while (length > 0) {
            if (length <= this.currentText.length) {
                if (chars instanceof Uint16Array) {
                    for (const c of this.currentText.substring(0, length)) {
                        chars[offset++] = c.charCodeAt(0)! & 0xFFFF;
                    }
                } else {
                    for (const c of this.currentText.substring(0, length)) {
                        chars.put(offset++, c.charCodeAt(0)! & 0xFFFF);
                    }
                }

                processed += length;
                length = 0;
            } else {
                // Not enough data available. Write what we have and load the next chunk.
                if (chars instanceof Uint16Array) {
                    for (const c of this.currentText) {
                        chars[offset++] = c.charCodeAt(0) & 0xFFFF;
                    }
                } else {
                    for (const c of this.currentText) {
                        chars.put(offset++, c.charCodeAt(0) & 0xFFFF);
                    }
                }

                processed += this.currentText.length;
                length -= this.currentText.length;

                if (this.eof) {
                    this.currentText = "";
                    break;
                }

                this.currentText = this.readNextChunk();
            }
        }

        return processed;
    }

    /**
     * Tells whether this stream is ready to be read.
     *
     * @returns true if the next read() is guaranteed not to block for input, false otherwise.
     */
    public override ready(): boolean {
        return this.currentText.length > 0 || this.input.available() > 0;
    }

    /** @returns as many characters as can be decoded with one buffer content. */
    private readNextChunk(): string {
        const count = this.input.read(this.buffer);
        if (count === -1) {
            this.eof = true;

            return this.decoder.end();
        }

        return this.decoder.write(this.buffer.subarray(0, count));
    }
}
