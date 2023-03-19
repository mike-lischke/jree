/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable max-classes-per-file */

import {
    closeSync, fstatSync, fsyncSync, Mode, OpenMode, openSync, readSync, truncateSync, unlinkSync, writeSync,
} from "fs";

import { int, long } from "../../../types";

import { NotImplementedError } from "../../../NotImplementedError";

import { JavaString } from "../../lang/String";
import { IllegalArgumentException } from "../../lang/IllegalArgumentException";
import { HashSet } from "../../util/HashSet";
import { JavaSet } from "../../util/Set";
import { ByteBuffer } from "../ByteBuffer";
import { FileAttribute } from "../file/attribute/FileAttribute";
import { OpenOption } from "../file/OpenOption";
import { Path } from "../file/Path";
import { GatheringByteChannel } from "./GatheringByteChannel";
import { ReadableByteChannel } from "./ReadableByteChannel";
import { ScatteringByteChannel } from "./ScatteringByteChannel";
import { SeekableByteChannel } from "./SeekableByteChannel";
import { AbstractInterruptibleChannel } from "./spi/AbstractInterruptibleChannel";
import { WritableByteChannel } from "./WritableByteChannel";
import { StandardOpenOption } from "../file/StandardOpenOption";
import { PosixFilePermissions } from "../file/attribute/PosixFilePermissions";
import { PosixFilePermission } from "../file/attribute/PosixFilePermission";
import { ClosedChannelException } from "./ClosedChannelException";
import { NonWritableChannelException } from "./NonWritableChannelException";
import { NonReadableChannelException } from "./NonReadableChannelException";
import { IOException } from "../../io/IOException";
import { Throwable } from "../../lang/Throwable";

/** A channel for reading, writing, mapping, and manipulating a file. */
export abstract class FileChannel extends AbstractInterruptibleChannel implements SeekableByteChannel,
    GatheringByteChannel, ScatteringByteChannel {

    protected constructor() {
        super();
    }

    /** Opens or creates a file, returning a file channel to access the file. */
    public static open(path: Path,
        ...options: OpenOption[]): FileChannel;
    /** Opens or creates a file, returning a file channel to access the file. */
    public static open(path: Path, options: JavaSet<OpenOption>,
        ...attrs: Array<FileAttribute<unknown>>): FileChannel;
    public static open(...args: unknown[]): FileChannel {
        if (args.length < 2) {
            throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
        }

        if (args[1] instanceof JavaSet) {
            const [path, options, ...attrs] = args as [Path, JavaSet<OpenOption>, Array<FileAttribute<unknown>>];

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return new FileChannelImpl(path, options, ...attrs);
        } else {
            const path = args.shift() as Path;
            const [...rest] = args as OpenOption[];

            const set = new HashSet<OpenOption>();
            rest.forEach((option) => {
                set.add(option);
            });

            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            return new FileChannelImpl(path, set, []);
        }
    }

    /** Reads a sequence of bytes from this channel into the given buffer. */
    public /** abstract */ read(dst: ByteBuffer): int;
    /** Reads a sequence of bytes from this channel into the given buffers. */
    public read(dst: ByteBuffer[]): long;
    /** Reads a sequence of bytes from this channel into a subsequence of the given buffers. */
    public /** abstract */ read(dst: ByteBuffer[], offset: int, length: int): long;
    public read(...args: unknown[]): long | int {
        switch (args.length) {
            case 1: {
                if (args[0] instanceof ByteBuffer) {
                    throw new NotImplementedError("abstract");
                } else {
                    const [dst] = args as [ByteBuffer[]];

                    return this.read(dst, 0, dst.length);
                }
            }

            case 2:
            case 3: {
                throw new NotImplementedError("abstract");
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
            }
        }
    }

    // public tryLock(): FileLock;
    // public tryLock(position: int, size: int, shared: boolean): FileLock;

    /** Writes a sequence of bytes to this channel from the given buffer. */
    public /** abstract */ write(src: ByteBuffer): int;
    /** Writes a sequence of bytes to this channel from the given buffers. */
    public write(src: ByteBuffer[]): long;
    /** Writes a sequence of bytes to this channel from a subsequence of the given buffers. */
    public /** abstract */ write(src: ByteBuffer[], offset: int, length: int): long;
    /** Writes a sequence of bytes to this channel from the given buffer, starting at the given file position. */
    public /** abstract */ write(src: ByteBuffer, position: long): int;
    public write(...args: unknown[]): long | int {
        switch (args.length) {
            case 1: {
                if (args[0] instanceof ByteBuffer) {
                    throw new NotImplementedError("abstract");
                } else {
                    const [src] = args as [ByteBuffer[]];

                    return this.write(src, 0, src.length);
                }
            }

            case 3: {
                throw new NotImplementedError("abstract");
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
            }
        }
    }

    /** Forces any updates to this channel's file to be written to the storage device that contains it. */
    public abstract force(metaData: boolean): void;

    // public lock(): FileLock;
    // public abstract lock(position: int, size: int, shared: boolean): FileLock;

    // public abstract map(mode: FileChannel.MapMode,
    //   position: int, size: int): MappedByteBuffer;

    /** Returns this channel's file position. */
    public abstract position(): long;
    /** Sets this channel's file position. */
    public abstract position(newPosition: long): FileChannel;

    /** Returns the current size of this channel's file. */
    public abstract size(): long;

    /** Transfers bytes into this channel's file from the given readable byte channel. */
    public abstract transferFrom(src: ReadableByteChannel, position: long,
        count: long): long;

    /** Transfers bytes from this channel's file to the given writable byte channel. */
    public abstract transferTo(position: long, count: long,
        target: WritableByteChannel): long;

    /** Truncates the file to the given size. */
    public abstract truncate(size: long): FileChannel;
}

export class FileChannelImpl extends FileChannel {
    #currentPosition = 0n;
    #fileHandle = -1;
    #nativePath = "";

    #deleteOnClose = false;
    #canRead = false;
    #canWrite = false;

    public constructor(path: Path, options: JavaSet<OpenOption>,
        attrs: Array<FileAttribute<unknown>>) {
        super();

        let flags = "";
        if (options.contains(StandardOpenOption.APPEND)) {
            this.#canWrite = true;
            flags += "a";
            if (!options.contains(StandardOpenOption.CREATE)
                || options.contains(StandardOpenOption.CREATE_NEW)) {
                flags += "x";
            }

            if (options.contains(StandardOpenOption.DSYNC)
                || options.contains(StandardOpenOption.SYNC)) {
                flags += "s";
            }

            if (options.contains(StandardOpenOption.READ)) {
                this.#canRead = true;
                flags += "+";
            }
        } else if (options.contains(StandardOpenOption.READ)) {
            this.#canRead = true;
            flags += "r";

            if (options.contains(StandardOpenOption.DSYNC)
                || options.contains(StandardOpenOption.SYNC)) {
                flags += "s";
            }

            if (options.contains(StandardOpenOption.WRITE)) {
                this.#canWrite = true;
                flags += "+";
            }
        } else if (options.contains(StandardOpenOption.WRITE)) {
            this.#canWrite = true;
            flags += "w";

            if (!options.contains(StandardOpenOption.TRUNCATE_EXISTING)) {
                flags += "x";
            }

            if (options.contains(StandardOpenOption.READ)) {
                this.#canRead = true;
                flags += "+";
            }
        }

        this.#nativePath = `${path}`;
        if (options.contains(StandardOpenOption.DELETE_ON_CLOSE)) {
            this.#deleteOnClose = true;
        }

        if (flags.length === 0) {
            flags = "r";
        }

        const permissions = attrs.find((attr) => {
            return attr.name().valueOf() === "posix:permissions";
        })?.value() as JavaSet<PosixFilePermission> | undefined;

        let mode = "666";
        if (permissions) {
            mode = `${PosixFilePermissions.toString(permissions)}`;
        }

        this.open(this.#nativePath, flags, mode);
    }

    public force(metaData: boolean): void {
        fsyncSync(this.#fileHandle);
    }

    // public lock(): FileLock;
    // public lock(position: long, size: long, shared: boolean): FileLock;

    // public map(mode: FileChannel.MapMode, position: long, size: long):
    //   MappedByteBuffer

    public position(): long;
    public position(newPosition: long): FileChannel;
    public position(...args: unknown[]): long | FileChannel {
        if (args.length === 0) {
            return this.#currentPosition;
        } else {
            this.#currentPosition = args[0] as long;

            return this;
        }
    }

    public override read(dst: ByteBuffer): int;
    public override read(dst: ByteBuffer[]): long;
    public override read(dst: ByteBuffer[], offset: int, length: int): long;
    public override read(...args: unknown[]): long | int {
        let currentBuffer = 0;
        let end: int;
        let targets: ByteBuffer[];

        let returnInt = false;
        switch (args.length) {
            case 1: {
                if (args[0] instanceof ByteBuffer) {
                    targets = [args[0]];
                    end = 1;
                    returnInt = true;
                } else {
                    targets = args[0] as ByteBuffer[];
                    end = targets.length;
                }

                break;
            }

            case 3: {
                targets = args[0] as ByteBuffer[];
                currentBuffer = args[1] as int;
                end = args[2] as int;

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
            }
        }

        let totalBytesRead = 0n;
        while (currentBuffer < end) {
            const target = targets[currentBuffer];
            const remaining = target.remaining();
            if (remaining === 0) {
                currentBuffer++;

                continue;
            }

            const bytesRead = this.readBytes(target, remaining);
            if (bytesRead === 0n) {
                break;
            }

            totalBytesRead += bytesRead;
        }

        return returnInt ? Number(totalBytesRead) : totalBytesRead;
    }

    public size(): long {
        const stat = fstatSync(this.#fileHandle, { bigint: true });

        return stat.size;
    }

    public transferFrom(src: ReadableByteChannel, position: long, count: long): long {
        if (position < 0n) {
            throw new IllegalArgumentException(new JavaString("Position must be >= 0"));
        }

        if (!src.isOpen() || !this.isOpen()) {
            throw new ClosedChannelException();
        }

        // Cannot check here if src is readable.
        // throw new NonReadableChannelException();

        if (!this.#canWrite) {
            throw new NonWritableChannelException();
        }

        const buffer = ByteBuffer.allocate(1024);
        let totalBytesRead = 0n;
        while (totalBytesRead < count) {
            const bytesRead = BigInt(src.read(buffer));
            if (bytesRead === 0n) {
                break;
            }

            buffer.flip();
            this.write(buffer, position + totalBytesRead);

            totalBytesRead += bytesRead;
        }

        return totalBytesRead;
    }

    public transferTo(position: long, count: long, target: WritableByteChannel): long {
        if (!target.isOpen() || !this.isOpen()) {
            throw new ClosedChannelException();
        }

        // Cannot check here if target is writable.
        // throw new NonWritableChannelException();

        if (!this.#canRead) {
            throw new NonReadableChannelException();
        }

        const buffer = ByteBuffer.allocate(1024);
        let totalBytesRead = 0n;
        while (totalBytesRead < count) {
            const bytesRead = this.read([buffer], Number(position + totalBytesRead), 1024);
            if (bytesRead === 0n) {
                break;
            }

            buffer.flip();
            target.write(buffer);

            totalBytesRead += bytesRead;
        }

        return totalBytesRead;
    }

    public truncate(size: long): FileChannel {
        truncateSync(this.#nativePath, Number(size));

        return this;
    }

    // public tryLock(): FileLock | null;
    // public tryLock(position: long, size: long, shared: boolean): FileLock | null;

    public override write(src: ByteBuffer): int;
    public override write(src: ByteBuffer[]): long;
    public override write(src: ByteBuffer[], offset: int, length: int): long;
    public override write(src: ByteBuffer, position: long): int;
    public override write(...args: unknown[]): long | int {
        let currentBuffer = 0;
        let end: int;
        let targets: ByteBuffer[];

        switch (args.length) {
            case 1: {
                if (args[0] instanceof ByteBuffer) {
                    targets = [args[0]];
                    end = 1;
                } else {
                    targets = args[0] as ByteBuffer[];
                    end = targets.length;
                }

                break;
            }

            case 2: {
                targets = [args[0] as ByteBuffer];
                end = 1;

                this.#currentPosition = args[1] as long;

                break;
            }

            case 3: {
                targets = args[0] as ByteBuffer[];
                currentBuffer = args[1] as int;
                end = args[2] as int;

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
            }
        }

        let totalBytesWritten = 0n;
        while (currentBuffer < end) {
            const target = targets[currentBuffer];
            const remaining = target.remaining();
            if (remaining === 0) {
                currentBuffer++;

                continue;
            }

            const bytesWritten = this.writeBytes(target, remaining);
            if (bytesWritten === 0n) {
                break;
            }

            totalBytesWritten += bytesWritten;
        }

        return totalBytesWritten;
    }

    protected implCloseChannel(): void {
        closeSync(this.#fileHandle);
        this.#fileHandle = -1;

        if (this.#deleteOnClose) {
            unlinkSync(this.#nativePath);
        }
    }

    /**
     * Low level file open method.
     *
     * @param path The path to the file.
     * @param flags The flags to use for opening the file.
     * @param mode The mode to use for opening the file.
     *
     * @throws IOException In case of an error.
     */
    private open(path: string, flags: OpenMode, mode: Mode): void {
        try {
            this.#fileHandle = openSync(path, flags, mode);
        } catch (reason) {
            throw new IOException(new JavaString("Cannot open file"), Throwable.fromError(reason));
        }
    }

    /**
     * Low level file read method.
     *
     * @param target The buffer to read into.
     * @param remaining The int of bytes to read.
     *
     * @returns The int of bytes read.
     */
    private readBytes(target: ByteBuffer, remaining: int): long {
        const buffer = target.array();
        const bytesRead = readSync(this.#fileHandle, buffer, target.position(), remaining, this.#currentPosition);
        this.#currentPosition += BigInt(bytesRead);
        target.position(target.position() + bytesRead);

        return BigInt(bytesRead);
    }

    /**
     * Low level file write method.
     *
     * @param target The buffer to read from.
     * @param remaining The int of bytes to read.
     *
     * @returns The int of bytes read.
     */
    private writeBytes(target: ByteBuffer, remaining: int): long {
        const buffer = target.array();
        const bytesWritten = writeSync(this.#fileHandle, buffer, target.position(), remaining,
            Number(this.#currentPosition));
        this.#currentPosition += BigInt(bytesWritten);
        target.position(target.position() + bytesWritten);

        return BigInt(bytesWritten);
    }
}
