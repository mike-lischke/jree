/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { JavaObject } from "../../lang/Object";
import { JavaString } from "../../lang/String";
import { URI } from "../../net/URI";
import { JavaMap } from "../../util/Map";
import { JavaFileSystem } from "./FileSystem";
import { FileSystemImpl } from "./FileSystemImpl";

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
