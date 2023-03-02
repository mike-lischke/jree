/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import * as path from "path";

import { java, MurmurHash, NotImplementedError } from "../../..";
import { S } from "../../../templates";
import { Path } from "./Path";

export class PathImpl extends Path implements java.nio.file.Path {
    #parsed: path.ParsedPath;
    #path: string;
    #elements: string[];

    public constructor(private fileSystem: java.nio.file.JavaFileSystem, first: java.lang.String,
        ...more: java.lang.String[]) {
        super();

        const paths = [first, ...more].map((part) => { return `${part}`; });
        this.#path = path.normalize(path.join(...paths));
        this.#elements = this.#path.split(path.sep);
        this.#parsed = path.parse(this.#path);
    }

    public compareTo(other: java.lang.Object): number {
        if (other instanceof PathImpl) {
            return this.#path.localeCompare(other.#path);
        }

        return -1;
    }

    public endsWith(other: java.lang.String | java.nio.file.Path): boolean {
        return this.#path.endsWith(`${other}`);
    }

    public equals(other: java.lang.Object): boolean {
        if (other instanceof PathImpl) {
            return this.#path === other.#path;
        }

        return false;
    }

    public getFileName(): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.base}`);
    }

    public getFileSystem(): java.nio.file.JavaFileSystem {
        return this.fileSystem;
    }

    public getName(index: number): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#elements[index]}`);
    }

    public getNameCount(): number {
        return this.#elements.length;
    }

    public getParent(): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.dir}`);
    }

    public getRoot(): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.root}`);
    }

    public hashCode(): number {
        return MurmurHash.hashCode(this.#path);
    }

    public isAbsolute(): boolean {
        return path.isAbsolute(this.#path);
    }

    public normalize(): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#path}`);
    }

    public register(watcher: java.nio.file.WatchService,
        ...events: Array<java.nio.file.WatchEvent.Kind<unknown>>): java.nio.file.WatchKey;
    /**
     * Registers the file located by this path with a watch service.
     *
     * @param watcher The watch service to register with.
     * @param events The events to watch for.
     * @param modifiers The modifiers to apply.
     */
    public register(watcher: java.nio.file.WatchService,
        events: Array<java.nio.file.WatchEvent.Kind<unknown>>,
        ...modifiers: java.nio.file.WatchEvent.Modifier[]): java.nio.file.WatchKey;
    public register(...args: unknown[]): java.nio.file.WatchKey {
        throw new NotImplementedError();
    }

    /**
     * Relativizes a given path against this path.
     *
     * @param other The path to relativize against this path.
     *
     * @returns The relativized path.
     */
    public relativize(other: java.nio.file.Path): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${path.relative(this.#path, `${other}`)}`);
    }

    /**
     * Resolves a given path against this path.
     * If the given path is absolute then this method trivially returns the given path.
     * Otherwise this method considers this path to be a directory and resolves the given path against this path.
     *
     * @param other The path to resolve against this path.
     *
     * @returns The resulting path.
     */
    public resolve(other: java.lang.String | java.nio.file.Path): java.nio.file.Path {
        if (other instanceof PathImpl && other.isAbsolute()) {
            return other;
        }

        return new PathImpl(this.fileSystem, S`${path.resolve(this.#path, `${other}`)}`);
    }

    /**
     * Resolves a given path against this path's parent path.
     * If this path does not have a parent path then an {@link IllegalArgumentException} is thrown.
     * Otherwise this method is equivalent to resolving the given path against this path's parent path.
     *
     * @param other The path to resolve against this path's parent path.
     *
     * @returns The resulting path.
     */
    public resolveSibling(other: java.lang.String | java.nio.file.Path): java.nio.file.Path {
        if (this.#parsed.dir === "") {
            throw new java.lang.IllegalArgumentException(S`Path has no parent`);
        }

        return new PathImpl(this.fileSystem, S`${path.resolve(this.#parsed.dir, `${other}`)}`);
    }

    /**
     * Tests if this path starts with the given path.
     *
     * @param other The path to test against.
     *
     * @returns True if this path starts with the given path, false otherwise.
     */
    public startsWith(other: java.lang.String | java.nio.file.Path): boolean {
        return this.#path.startsWith(`${other}`);
    }

    /**
     * Returns a relative path that is a subsequence of the elements of this path.
     * The subsequence begins with the element at the specified begin index and ends with the element at index end - 1.
     *
     * @param beginIndex The begin index, inclusive.
     * @param endIndex The end index, exclusive.
     *
     * @returns The resulting path.
     */
    public subpath(beginIndex: number, endIndex: number): java.nio.file.Path {
        return new PathImpl(this.fileSystem, S`${this.#elements.slice(beginIndex, endIndex).join(path.sep)}`);
    }

    /**
     * Returns a Path object representing the absolute path of this path.
     * If this path is already absolute then this method trivially returns this path.
     *
     * @returns The resulting path.
     */
    public toAbsolutePath(): java.nio.file.Path {
        if (this.isAbsolute()) {
            return this;
        }

        return new PathImpl(this.fileSystem, S`${path.resolve(this.#path)}`);
    }

    // public toRealPath(options: java.nio.file.LinkOption[]): java.nio.file.Path;

    public toString(): string {
        return `${this.#path}`;
    }

    public toUri(): java.net.URI {
        return new java.net.URI(S`file://${this.#path}`);
    }
}
