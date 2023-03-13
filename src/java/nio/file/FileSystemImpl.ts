/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import path from "path";
import minimatch from "minimatch";

import { JavaFileSystem } from "./FileSystem";
import { PathImpl } from "./PathImpl";
import { FileStore } from "./FileStore";
import { Path } from "./Path";
import { PathMatcher } from "./PathMatcher";
import { WatchService } from "./WatchService";
import { JavaFile } from "../../io/File";
import { JavaIterable } from "../../lang/Iterable";
import { NotImplementedError } from "../../../NotImplementedError";
import { JavaString } from "../../lang/String";
import { PatternSyntaxException } from "../../util/regex/PatternSyntaxException";
import { JavaIterator } from "../../util/Iterator";
import { UnsupportedOperationException } from "../../lang/UnsupportedOperationException";
import { UserPrincipalLookupService } from "./attribute/UserPrincipalLookupService";

/**
 * This is the default implementation of the FileSystem interface. It uses Node.js' file system API.
 */
export class FileSystemImpl extends JavaFileSystem {
    #globSyntax = new JavaString("glob");
    #regexSyntax = new JavaString("regex");

    public constructor() {
        super();
    }

    public close(): void {
        // Nothing to do here.
    }

    public getFileStores(): JavaIterable<FileStore> {
        throw new NotImplementedError();
    }

    public getPath(first: JavaString, ...more: JavaString[]): Path {
        return new PathImpl(this, first, ...more);
    }

    public getPathMatcher(syntaxAndPattern: JavaString): PathMatcher {
        const [syntax, pattern] = syntaxAndPattern.split(new JavaString(":"), 2);

        if (syntax.equals(this.#globSyntax)) {
            return new class implements PathMatcher {
                public matches(path: Path): boolean {
                    return minimatch(`${path}`, `${pattern}`);
                }
            }();
        } else if (syntax.equals(this.#regexSyntax)) {
            return new class implements PathMatcher {
                public matches(path: Path): boolean {
                    return `${path}`.match(new RegExp(`${pattern}`)) !== null;
                }
            }();
        }

        throw new PatternSyntaxException(new JavaString(`Invalid syntax: ${syntax}`), syntaxAndPattern, -1);
    }

    public getRootDirectories(): JavaIterable<Path> {
        const root = path.parse(process.cwd()).root;
        const list = [new PathImpl(this, new JavaString(`${root}`))];

        return new class extends JavaIterable<Path> {
            public [Symbol.iterator](): IterableIterator<Path> {
                return list[Symbol.iterator]();
            }

            public override iterator(): JavaIterator<Path> {
                return new class implements JavaIterator<Path> {
                    private index = 0;

                    public hasNext(): boolean {
                        return this.index < list.length;
                    }

                    public next(): Path {
                        return list[this.index++];
                    }

                    public remove(): void {
                        throw new UnsupportedOperationException();
                    }
                }();
            }
        }();
    }

    public getSeparator(): JavaString {
        return JavaFile.separator;
    }

    public getUserPrincipalLookupService(): UserPrincipalLookupService {
        throw new NotImplementedError();
    }

    public isOpen(): boolean {
        return true;
    }

    public isReadOnly(): boolean {
        return false;
    }

    public newWatchService(): WatchService {
        throw new NotImplementedError();
    }

    // public  provider(): FileSystemProvider;

    public supportedFileAttributeViews(): JavaIterable<JavaString> {
        throw new NotImplementedError();
    }
}
