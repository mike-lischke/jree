/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { InputStream } from "./InputStream";
import { AutoCloseable } from "../lang/AutoCloseable";
import { FileChannel } from "../nio/channels/FileChannel";
import { StandardOpenOption } from "../nio/file/StandardOpenOption";
import { FileSystems } from "../nio/file/FileSystems";
import { ByteBuffer } from "../nio/ByteBuffer";
import { JavaFile } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { JavaString } from "../lang/String";
import { NotImplementedError } from "../../NotImplementedError";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

export class FileInputStream extends InputStream implements AutoCloseable {
    #channel: FileChannel;

    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the File object
     * file in the file system.
     */
    public constructor(file: JavaFile);
    /**
     * Creates a FileInputStream by using the file descriptor fdObj, which represents an existing connection
     * to an actual file in the file system.
     */
    public constructor(fdObj: FileDescriptor);
    /**
     * Creates a FileInputStream by opening a connection to an actual file, the file named by the path name
     * in the file system.
     */
    public constructor(name: JavaString);
    public constructor(fileOrFdObjOrName: JavaFile | FileDescriptor | JavaString) {
        super();

        if (fileOrFdObjOrName instanceof JavaFile) {
            this.#channel = FileChannel.open(fileOrFdObjOrName.toPath(), StandardOpenOption.READ);
        } else if (fileOrFdObjOrName instanceof JavaString) {
            const path = FileSystems.getDefault().getPath(fileOrFdObjOrName);
            this.#channel = FileChannel.open(path, StandardOpenOption.READ);
        } else {
            throw new NotImplementedError();
        }
    }

    /** Closes this file input stream and releases any system resources associated with the stream. */
    public override close(): void {
        this.#channel.close();
    }

    /** @returns the FileChannel object associated with this file input stream. */
    public getChannel(): FileChannel {
        return this.#channel;
    }

    /** Reads the next byte of data from the input stream. */
    public read(): number;
    /** Reads some number of bytes from the input stream and stores them into the buffer array b. */
    public read(b: Uint8Array): number;
    /** Reads up to len bytes of data from the input stream into an array of bytes. */
    public read(b: Uint8Array, offset: number, length: number): number;
    public read(b?: Uint8Array, offset?: number, length?: number): number {
        if (!b) {
            const buffer = ByteBuffer.allocate(1);
            const read = this.#channel.read(buffer);

            if (read === 0) {
                return -1;
            }

            return buffer.get(0);
        }

        offset ??= 0;
        length ??= b.length;

        if (offset < 0 || length < 0 || offset + length > b.length) {
            throw new IndexOutOfBoundsException();
        }

        const buffer = ByteBuffer.wrap(b, offset, length);
        const read = this.#channel.read([buffer], offset, length);
        //const read = readSync(this.#fd.handle!.fd, b, offset ?? 0, length ?? b.length, null);
        if (read === 0n) {
            return - 1;
        }

        return Number(read);
    }

    public getFD(): FileDescriptor {
        throw new NotImplementedError();
    }
}
