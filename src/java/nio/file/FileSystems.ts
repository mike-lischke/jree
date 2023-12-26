/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object.js";
import { JavaString } from "../../lang/String.js";
import { URI } from "../../net/URI.js";
import { JavaMap } from "../../util/Map.js";
import { JavaFileSystem } from "./FileSystem.js";
import { FileSystemImpl } from "./FileSystemImpl.js";

/**
 * Factory methods for file systems.  This class defines the getDefault method to get the default file system and
 * factory methods to construct other types of file systems.
 */
export class FileSystems extends JavaObject {
    private static default: JavaFileSystem;

    /** @returns the default {@code FileSystem} */
    public static getDefault(): JavaFileSystem {
        if (!this.default) {
            this.default = new FileSystemImpl();
        }

        return this.default;
    }

    /**
     * Returns the {@code FileSystem} identified by the given URI.
     *
     * @param uri the URI to identify the file system
     */
    public static getFileSystem(uri: URI): JavaFileSystem {
        throw new Error("Not implemented yet");
    }

    /** Returns the {@code FileSystemProvider} identified by the given URI. */
    public static newFileSystem(): JavaFileSystem;
    /** Returns the {@code FileSystemProvider} identified by the given URI. */
    public static newFileSystem(uri: URI,
        env: JavaMap<JavaString, JavaObject>): JavaFileSystem;
    // public static newFileSystem(provider: spi.FileSystemProvider, uri: URI,
    //    env: Map<JavaString, java.lang.Object>): FileSystem;
    public static newFileSystem(...args: unknown[]): JavaFileSystem {
        throw new Error("Not implemented yet");
    }

}
