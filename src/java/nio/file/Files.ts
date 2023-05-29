/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import fs from "fs";

import { S } from "../../../templates";
import { JavaObject } from "../../lang/Object";
import { JavaSet } from "../../util/Set";
import { OpenOption } from "./OpenOption";
import { Path } from "./Path";
import { SeekableByteChannel } from "../channels/SeekableByteChannel";
import { FileAttribute } from "./attribute/FileAttribute";
import { FileChannel } from "../channels/FileChannel";
import { IllegalArgumentException } from "../../lang/IllegalArgumentException";

/** This class consists exclusively of static methods that operate on files, directories, or other types of files. */
export class Files extends JavaObject {
    /** Opens or creates a file, returning a seekable byte channel to access the file. */
    public static newByteChannel(path: Path, ...options: OpenOption[]): SeekableByteChannel;
    public static newByteChannel(path: Path, options: OpenOption[],
        ...attrs: Array<FileAttribute<unknown>>): SeekableByteChannel;
    public static newByteChannel(...args: unknown[]): SeekableByteChannel {
        switch (args.length) {
            case 2: {
                const [path, options] = args as [Path, JavaSet<OpenOption>];

                return FileChannel.open(path, options);
            }

            case 3: {
                const [path, options, attrs] = args as [Path, JavaSet<OpenOption>,
                    FileAttribute<unknown>];

                return FileChannel.open(path, options, attrs);
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
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
    public static size(path: Path): bigint {
        const stats = fs.statSync(`${path}`, { bigint: true });

        return stats.size;
    }

}
