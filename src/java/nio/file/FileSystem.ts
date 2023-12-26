/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object.js";
import { JavaString } from "../../lang/String.js";
import { JavaIterable } from "../../lang/Iterable.js";
import { FileStore } from "./FileStore.js";
import { Path } from "./Path.js";
import { PathMatcher } from "./PathMatcher.js";
import { UserPrincipalLookupService } from "./attribute/UserPrincipalLookupService.js";
import { WatchService } from "./WatchService.js";

/**
 * Provides an interface to a file system and is the factory for objects to access files and other objects in the
 * file system.
 */
export abstract class JavaFileSystem extends JavaObject {
    /**
     * Initializes a new instance of this class.
     */
    protected constructor() {
        super();
    }

    /**
     * Closes this file system.
     */
    public abstract close(): void;

    /**
     * @returns an object to iterate over the underlying file stores.
     */
    public abstract getFileStores(): JavaIterable<FileStore>;

    /**
     * Converts a path string, or a sequence of strings that when joined form a path string, to a Path.
     *
     * @param first the path string or initial part of the path string.
     * @param more additional strings to be joined to form the path string.
     *
     * @returns the resulting Path.
     */
    public abstract getPath(first: JavaString | string, ...more: JavaString[]): Path;

    /**
     * Returns a PathMatcher that performs match operations on the String representation of Path objects by interpreting
     * a given pattern.
     *
     * @param syntaxAndPattern the syntax and pattern.
     *
     * @returns the path matcher.
     */
    public abstract getPathMatcher(syntaxAndPattern: JavaString | string): PathMatcher;

    /**
     * @returns an object to iterate over the root directories of the file system.
     *
     * @throws IOException if an I/O error occurs.
     */
    public abstract getRootDirectories(): Iterable<Path>;

    /**
     * @returns the name separator, represented as a string.
     */
    public abstract getSeparator(): JavaString;

    /**
     * @returns the UserPrincipalLookupService to lookup users or groups by name.
     *
     * @throws UnsupportedOperationException if this file system does not support access to users or groups.
     */
    public abstract getUserPrincipalLookupService(): UserPrincipalLookupService;

    /**
     * Tells wether or not this file system is open.
     *
     * @returns true if, and only if, this file system is open.
     */
    public abstract isOpen(): boolean;

    /**
     * Tells whether or not this file system allows only read-only access to its file stores.
     *
     * @returns true if, and only if, this file system is read-only.
     */
    public abstract isReadOnly(): boolean;

    /**
     * Constructs a new WatchService (optional operation).
     *
     * @returns a new watch service.
     */
    public abstract newWatchService(): WatchService;

    // public abstract provider(): spi.FileSystemProvider;

    /**
     * @returns the set of names of the file attribute views supported by this file system.
     */
    public abstract supportedFileAttributeViews(): JavaIterable<JavaString>;
}
