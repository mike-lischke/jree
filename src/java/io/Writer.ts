/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { char, int } from "../../types";
import { CharSequence } from "../lang/CharSequence";
import { JavaString } from "../lang/String";
import { Appendable } from "../lang/Appendable";
import { JavaObject } from "../lang/Object";
import { Closeable } from "./Closeable";
import { Flushable } from "./Flushable";
import { IllegalArgumentException } from "../lang";
import { NotImplementedError } from "../../NotImplementedError";
import { convertStringToUTF16 } from "../../string-helpers";

/**
 * Abstract class for writing to character streams. The only methods that a subclass must implement are
 * `write(char[], int, int)`, `flush()`, and `close()`. Most subclasses, however, will override some of the methods
 * defined here in order to provide higher efficiency, additional functionality, or both.
 */
export abstract class Writer extends JavaObject implements Closeable, Flushable, Appendable {
    /**
     * The object used to synchronize operations on this stream.
     * Note: this is not used in TS to synchronize anything, because there's only a single thread.
     */
    protected lock: JavaObject;

    /**
     * Creates a new character-stream writer whose critical sections will
     * synchronize on the given object.
     *
     * @param  lock Object to synchronize on (not used in the TS implementation).
     */
    protected constructor(lock?: JavaObject) {
        super();

        this.lock = lock ?? this;
    }

    /** @returns a new Writer which discards all characters. */
    public static nullWriter(): Writer {
        return new class extends Writer {
            public override close(): void {
                // Do nothing.
            }

            public override flush(): void {
                // Do nothing.
            }

            public override write(c: Uint16Array): void;
            public override write(c: Uint16Array, offset: int, length: int): void;
            public override write(c: int): void;
            public override write(c: JavaString): void;
            public override write(c: JavaString, offset: int, length: int): void;
            public override write(...args: unknown[]): void {
                // Do nothing.
            }
        }();
    }

    /**
      Appends the specified character to this writer.
     */
    public append(c: char): this;
    /** Appends the specified character sequence to this writer. */
    public append(csq: CharSequence | null): this;
    /** Appends a subsequence of the specified character sequence to this writer. */
    public append(csq: CharSequence | null, start: int, end: int): this;
    public append(...args: unknown[]): this {
        if (typeof args[0] === "number") {
            this.write(args[0]);
        } else {
            const [csq, start, end] = args as [CharSequence | null, int, int];
            const s = csq === null ? "null" : csq.toString();
            this.write(s, start, end - start);
        }

        return this;
    }

    /** Writes an array of characters. */
    public write(buffer: Uint16Array): void;
    /** Writes a portion of an array of characters. */
    public /* abstract */write(buffer: Uint16Array, offset: int, length: int): void;
    /** Writes a single character. */
    public write(c: int): void;
    /** Writes a string. */
    public write(str: JavaString | string): void;
    /** Writes a portion of a string. */
    public write(str: JavaString | string, offset: int, length: int): void;
    public write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const value = args[0] as int | Uint16Array | JavaString | string;

                let array;
                if (value instanceof Uint16Array) {
                    array = value;
                } else if (value instanceof JavaString) {
                    array = value.array();
                } else if (typeof value === "string") {
                    array = convertStringToUTF16(value);
                } else {
                    array = new Uint16Array(1);
                    array[0] = value & 0xFFFF;

                    break;
                }

                this.write(array, 0, array.length);
                break;
            }

            case 3: {
                const [buffer, offset, length] = args as [Uint16Array | JavaString | string, int, int];
                if (buffer instanceof JavaString) {
                    this.write(buffer.array(), offset, length);
                } else if (typeof buffer === "string") {
                    const array = convertStringToUTF16(buffer);
                    this.write(array, offset, length);
                } else {
                    throw new NotImplementedError("abstract");
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }

        if (args.length === 1) {
            this.write(args[0] as Uint16Array);
        } else if (args.length === 3) {
            const [c, offset, length] = args as [Uint16Array, int, int];
            this.write(c, offset, length);
        } else {
            const [c, offset, length] = args as [JavaString, int, int];
            this.write(c.toString(), offset, length);
        }
    }

    /** Closes the stream, flushing it first. */
    public abstract close(): void;

    /** Flushes the stream. */
    public abstract flush(): void;
}
