/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../..";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { Charset } from "../nio/charset/Charset";
import { JavaFile } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { FileInputStream } from "./FileInputStream";
import { InputStreamReader } from "./InputStreamReader";

export class FileReader extends InputStreamReader {

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
