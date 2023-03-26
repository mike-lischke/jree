/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import fs from "fs";

import { java } from "../../..";
import { S } from "../../../templates";
import { JavaObject } from "../../lang/Object";

/** This class consists exclusively of static methods that operate on files, directories, or other types of files. */
export class Files extends JavaObject {
    /** Opens or creates a file, returning a seekable byte channel to access the file. */
    public static newByteChannel(path: java.nio.file.Path,
        ...options: java.nio.file.OpenOption[]): java.nio.channels.SeekableByteChannel;
    public static newByteChannel(path: java.nio.file.Path,
        options: java.nio.file.OpenOption[],
        ...attrs: Array<java.nio.file.FileAttribute<unknown>>): java.nio.channels.SeekableByteChannel;
    public static newByteChannel(...args: unknown[]): java.nio.channels.SeekableByteChannel {
        switch (args.length) {
            case 2: {
                const [path, options] = args as [java.nio.file.Path, java.util.Set<java.nio.file.OpenOption>];

                return java.nio.channels.FileChannel.open(path, options);
            }

            case 3: {
                const [path, options, attrs] = args as [java.nio.file.Path, java.util.Set<java.nio.file.OpenOption>,
                    java.nio.file.FileAttribute<unknown>];

                return java.nio.channels.FileChannel.open(path, options, attrs);
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    /**
     * Returns the size of a file (or file-like object).
     *
     * @param path The path to the file.
     *
     * @returns The file size, in bytes.
     */
    public static size(path: java.nio.file.Path): bigint {
        const stats = fs.statSync(`${path}`, { bigint: true });

        return stats.size;
    }

}
