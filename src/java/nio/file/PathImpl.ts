/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import path from "path";

import { MurmurHash } from "../../../MurmurHash";
import { NotImplementedError } from "../../../NotImplementedError";

import { S } from "../../../templates";
import { IllegalArgumentException } from "../../lang/IllegalArgumentException";
import { JavaString } from "../../lang/String";
import { URI } from "../../net/URI";
import { JavaFileSystem } from "./FileSystem";
import { Path } from "./Path";
import { WatchEvent } from "./WatchEvent";
import { WatchKey } from "./WatchKey";
import { WatchService } from "./WatchService";

export class PathImpl extends Path {
    #parsed: path.ParsedPath;
    #path: string;
    #elements: string[];

    public constructor(private fileSystem: JavaFileSystem, first: JavaString,
        ...more: JavaString[]) {
        super();

        const paths = [first, ...more].map((part) => { return `${part}`; });
        this.#path = path.normalize(path.join(...paths));
        this.#elements = this.#path.split(path.sep);
        this.#parsed = path.parse(this.#path);
    }

    public override compareTo(other: unknown): number {
        if (other instanceof PathImpl) {
            return this.#path.localeCompare(other.#path);
        }

        return -1;
    }

    public override endsWith(other: JavaString | Path): boolean {
        return this.#path.endsWith(`${other}`);
    }

    public override equals(other: Object): boolean {
        if (other instanceof PathImpl) {
            return this.#path === other.#path;
        }

        return false;
    }

    public override getFileName(): Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.base}`);
    }

    public override getFileSystem(): JavaFileSystem {
        return this.fileSystem;
    }

    public override getName(index: number): Path {
        return new PathImpl(this.fileSystem, S`${this.#elements[index]}`);
    }

    public override getNameCount(): number {
        return this.#elements.length;
    }

    public override getParent(): Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.dir}`);
    }

    public override getRoot(): Path {
        return new PathImpl(this.fileSystem, S`${this.#parsed.root}`);
    }

    public override hashCode(): number {
        return MurmurHash.hashCode(this.#path);
    }

    public override isAbsolute(): boolean {
        return path.isAbsolute(this.#path);
    }

    public override normalize(): Path {
        return new PathImpl(this.fileSystem, S`${this.#path}`);
    }

    public override register(watcher: WatchService,
        ...events: Array<WatchEvent.Kind<unknown>>): WatchKey;
    /**
     * Registers the file located by this path with a watch service.
     *
     * @param watcher The watch service to register with.
     * @param events The events to watch for.
     * @param modifiers The modifiers to apply.
     */
    public override register(watcher: WatchService,
        events: Array<WatchEvent.Kind<unknown>>,
        ...modifiers: WatchEvent.Modifier[]): WatchKey;
    public override register(...args: unknown[]): WatchKey {
        throw new NotImplementedError();
    }

    /**
     * Relativizes a given path against this path.
     *
     * @param other The path to relativize against this path.
     *
     * @returns The relativized path.
     */
    public override relativize(other: Path): Path {
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
    public override resolve(other: JavaString | Path): Path {
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
    public override resolveSibling(other: JavaString | Path): Path {
        if (this.#parsed.dir === "") {
            throw new IllegalArgumentException(S`Path has no parent`);
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
    public override startsWith(other: JavaString | Path): boolean {
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
    public override subpath(beginIndex: number, endIndex: number): Path {
        return new PathImpl(this.fileSystem, S`${this.#elements.slice(beginIndex, endIndex).join(path.sep)}`);
    }

    /**
     * Returns a Path object representing the absolute path of this path.
     * If this path is already absolute then this method trivially returns this path.
     *
     * @returns The resulting path.
     */
    public override toAbsolutePath(): Path {
        if (this.isAbsolute()) {
            return this;
        }

        return new PathImpl(this.fileSystem, S`${path.resolve(this.#path)}`);
    }

    // public toRealPath(options: LinkOption[]): Path;

    public override toString(): JavaString {
        return new JavaString(this.#path);
    }

    public override toUri(): URI {
        return new URI(S`file://${this.#path}`);
    }

    protected [Symbol.toPrimitive](_hint: string): string {
        return this.#path;
    }
}
