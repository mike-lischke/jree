/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { char, int } from "../../types.js";

import { StringBuffer } from "../lang/StringBuffer.js";
import { CharSequence } from "../lang/CharSequence.js";
import { Writer } from "./Writer.js";
import { JavaString } from "../lang/String.js";

export class StringWriter extends Writer {
    #buffer = new StringBuffer();

    /** Create a new string writer using the default initial string-buffer size. */
    public constructor();
    /** Create a new string writer using the specified initial string-buffer size. */
    public constructor(initialSize: number);
    public constructor() {
        super();
    }

    /** Appends the specified character to this writer. */
    public override append(c: int): this;
    /** Appends the specified character sequence to this writer. */
    public override append(csq: CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this writer. */
    public override append(csq: CharSequence, start: int, end: int): this;
    public override append(...args: unknown[]): this {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                this.#buffer.append(args[0]);
            } else {
                this.#buffer.append(args[0] as CharSequence);
            }
        } else if (args.length === 3) {
            this.#buffer.append(args[0] as CharSequence, args[1] as int, args[2] as int);
        }

        return this;
    }

    public override close(): void {
        // Nothing to do.
    }

    public override flush(): void {
        // Nothing to do.
    }

    /** @returns the string buffer itself. */
    public getBuffer(): StringBuffer {
        return this.#buffer;
    }

    public override toString(): JavaString {
        return this.#buffer.toString();
    }

    /** Writes an array of characters. */
    public override write(buffer: Uint16Array): void;
    /** Write a portion of an array of characters. */
    public override write(buffer: Uint16Array, offset: int, length: int): void;
    /** Write a single character. */
    public override write(c: char): void;
    /** Write a string. */
    public override write(str: string | JavaString): void;
    /** Write a portion of a string. */
    public override write(str: string | JavaString, offset: int, length: int): void;
    public override write(...args: unknown[]): void {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                this.#buffer.append(args[0]);
            } else if (typeof args[0] === "string") {
                this.#buffer.append(args[0]);
            } else {
                this.#buffer.append(args[0] as CharSequence);
            }
        } else if (args.length === 3) {
            const str = args[0] as string | JavaString | Uint16Array;
            const start = args[1] as int;
            const length = args[2] as int;

            if (str instanceof Uint16Array) {
                this.#buffer.append(str, start, length);
            } else {
                if (str instanceof JavaString) {
                    this.#buffer.append(str, start, length);
                } else {
                    this.#buffer.append(str.substring(start, start + length));
                }
            }
        }
    }
}
