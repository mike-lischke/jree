/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import * as fs from "fs/promises";
import { writeSync } from "fs";

import { OutputStream } from "./OutputStream";
import { FileDescriptor } from "./FileDescriptor";
import { JavaFile } from "./File";
import { JavaString } from "../lang/String";
import { FileNotFoundException } from "./FileNotFoundException";
import { Throwable } from "../lang/Throwable";
import { IOException } from "./IOException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

export class FileOutputStream extends OutputStream {

    private fd: FileDescriptor;
    private path?: string;
    private closed = true;

    /** Creates a file output stream to write to the file represented by the specified File object. */
    public constructor(file: JavaFile, append?: boolean);
    /**
     * Creates a file output stream to write to the specified file descriptor, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: FileDescriptor);
    /** Creates a file output stream to write to the file with the specified name. */
    public constructor(name: JavaString, append?: boolean);
    public constructor(fileOrFdObjOrName: JavaFile | FileDescriptor | JavaString, append?: boolean) {
        super();

        try {
            if (fileOrFdObjOrName instanceof FileDescriptor) {
                this.fd = fileOrFdObjOrName;
            } else {
                this.path = fileOrFdObjOrName instanceof JavaFile
                    ? fileOrFdObjOrName.getAbsolutePath().valueOf()
                    : fileOrFdObjOrName.valueOf();
                this.fd = new FileDescriptor();
                this.open(append ?? false);
            }
        } catch (error) {
            throw new FileNotFoundException(new JavaString("Create open or create file"), Throwable.fromError(error));
        }
    }

    /** Closes this output stream and releases any system resources associated with this stream. */
    public override close(): void {
        if (this.closed) {
            return;
        }

        this.closed = true;
        this.fd.closeAll(new class {
            public constructor(private fd: FileDescriptor) { }

            public close(): void {
                this.fd.close();
            }
        }(this.fd));
    }

    /** Flushes this output stream and forces any buffered output bytes to be written out. */
    public override flush(): void {
        this.fd.sync();
    }

    /** Writes b.length bytes from the specified byte array to this output stream. */
    public override write(b: Int8Array): void;
    /** Writes len bytes from the specified byte array starting at offset off to this output stream. */
    public override write(b: Int8Array, offset: number, length: number): void;
    /** Writes the specified byte to this output stream. */
    public override write(b: number): void;
    public override write(b: Int8Array | number, offset?: number, length?: number): void {
        if (!this.fd.valid()) {
            throw new IOException(new JavaString("Cannot write data because the file handle is invalid."));
        }

        try {
            if (typeof b === "number") {
                const buffer = new Int8Array(1);
                buffer[0] = b;
                writeSync(this.fd.handle!.fd, buffer, 0, 1);
            } else {
                offset ??= 0;
                length ??= b.length;
                if (offset < 0 || length < 0 || offset + length > b.length) {
                    throw new IndexOutOfBoundsException();
                }

                writeSync(this.fd.handle!.fd, b, offset, length);
            }
        } catch (error) {
            throw new IOException(new JavaString("`Cannot write data to file"), Throwable.fromError(error));
        }
    }

    public getFD(): FileDescriptor {
        return this.fd;
    }

    private open(append: boolean): void {
        if (this.path) {
            fs.open(this.path, append ? "as" : "w", 0x400).then((handle) => {
                this.fd.handle = handle;
                this.closed = false;
            }).catch((reason) => {
                throw new IOException(new JavaString("Cannot open file"), Throwable.fromError(reason));
            });
        }
    }
}
