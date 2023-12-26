/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../lang/String.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { Charset } from "../nio/charset/Charset.js";
import { JavaFile } from "./File.js";
import { FileDescriptor } from "./FileDescriptor.js";
import { FileInputStream } from "./FileInputStream.js";
import { InputStreamReader } from "./InputStreamReader.js";

export class JavaFileReader extends InputStreamReader {

    /** Creates a new FileReader, given the File to read, using the platform's default charset. */
    public constructor(file: JavaFile);
    /** Creates a new FileReader, given the FileDescriptor to read, using the platform's default charset. */
    public constructor(fd: FileDescriptor);
    /** Creates a new FileReader, given the File to read and the charset. */
    public constructor(file: JavaFile, charset: Charset);
    /** Creates a new FileReader, given the name of the file to read, using the platform's default charset. */
    public constructor(fileName: JavaString | string);
    /** Creates a new FileReader, given the name of the file to read and the charset. */
    public constructor(fileName: JavaString | string, charset: Charset);
    public constructor(...args: unknown[]) {
        switch (args.length) {
            case 1: {
                const arg = args[0] as JavaFile | FileDescriptor | JavaString | string;
                if (arg instanceof JavaFile) {
                    super(new FileInputStream(arg));
                } else if (arg instanceof FileDescriptor) {
                    super(new FileInputStream(arg));
                } else {
                    super(new FileInputStream(arg));
                }

                break;
            }

            case 2: {
                const [arg1, charset] = args as [JavaFile | FileDescriptor | JavaString | string, Charset];
                if (arg1 instanceof JavaFile) {
                    super(new FileInputStream(arg1), charset);
                } else if (arg1 instanceof FileDescriptor) {
                    super(new FileInputStream(arg1), charset);
                } else {
                    super(new FileInputStream(arg1), charset);
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }
    }
}
