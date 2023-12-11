/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { OutputStream } from "./OutputStream.js";

/** Internal class to provide print stream like access to stdout and stderr. */
export class SystemOutputStream extends OutputStream {
    #decoder = new TextDecoder("utf-8");

    public constructor(private forErrors: boolean) {
        super();
    }

    public override close(): void {
        // no-op
    }

    public override flush(): void {
        // The stream auto-flushes.
    }

    public override write(b: Int8Array | number): void;
    public override write(b: Int8Array, off: number, len: number): void;
    public override write(b: Int8Array | number, off?: number, len?: number): void {
        if (typeof b === "number") {
            const s = String.fromCodePoint(b);
            this.forErrors ? process.stderr.write(s) : process.stdout.write(s);
        } else {
            const offset = off ?? 0;
            const length = len ?? b.length;
            const s = this.#decoder.decode(b.subarray(offset, length));
            this.forErrors
                ? process.stderr.write(s)
                : process.stdout.write(s);
        }
    }
}
