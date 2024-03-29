/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError.js";
import { int } from "../../types.js";
import { JavaObject } from "../lang/Object.js";
import { JavaString } from "../lang/String.js";
import { Closeable } from "./Closeable.js";
import { Flushable } from "./Flushable.js";

/**
 * This is the base class for all output streams. An output stream accepts output bytes and sends them to some sink.
 */
export abstract class OutputStream extends JavaObject implements Closeable, Flushable {
    /** @returns a new OutputStream which discards all bytes. */
    public static nullOutputStream(): OutputStream {
        return new class extends OutputStream {
            public override write(b: Int8Array): void;
            public override write(b: Int8Array, off: number, len: number): void;
            public override write(b: number): void;
            public override write(...args: unknown[]): void {
                // Nothing to do here.
            }
        }();
    }

    /** Flushes this output stream and forces any buffered output bytes to be written out. */
    public flush(): void {
        // Nothing to do here.
    }

    /** Closes this output stream and releases any system resources associated with this stream. */
    public close(): void {
        // Nothing to do here.
    }

    public override toString(): JavaString {
        return new JavaString(super.toString());
    }

    /** Writes b.length bytes from the specified byte array to this output stream. */
    public write(b: Int8Array): void;
    /** Writes len bytes from the specified byte array starting at offset off to this output stream. */
    public write(b: Int8Array, off: number, len: number): void;
    /** Writes the specified byte to this output stream. */
    public write(b: int): void;
    public write(...args: unknown[]): void {
        if (typeof args[0] === "number") {
            throw new NotImplementedError("abstract");
        }

        const b = args[0] as Int8Array;
        let offset = 0;
        let length = b.length;
        if (args.length > 1) {
            offset = args[1] as number;
            length = args[2] as number;
        }

        for (let i = offset; i < offset + length; i++) {
            this.write(b[i]);
        }
    }

}
