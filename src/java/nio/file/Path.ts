/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../../NotImplementedError";
import { JavaFile } from "../../io/File";
import { Comparable } from "../../lang/Comparable";
import { JavaIterable } from "../../lang/Iterable";
import { JavaObject } from "../../lang/Object";
import { JavaString } from "../../lang/String";
import { UnsupportedOperationException } from "../../lang/UnsupportedOperationException";
import { URI } from "../../net/URI";
import { Consumer } from "../../util/function/Consumer";
import { JavaIterator } from "../../util/Iterator";
import { NoSuchElementException } from "../../util/NoSuchElementException";
import { JavaFileSystem } from "./FileSystem";
import { FileSystems } from "./FileSystems";
import { Watchable } from "./Watchable";
import { WatchEvent } from "./WatchEvent";
import { WatchKey } from "./WatchKey";
import { WatchService } from "./WatchService";

export interface Path extends Comparable<Path>, JavaIterable<Path>, Watchable {
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
    endsWith(other: JavaString): boolean;

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
     * @throws UnsupportedOperationException if this path is associated with a provider that does not
     *         support the getFileName operation.
     */
    getFileName(): Path | null;

    /**
     * @returns The FileSystem that created this object.
     */
    getFileSystem(): JavaFileSystem;

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

    register(watcher: WatchService, events: Array<WatchEvent.Kind<unknown>>,
        ...modifiers: WatchEvent.Modifier[]): WatchKey;

    register(watcher: WatchService,
        ...events: Array<WatchEvent.Kind<unknown>>): WatchKey;

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
    resolve(other: JavaString): Path;

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
    startsWith(other: JavaString): boolean;

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
    toString(): JavaString;

    /** @returns a URI to represent this path. */
    toUri(): URI;
}

export class Path extends JavaObject implements Path {
    /**
     * Returns a Path by converting a URI.
     * The exact form of the URI is highly implementation dependent and therefore unspecified.
     *
     * @param uri The URI to be converted to a Path.
     *
     * @returns A Path object.
     */
    public static of(uri: URI): Path;
    /**
     * Returns a Path by converting a path string, or a sequence of strings that when joined form a path string.
     *
     * @param first The path string or initial part of the path string.
     * @param more Additional strings to be joined to form the path string.
     *
     * @returns A Path object.
     */
    public static of(first: JavaString, ...more: JavaString[]): Path;
    public static of(...args: unknown[]): Path {
        if (args.length === 1 && args[0] instanceof URI) {
            return FileSystems.getDefault().getPath(args[0].getPath());
        }

        const [first, ...more] = args as [JavaString, ...JavaString[]];

        return FileSystems.getDefault().getPath(first, ...more);
    }

    /**
     * Tests if this path ends with the given path.
     *
     * @param other The path to be compared with this path.
     *
     * @returns true if this path ends with the given path, otherwise false.
     */
    public endsWith(other: JavaString | Path): boolean {
        if (other instanceof JavaString) {
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
    public iterator(): JavaIterator<Path> {
        return new class extends JavaObject implements JavaIterator<Path> {
            private index = 0;

            public constructor(private path: Path) {
                super();
            }

            public hasNext(): boolean {
                return this.index < this.path.getNameCount();
            }

            public next(): Path {
                if (this.hasNext()) {
                    return this.path.getName(this.index++);
                }

                throw new NoSuchElementException();
            }

            public remove(): void {
                throw new UnsupportedOperationException();
            }

            public forEachRemaining(action: Consumer<Path>): void {
                throw new NotImplementedError();
            }
        }(this);
    }

    /**
     * Registers the file located by this path with a watch service.
     *
     * @param watcher The watch service to which this object is to be registered.
     * @param events The events for which this object should be registered.
     * @param modifiers The modifiers, if any, that modify how the object is registered.
     */
    public register(watcher: WatchService,
        ...events: Array<WatchEvent.Kind<unknown>>): WatchKey;
    public register(watcher: WatchService, events: Array<WatchEvent.Kind<unknown>>,
        ...modifiers: WatchEvent.Modifier[]): WatchKey;
    public register(...args: unknown[]): WatchKey {
        throw new NotImplementedError();
    }

    /**
     * @returns A File object representing this path.
     */
    public toFile(): JavaFile {
        return new JavaFile(new JavaString(this.toString()));
    }

    public override toString(): JavaString {
        return new JavaString(super.toString());
    }
}
