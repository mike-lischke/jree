/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../lang/String.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { Charset } from "../nio/charset/Charset.js";
import { JavaFile } from "./File.js";
import { FileDescriptor } from "./FileDescriptor.js";
import { FileOutputStream } from "./FileOutputStream.js";
import { OutputStreamWriter } from "./OutputStreamWriter.js";

/**
 * Writes text to character files using a default buffer size. Encoding from characters to bytes uses either a
 * specified charset or the platform's default charset.
 */
export class FileWriter extends OutputStreamWriter {
    /** Constructs a FileWriter given the File to write, using the platform's default charset */
    public constructor(file: JavaFile);
    /** Constructs a FileWriter given a file descriptor, using the platform's default charset. */
    public constructor(fd: FileDescriptor);
    /**
     * Constructs a FileWriter given the File to write and a boolean indicating whether to append the data written,
     * using the platform's default charset.
     */
    public constructor(file: JavaFile, append: boolean);
    /** Constructs a FileWriter given the File to write and charset. */
    public constructor(file: JavaFile, charset: Charset);
    /**
     * Constructs a FileWriter given the File to write, charset and a boolean indicating whether to append the data
     * written.
     */
    public constructor(file: JavaFile, charset: Charset, append: boolean);
    /** Constructs a FileWriter given the file name, using the platform's default charset. */
    public constructor(fileName: JavaString);
    /**
     * Constructs a FileWriter given the file name and a boolean indicating whether to append the data written,
     * using the platform's default charset.
     */
    public constructor(fileName: JavaString, append: boolean);
    /** Constructs a FileWriter given the file name and charset. */
    public constructor(fileName: JavaString, charset: Charset);
    /**
     * Constructs a FileWriter given the file name, charset and a boolean indicating whether to append the data
     * written.
     */
    public constructor(fileName: JavaString, charset: Charset, append: boolean);
    public constructor(...args: unknown[]) {
        let charset = Charset.defaultCharset();
        let stream;

        switch (args.length) {
            case 1: {
                const arg = args[0] as JavaFile | FileDescriptor | JavaString;
                if (arg instanceof JavaFile) {
                    stream = new FileOutputStream(arg);
                } else if (arg instanceof FileDescriptor) {
                    stream = new FileOutputStream(arg);
                } else {
                    stream = new FileOutputStream(arg);
                }
                break;
            }

            case 2: {
                const [arg1, arg2] = args as [JavaFile | JavaString, boolean | Charset];
                let append = false;
                if (typeof arg2 === "boolean") {
                    append = arg2;
                } else {
                    charset = arg2;
                }

                if (arg1 instanceof JavaFile) {
                    stream = new FileOutputStream(arg1, append);
                } else {
                    stream = new FileOutputStream(arg1, append);
                }

                break;
            }

            case 3: {
                const [arg1, arg2, arg3] = args as [JavaFile | JavaString, Charset, boolean];
                charset = arg2;
                if (arg1 instanceof JavaFile) {
                    stream = new FileOutputStream(arg1, arg3);
                } else {
                    stream = new FileOutputStream(arg1, arg3);
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }

        super(stream, charset);
    }
}
