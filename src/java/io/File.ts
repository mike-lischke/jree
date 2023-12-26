/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import path from "path";
import os from "os";
import crypto from "crypto";
import { existsSync, mkdirSync, openSync, rmdirSync, statSync, unlinkSync } from "fs";

import { JavaObject } from "../lang/Object.js";
import { JavaString } from "../lang/String.js";
import { Comparable } from "../lang/Comparable.js";
import { Serializable } from "./Serializable.js";
import { Path } from "../nio/file/Path.js";
import { URI } from "../net/URI.js";
import { FileSystems } from "../nio/file/FileSystems.js";
import { NullPointerException } from "../lang/NullPointerException.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";

const pendingFiles = new Set<JavaFile>();

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
    public constructor(parent: JavaFile | null, child: JavaString | string);
    /** Creates a new File instance by converting the given pathname string into an abstract pathname. */
    public constructor(pathName: JavaString | string);
    /** Creates a new File instance from a parent pathname string and a child pathname string. */
    public constructor(parent: JavaString | string | null, child: JavaString | string);
    /** Creates a new File instance by converting the given file: URI into an abstract pathname. */
    public constructor(uri: URI);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                let pathName;
                if (typeof args[0] === "string") {
                    pathName = new JavaString(args[0]);
                } else if (args[0] instanceof JavaString) {
                    pathName = args[0];
                } else {
                    pathName = (args[0] as URI).getPath();
                }
                this.#path = FileSystems.getDefault().getPath(pathName);
                this.#isAbsolute = path.isAbsolute(`${this.#path}`);

                break;
            }

            case 2: {
                const parent = args[0] as JavaFile | JavaString | string | null;
                const child = args[1] as JavaString | string;

                if (!parent && !child) {
                    throw new NullPointerException();
                } else if (!parent) {
                    this.#path = FileSystems.getDefault().getPath(child);
                } else {
                    let parentPath: Path;
                    if (parent instanceof JavaString || typeof parent === "string") {
                        parentPath = FileSystems.getDefault().getPath(parent);
                    } else {
                        parentPath = parent.#path;
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
     * Creates an empty file in the default temporary-file directory, using the given prefix and suffix to generate
     * its name.
     */
    public static createTempFile(prefix: JavaString | string, suffix: JavaString | string | null): JavaFile;
    /**
     * Creates a new empty file in the specified directory, using the given prefix and suffix strings to generate its
     * name.
     */
    public static createTempFile(prefix: JavaString | string, suffix: JavaString | string | null,
        directory: JavaFile | null): JavaFile;
    public static createTempFile(...args: unknown[]): JavaFile {
        let folder;
        let prefix;
        let suffix;
        if (args.length === 3) {
            const [p, s, f] = args as [JavaString | string, JavaString | string | null, JavaFile];
            suffix = s === null ? ".tmp" : s.valueOf();
            prefix = p.valueOf();
            folder = f.getPath().valueOf();
        } else {
            [prefix, suffix] = args as [JavaString | string, JavaString | string | null];
            folder = os.tmpdir();
        }

        const name = path.join(folder, prefix + crypto.randomBytes(16).toString("hex") + suffix);
        openSync(name, "ax+");

        return new JavaFile(new JavaString(name));
    }

    /**
     * Tests whether the application can execute the file denoted by this abstract pathname.
     *
     * @returns true if and only if the abstract pathname exists and the application is allowed to execute the file
     */
    public canExecute(): boolean {
        const stat = statSync(`${this.#path}`);

        return (stat.mode & 0o111) !== 0;
    }

    /**
     * Tests whether the application can read the file denoted by this abstract pathname.
     *
     * @returns true if and only if the file specified by this abstract pathname exists and can be read
     */
    public canRead(): boolean {
        const stat = statSync(`${this.#path}`);

        return (stat.mode & 0o444) !== 0;
    }

    /**
     * Tests whether the application can modify the file denoted by this abstract pathname.
     *
     * @returns true if and only if the file system actually contains a file denoted by this abstract pathname and the
     *          application is allowed to write to the file
     */
    public canWrite(): boolean {
        const stat = statSync(`${this.#path}`);

        return (stat.mode & 0o222) !== 0;
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
     * Deletes the file or directory denoted by this abstract pathname.
     *
     * @returns true if and only if the file or directory is successfully deleted; false otherwise
     */
    public delete(): boolean {
        try {
            if (this.isDirectory()) {
                rmdirSync(`${this.#path}`);
            } else {
                unlinkSync(`${this.#path}`);
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Requests that the file or directory denoted by this abstract pathname be deleted when the virtual machine
     * terminates.
     */
    public deleteOnExit(): void {
        pendingFiles.add(this);
    }

    /**
     * Tests whether the file or directory denoted by this abstract pathname exists.
     *
     * @returns true if and only if the file or directory denoted by this abstract pathname exists; false otherwise
     */
    public exists(): boolean {
        if (existsSync(`${this.#path}`)) {
            return true;
        }

        return false;
    }

    /**
     * @returns the name of the file or directory denoted by this abstract pathname. This is just the last name in the
     * pathname's name sequence.
     */
    public getName(): JavaString {
        return new JavaString(path.basename(`${this.#path}`));
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
        return new JavaString(this.#path.toAbsolutePath().toString());
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
     * Tests whether the file denoted by this abstract pathname is a directory.
     *
     * @returns true if and only if the file denoted by this abstract pathname exists and is a directory; false
     *          otherwise.
     */
    public isDirectory(): boolean {
        const stat = statSync(`${this.#path}`);

        return stat.isDirectory();
    }

    /**
     * Tests whether the file denoted by this abstract pathname is a normal file.
     *
     * @returns true if and only if the file denoted by this abstract pathname exists and is a normal file; false
     *          otherwise.
     */
    public isFile(): boolean {
        const stat = statSync(`${this.#path}`);

        return stat.isFile();
    }

    /**
     * Tests whether the file named by this abstract pathname is a hidden file.
     *
     * @returns true if and only if the file denoted by this abstract pathname is hidden according to the conventions
     *          of the underlying platform
     *
     * Note: This method is not supported on Windows platforms.
     */
    public isHidden(): boolean {
        return this.#path.startsWith(new JavaString("."));
    }

    /**
     * @returns an array of strings naming the files and directories in the directory denoted by this abstract pathname.
     */
    public length(): bigint {
        const stat = statSync(`${this.#path}`, { bigint: true });

        return stat.size;
    }

    /**
     * Creates the directory named by this abstract pathname.
     *
     * @returns true if and only if the directory was created; false otherwise
     */
    public mkdir(): boolean {
        return mkdirSync(`${this.#path}`, { recursive: false }) !== undefined;
    }

    /**
     * Creates the directory named by this abstract pathname, including any necessary but nonexistent parent
     * directories.
     *
     * @returns true if and only if the directory was created, along with all necessary parent directories; false
     */
    public mkdirs(): boolean {
        return mkdirSync(`${this.#path}`, { recursive: true }) !== undefined;
    }

    public toPath(): Path {
        return this.#path;
    }

}

// Register a cleanup handler to delete any files that were created and marked with deleteOnExit.
process.on("beforeExit", () => {
    try {
        pendingFiles.forEach((file) => {
            file.delete();
        });
    } catch (e) {
        // ignore
    }
});
