/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
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
    public append(csq: CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this writer. */
    public append(csq: CharSequence, start: int, end: int): this;
    public append(...args: unknown[]): this {
        if (typeof args[0] === "number") {
            this.write(args[0]);
        } else {
            const [csq, start, end] = args as [CharSequence, int, int];
            this.write(csq.toString(), start, end);
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
    public write(str: JavaString): void;
    /** Writes a portion of a string. */
    public write(str: JavaString, offset: int, length: int): void;
    public write(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                let array;
                if (args[0] instanceof Uint16Array) {
                    array = args[0];
                } else if (args[0] instanceof JavaString) {
                    array = args[0].array();
                } else {
                    array = new Uint16Array(1);
                    array[0] = (args[0] as int) & 0xFFFF;

                    break;
                }

                this.write(array, 0, array.length);
                break;
            }

            case 3: {
                if (args[0] instanceof JavaString) {
                    const [c, offset, length] = args as [JavaString, int, int];
                    this.write(c.array(), offset, length);
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
