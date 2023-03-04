/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import path from "path";
import fs from "fs";

import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Comparable } from "../lang/Comparable";
import { Serializable } from "./Serializable";
import { Path } from "../nio/file/Path";
import { URI } from "../net/URI";
import { FileSystems } from "../nio/file/FileSystems";
import { NullPointerException } from "../lang/NullPointerException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

/** An abstract representation of file and directory pathnames. */
export class JavaFile extends JavaObject implements Comparable<JavaFile>, Serializable {
    /** The system-dependent path-separator character, represented as a string for convenience. */
    public static readonly pathSeparator = new JavaString(`${path.sep}`);

    /** The system-dependent path-separator character. */
    public static readonly pathSeparatorChar = path.sep.charCodeAt(0);

    /** The system-dependent default name-separator character, represented as a string for convenience. */
    public static readonly separator = new JavaString(`${path.delimiter}`);

    /** The system-dependent name-separator character. */
    public static readonly separatorChar = path.delimiter.charCodeAt(0);

    #path: Path;
    #isAbsolute: boolean;

    /** Creates a new File instance from a parent abstract pathname and a child pathname string. */
    public constructor(parent: JavaFile | null, child: JavaString);
    /** Creates a new File instance by converting the given pathname string into an abstract pathname. */
    public constructor(pathName: JavaString);
    /** Creates a new File instance from a parent pathname string and a child pathname string. */
    public constructor(parent: JavaString | null, child: JavaString);
    /** Creates a new File instance by converting the given file: URI into an abstract pathname. */
    public constructor(uri: URI);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                let pathName;
                if (args[0] instanceof JavaString) {
                    pathName = args[0];
                } else {
                    pathName = (args[0] as URI).getPath();
                }
                this.#path = FileSystems.getDefault().getPath(pathName);
                this.#isAbsolute = path.isAbsolute(`${this.#path}`);

                break;
            }

            case 2: {
                const parent = args[0] as JavaFile | JavaString | URI | null;
                const child = args[1] as JavaString;

                if (!parent && !child) {
                    throw new NullPointerException();
                } else if (!parent) {
                    this.#path = FileSystems.getDefault().getPath(child);
                } else {
                    let parentPath: Path;
                    if (parent instanceof JavaString) {
                        parentPath = FileSystems.getDefault().getPath(parent);
                    } else if (parent instanceof JavaFile) {
                        parentPath = parent.#path;
                    } else {
                        parentPath = FileSystems.getDefault().getPath(parent.getPath());
                    }

                    if (child) {
                        let childPath = FileSystems.getDefault().getPath(child);
                        if (childPath.isAbsolute()) {
                            childPath = childPath.subpath(0, childPath.getNameCount());
                        }

                        this.#path = parentPath.resolve(childPath);
                    } else {
                        this.#path = parentPath;
                    }
                }
                this.#isAbsolute = path.isAbsolute(`${this.#path}`);

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }
    }

    /**
     * Compares two abstract pathnames lexicographically.
     *
     * @param other The abstract pathname to be compared to this abstract pathname
     *
     * @returns Zero if the argument is equal to this abstract pathname, a value less than zero if this abstract
     *          pathname is lexicographically less than the argument, or a value greater than zero if this abstract
     *          pathname is lexicographically greater than the argument.
     */
    public compareTo(other: JavaFile): number {
        return this.#path.compareTo(other.#path);
    }

    /**
     * Converts this abstract pathname into a pathname string.
     *
     * @returns The string form of this abstract pathname
     */
    public getPath(): JavaString {
        return new JavaString(this.#path.toString());
    }

    /**
     * Returns the absolute pathname string of this abstract pathname.
     *
     * @returns The absolute pathname string denoting the same file or directory as this abstract pathname
     */
    public getAbsolutePath(): JavaString {
        return new JavaString(this.#path.toString());
    }

    /**
     * @returns The abstract pathname of the parent directory named by this abstract pathname, or null if this
     *          pathname does not name a parent
     */
    public getParentFile(): JavaFile {
        return new JavaFile(new JavaString(`${path.dirname(`${this.#path}`)}`));
    }

    /**
     * Tests whether this abstract pathname is absolute.
     *
     * @returns true if this abstract pathname is absolute, false otherwise
     */
    public isAbsolute(): boolean {
        return this.#isAbsolute;
    }

    /**
     * @returns an array of strings naming the files and directories in the directory denoted by this abstract pathname.
     */
    public length(): bigint {
        const stat = fs.statSync(`${this.#path}`, { bigint: true });

        return stat.size;
    }

    /**
     * Creates the directory named by this abstract pathname.
     *
     * @returns true if and only if the directory was created; false otherwise
     */
    public mkdir(): boolean {
        return fs.mkdirSync(`${this.#path}`, { recursive: false }) !== undefined;
    }

    /**
     * Creates the directory named by this abstract pathname, including any necessary but nonexistent parent
     * directories.
     *
     * @returns true if and only if the directory was created, along with all necessary parent directories; false
     */
    public mkdirs(): boolean {
        return fs.mkdirSync(`${this.#path}`, { recursive: true }) !== undefined;
    }

    public toPath(): Path {
        return this.#path;
    }

}
