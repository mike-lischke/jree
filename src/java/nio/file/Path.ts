/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

export interface Path extends java.lang.Comparable<Path>, java.lang.Iterable<Path>, java.nio.file.Watchable {
    /**
     * Compares two abstract paths lexicographically.
     *
     * @param other The path to be compared with this path.
     *
     * @returns A negative integer, zero, or a positive integer as this path is less than, equal to, or greater
     *          than the given path.
     */
    compareTo(other: Path): number;

    /**
     * Tests if this path ends with a Path, constructed by converting the given path string, in exactly the manner
     * specified by the endsWith(Path) method.
     *
     * @param other The path string to be converted to a Path and then compared with this Path.
     *
     * @returns true if this path ends with the given path, otherwise false.
     */
    endsWith(other: java.lang.String): boolean;

    /**
     * Tests if this path ends with the given path.
     *
     * @param other The path to be compared with this path.
     *
     * @returns true if this path ends with the given path, otherwise false.
     */
    endsWith(other: Path): boolean;

    /**
     * Tests this path for equality with the given object.
     *
     * @param other The object to which this path is to be compared.
     *
     * @returns true if, and only if, the given object is a Path that is identical to this Path.
     */
    equals(other: unknown): boolean;

    /**
     * Returns the file name of this path as a Path object.
     * The file name is the sequence of characters after the last occurrence of the separator character.
     * If the path is empty or consists solely of one name element then an empty path is returned.
     * If the path does not have a name element, then null is returned.
     *
     * @returns The file name of this path as a Path object.
     *
     * @throws java.lang.UnsupportedOperationException if this path is associated with a provider that does not
     * support the getFileName operation.
     */
    getFileName(): Path | null;

    /**
     * @returns The FileSystem that created this object.
     */
    getFileSystem(): java.nio.file.FileSystem;

    /**
     * Returns a name element of this path as a Path object.
     *
     * @param index The index of the name element. The first element is at index 0.
     *
     * @returns The name element.
     */
    getName(index: number): Path;

    /**
     * @returns The number of name elements in the path.
     */
    getNameCount(): number;

    /**
     * Returns the parent path, or null if this path does not have a parent.
     * The parent of an empty path is null. The parent of a path that consists solely of one name element is null.
     * The parent of a root component is null.
     * Otherwise the parent is the path that is identical to this path, except that the last name element is
     * removed.
     *
     * @returns The parent path, or null if this path does not have a parent.
     */
    getParent(): Path | null;

    /**
     * @returns The root component of this path as a Path object, or null if this path does not have a root component.
     */
    getRoot(): Path | null;

    /**
     * Computes a hash code for this path.
     *
     * @returns A hash code value for this path.
     */
    hashCode(): number;

    /**
     * Tells whether or not this path is absolute.
     *
     * @returns true if, and only if, this path is absolute.
     */
    isAbsolute(): boolean;

    /** @returns a path that is this path with redundant name elements eliminated. */
    normalize(): Path;

    // of(uri: URI): Path;

    // register(watcher: WatchService, events: Array<WatchEvent.Kind<Path>>,
    //    modifiers: WatchEvent.Modifier[]): WatchKey;

    // register(watcher: WatchService, events: Array<WatchEvent.Kind<Path>>): WatchKey;

    /**
     * Constructs a relative path between this path and a given path.
     *
     * @param other The target path.
     *
     * @returns The resulting relative path.
     */
    relativize(other: Path): Path;

    /**
     * Converts a given path string to a Path and resolves it against this Path in exactly the manner specified by
     * the resolve method.
     *
     * @param other The path string to be resolved against this Path.
     *
     * @returns The resulting Path.
     */
    resolve(other: java.lang.String): Path;

    /**
     * Resolves the given path against this path.
     * If the other parameter is an absolute path then this method trivially returns other.
     *
     * @param other The path to be resolved against this path.
     *
     * @returns The resulting path.
     */
    resolve(other: Path): Path;

    /**
     * Converts a given path string to a Path and resolves it against this Path in exactly the manner specified by
     * the resolveSibling method.
     *
     * @param other The path string to be resolved against this Path.
     *
     * @returns The resulting Path.
     */
    resolveSibling(other: Path): Path;

    /**
     * Resolves the given path against this path's parent path.
     * This method is equivalent to resolving the given path against the result of invoking the getParent method
     * upon this path, except that any trailing separator is removed from this path's parent path before
     * resolving the child path.
     *
     * @param other The path to be resolved against this path's parent path.
     *
     * @returns The resulting path.
     */
    startsWith(other: java.lang.String): boolean;

    /**
     * Tests if this path starts with the given path.
     *
     * @param other The path to be compared with this path.
     *
     * @returns true if this path starts with the given path, otherwise false.
     */
    startsWith(other: Path): boolean;

    /**
     * Returns a relative Path that is a subsequence of the name elements of this path.
     *
     * @param beginIndex The index of the first element, inclusive.
     * @param endIndex The index of the last element, exclusive.
     *
     * @returns The resulting path.
     */
    subpath(beginIndex: number, endIndex: number): Path;

    /**
     * Returns a Path object representing the absolute path of this path.
     * If this path is already absolute then this method trivially returns this path.
     * If this path is the empty path then this method trivially returns this path.
     * Otherwise this method considers this path relative to the default directory and resolves it against the
     *
     * @returns A Path object representing the absolute path.
     */
    toAbsolutePath(): Path;

    // toRealPath(options: LinkOption[]): Path;

    /** @returns the string representation of this path. */
    toString(): java.lang.String;

    /** @returns a URI to represent this path. */
    toUri(): java.net.URI;
}

export class Path {
    public static of(first: java.lang.String, ...more: java.lang.String[]): Path {
        throw new java.lang.UnsupportedOperationException();
    }

    public endsWith(other: java.lang.String | Path): boolean {
        if (other instanceof java.lang.String) {
            return this.endsWith(this.getFileSystem().getPath(other));
        }

        return false;
    }

    /**
     * Returns an iterator over the name elements of this path.
     * The first element returned by the iterator is the root component, if a root component exists, followed by any
     * name elements of the path that are relative to the root component. The elements are returned in order.
     * If this path is empty then the iterator returned by this method has no elements.
     * If this path only has a root component then the iterator returned by this method has only one element, which is
     * the root component.
     *
     * @returns An iterator over the name elements of this path.
     */
    public iterator(): java.util.Iterator<Path> {
        return new class implements java.util.Iterator<Path> {
            private index = 0;

            public constructor(private path: Path) {
            }

            public hasNext(): boolean {
                return this.index < this.path.getNameCount();
            }

            public next(): Path {
                if (this.hasNext()) {
                    return this.path.getName(this.index++);
                }

                throw new java.util.NoSuchElementException();
            }

            public remove(): void {
                throw new java.lang.UnsupportedOperationException();
            }
        }(this);
    }

    public toFile(): java.io.File {
        return new java.io.File(this.toString());
    }

}
