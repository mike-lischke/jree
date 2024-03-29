/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../types.js";

import { JavaString } from "../lang/String.js";
import { Charset } from "../nio/charset/Charset.js";
import { OutputStream } from "./OutputStream.js";
import { Writer } from "./Writer.js";
import { CharsetEncoder } from "../nio/charset/CharsetEncoder.js";
import { CharBuffer } from "../nio/CharBuffer.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException.js";

/**
 * An OutputStreamWriter is a bridge from character streams to byte streams: Characters written to it are encoded
 * into bytes using a specified charset. The charset that it uses may be specified by name or may be given explicitly,
 * or the platform's default charset may be accepted.
 */
export class OutputStreamWriter extends Writer {
    #encoder: CharsetEncoder;
    #out: OutputStream;

    /** Creates an OutputStreamWriter that uses the default character encoding. */
    public constructor(out: OutputStream);
    /** Creates an OutputStreamWriter that uses the named charset. */
    public constructor(out: OutputStream, charsetName: JavaString | string);
    /** Creates an OutputStreamWriter that uses the given charset. */
    public constructor(out: OutputStream, cs: Charset);
    /** Creates an OutputStreamWriter that uses the given charset encoder. */
    public constructor(out: OutputStream, enc: CharsetEncoder);
    public constructor(...args: unknown[]) {
        const out = args[0] as OutputStream;
        super(out);

        this.#out = out;
        if (args.length > 1) {
            const arg = args[1] as JavaString | string | Charset | CharsetEncoder;
            if (arg instanceof JavaString || typeof arg === "string") {
                this.#encoder = Charset.forName(arg).newEncoder();
            } else if (arg instanceof Charset) {
                this.#encoder = arg.newEncoder();
            } else {
                this.#encoder = arg;
            }
        } else {
            this.#encoder = Charset.defaultCharset().newEncoder();
        }
    }

    /** Closes the stream, flushing it first. */
    public close(): void {
        this.flush();
        this.#out.close();
    }

    /** Flushes the stream. */
    public flush(): void {
        this.#out.flush();
    }

    /** @returns the name of the character encoding being used by this stream. */
    public getEncoding(): JavaString {
        return new JavaString("utf-8");
        //return this.#encoder.charset().name();
    }

    public override write(buffer: Uint16Array): void;
    public override write(buffer: Uint16Array, offset: int, length: int): void;
    public override write(c: int): void;
    public override write(str: JavaString | string): void;
    public override write(str: JavaString | string, offset: int, length: int): void;
    public override write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                let s;
                if (typeof args[0] === "number") {
                    s = JavaString.fromCodePoint(args[0]);
                } else {
                    s = args[0] as JavaString;
                }

                const bytes = this.#encoder.encode(CharBuffer.wrap(s));
                this.#out.write(bytes.array());

                break;
            }

            case 3: {
                const [str, offset, length] = args as [string | JavaString | Uint16Array, int, int];
                const sourceLength = str instanceof JavaString ? str.length() : str.length;
                if (offset < 0 || length < 0 || offset + length > sourceLength) {
                    throw new IndexOutOfBoundsException();
                }

                if (length > 0) {
                    if (typeof str === "string") {
                        const bytes = this.#encoder.encode(
                            CharBuffer.wrap(new JavaString(str), offset, offset + length));
                        this.#out.write(bytes.array());
                    } else if (str instanceof JavaString) {
                        const bytes = this.#encoder.encode(CharBuffer.wrap(str, offset, offset + length));
                        this.#out.write(bytes.array());
                    } else {
                        const bytes = this.#encoder.encode(CharBuffer.wrap(str, offset, length));
                        this.#out.write(bytes.array());
                    }
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }
    }
}
