/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../..";
import { Charset } from "../nio/charset/Charset";
import { JavaFile } from "./File";
import { FileDescriptor } from "./FileDescriptor";
import { FileOutputStream } from "./FileOutputStream";
import { OutputStreamWriter } from "./OutputStreamWriter";

export class FileWriter extends OutputStreamWriter {
    public constructor(fileName: JavaString);
    public constructor(fileName: JavaString, append: boolean);
    public constructor(file: JavaFile);
    public constructor(file: JavaFile, append: boolean);
    public constructor(fd: FileDescriptor);
    public constructor(fileName: JavaString, charset: Charset);
    public constructor(fileName: JavaString, charset: Charset, append: boolean);
    public constructor(file: JavaFile, charset: Charset);
    public constructor(file: JavaFile, charset: Charset, append: boolean);
    public constructor(fileNameOrFileOrFd: JavaString | JavaFile | FileDescriptor,
        appendOrCharset?: boolean | Charset, append?: boolean) {
        let doAppend = false;
        let charset;
        if (typeof appendOrCharset === "boolean") {
            doAppend = appendOrCharset;
        } else if (append !== undefined) {
            doAppend = append;
            charset = appendOrCharset;
        }

        let stream: FileOutputStream;
        if (fileNameOrFileOrFd instanceof JavaString) {
            stream = new FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else if (fileNameOrFileOrFd instanceof JavaFile) {
            stream = new FileOutputStream(fileNameOrFileOrFd, doAppend);
        } else {
            stream = new FileOutputStream(fileNameOrFileOrFd);
        }

        super(stream, charset);
    }
}
