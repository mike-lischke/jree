/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";
import { JavaObject } from "../../lang/Object";

/**
 * Storage for files. A FileStore represents a storage pool, device, partition, volume, concrete file system or other
 * implementation specific means of file storage. The FileStore for where a file is stored is obtained by invoking
 * the getFileStore method, or all file stores can be enumerated by invoking the getFileStores method.
 */
export abstract class FileStore extends JavaObject {
    /**
     * Initializes a new instance of this class.
     */
    protected constructor() {
        super();
    }

    /**
     * Reads the value of a file store attribute.
     *
     * @param attribute The attribute to read.
     *
     * @returns The attribute value; {@code null} may be a valid for some attributes.
     */
    public abstract getAttribute(attribute: string): java.lang.Object | null;

    /**
     * Returns the number of bytes per block in this file store.
     *
     * @returns The number of bytes per block.
     */
    public abstract getBlockSize(): number;

    /**
     * Returns a FileStoreAttributeView of the given type.
     *
     * @param type The type of the attribute view.
     *
     * @returns A file store attribute view of the specified type or {@code null} if the attribute view is not
     *          available.
     */
    public abstract getFileStoreAttributeView<T extends java.nio.file.attribute.FileStoreAttributeView>(
        type: java.lang.Class<T>): T;

    /**
     * @returns The size of the file store, in bytes.
     */
    public abstract getTotalSpace(): number;

    /**
     * @returns The number of unallocated bytes in the file store.
     *
     * @throws IOException If an I/O error occurs.
     */
    public abstract getUnallocatedSpace(): number;

    /**
     * @returns the number bytes available to this Java virtual machine on the file store.
     */
    public abstract getUsableSpace(): number;

    /**
     * Tells weather this file store is read-only.
     *
     * @returns `true` if, and only if, this file store is read-only.
     */
    public abstract isReadOnly(): boolean;

    /**
     * @returns The name of this file store.
     */
    public abstract name(): string;

    /**
     * Tells wether or not this file store supports the file attribute view identified by the given file attribute view.
     *
     * @param type The file attribute view type.
     *
     * @returns `true` if, and only if, this file store supports the file attribute view.
     */
    public abstract supportsFileAttributeView(
        type: java.lang.Class<java.nio.file.attribute.FileAttributeView>): boolean;

    /**
     * @returns the type of this file store.
     */
    public abstract type(): string;
}
