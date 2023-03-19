/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { openSync, writeSync } from "fs";

import { OutputStream } from "./OutputStream";
import { FileDescriptor } from "./FileDescriptor";
import { JavaFile } from "./File";
import { JavaString } from "../lang/String";
import { FileNotFoundException } from "./FileNotFoundException";
import { Throwable } from "../lang/Throwable";
import { IOException } from "./IOException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { AutoCloseable } from "../lang/AutoCloseable";
import { JavaObject } from "../lang/Object";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

/**
 * A file output stream is an output stream for writing data to a File or to a FileDescriptor. Whether or not a file
 * is available or may be created depends upon the underlying platform. Some platforms, in particular, allow a file
 * to be opened for writing by only one FileOutputStream (or other file-writing object) at a time. In such situations
 * the constructors in this class will fail if the file involved is already open.
 */
export class FileOutputStream extends OutputStream {

    private fd: FileDescriptor;
    private path?: string;
    private closed = true;

    public constructor(file: JavaFile);
    /**
     * Creates a file output stream to write to the specified file descriptor, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: FileDescriptor);
    /** Creates a file output stream to write to the file represented by the specified File object. */
    public constructor(file: JavaFile, append: boolean);
    public constructor(name: JavaString | string);
    /** Creates a file output stream to write to the file with the specified name. */
    public constructor(name: JavaString | string, append: boolean);
    public constructor(...args: unknown[]) {
        super();

        try {
            switch (args.length) {
                case 1: {
                    const arg = args[0] as JavaFile | FileDescriptor | JavaString | string;
                    if (arg instanceof JavaFile) {
                        this.path = arg.getAbsolutePath().valueOf();
                        this.fd = new FileDescriptor();
                        this.open(false);
                    } else if (arg instanceof FileDescriptor) {
                        this.fd = arg;
                    } else {
                        this.path = arg.valueOf();
                        this.fd = new FileDescriptor();
                        this.open(false);
                    }

                    break;
                }

                case 2: {
                    const [fileOrFdObjOrName, append] =
                        args as [JavaFile | FileDescriptor | JavaString | string, boolean];
                    if (fileOrFdObjOrName instanceof JavaFile) {
                        this.path = fileOrFdObjOrName.getAbsolutePath().valueOf();
                        this.fd = new FileDescriptor();
                        this.open(append);
                    } else if (fileOrFdObjOrName instanceof FileDescriptor) {
                        this.fd = fileOrFdObjOrName;
                    } else {
                        this.path = fileOrFdObjOrName.valueOf();
                        this.fd = new FileDescriptor();
                        this.open(append);
                    }

                    break;
                }

                default: {
                    throw new IllegalArgumentException("Wrong number of arguments");
                }
            }
        } catch (error) {
            throw new FileNotFoundException(Throwable.fromError(error));
        }
    }

    /** Closes this output stream and releases any system resources associated with this stream. */
    public override close(): void {
        if (this.closed) {
            return;
        }

        this.closed = true;
        this.fd.closeAll(new class extends JavaObject implements AutoCloseable {
            public constructor(private fd: FileDescriptor) {
                super();
            }

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
                writeSync(this.fd.handle!, buffer, 0, 1);
            } else {
                offset ??= 0;
                length ??= b.length;
                if (offset < 0 || length < 0 || offset + length > b.length) {
                    throw new IndexOutOfBoundsException();
                }

                writeSync(this.fd.handle!, b, offset, length);
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
            try {
                const handle = openSync(this.path, append ? "as" : "w", 0x400);
                this.fd.handle = handle;
                this.closed = false;
            } catch (error) {
                throw new IOException(new JavaString("Cannot open file"), Throwable.fromError(error));
            }
        }
    }
}
