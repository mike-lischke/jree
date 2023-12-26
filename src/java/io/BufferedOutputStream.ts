/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { FilterOutputStream } from "./FilterOutputStream.js";
import { OutputStream } from "./OutputStream.js";

export class BufferedOutputStream extends FilterOutputStream {

    protected buf: Int8Array;
    protected count = 0;

    public constructor(out: OutputStream, size = 0xFFFF) {
        super(out);

        if (size <= 0) {
            throw new IllegalArgumentException();
        }

        this.buf = new Int8Array(size);
    }

    public override write(b: Int8Array): void;
    public override write(b: Int8Array, off: number, len: number): void;
    public override write(b: number): void;
    public override write(b: Int8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            this.buf[this.count++] = b & 0xFF;
            if (this.count === this.buf.length) {
                this.flush();
            }
        } else {
            const offset = off ?? 0;
            const length = len ?? b.length;
            if (offset + length > b.length) {
                throw new IllegalArgumentException(
                    `The specified values exceed the size of the specified source.`);
            }

            const data = b.subarray(offset, offset + length);

            // Write the new data directly if it exceeds the buffer size.
            if (this.count + data.length >= this.buf.length) {
                this.flush();

                this.out.write(data);
            } else {
                this.buf.set(data, this.count);
                this.count += data.length;
            }
        }
    }

    public override flush(): void {
        if (this.count > 0) {
            this.out.write(this.buf, 0, this.count);
            this.count = 0;
        }
    }

    public override close(): void {
        this.out.close();
    }
}
