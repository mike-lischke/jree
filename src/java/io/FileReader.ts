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
import { FileInputStream } from "./FileInputStream";
import { InputStreamReader } from "./InputStreamReader";

export class FileReader extends InputStreamReader {
    /**
     * Creates a new {@code FileReader}, given the name of the file to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param      fileName the name of the file to read
     * @throws     FileNotFoundException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(fileName: JavaString);
    /**
     * Creates a new {@code FileReader}, given the {@code File} to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param      file the {@code File} to read
     * @throws     FileNotFoundException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     * @see        Charset#defaultCharset()
     */
    public constructor(file: JavaFile);
    /**
     * Creates a new {@link FileReader}, given the {@link FileDescriptor} to read,
     * using the {@link Charset#defaultCharset() default charset}.
     *
     * @param fd the {@link FileDescriptor} to read
     * @see Charset#defaultCharset()
     */
    public constructor(fd: FileDescriptor);
    /**
     * Creates a new {@code FileReader}, given the name of the file to read
     * and the {@link Charset charset}.
     *
     * @param      fileName the name of the file to read
     * @param      charset the {@link Charset}
     * @throws     IOException  if the named file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(fileName: JavaString, charset: Charset);
    /**
     * Creates a new {@code FileReader}, given the {@link JavaFile} to read and
     * the {@link Charset}.
     *
     * @param      file the {@code File} to read
     * @param      charset the {@link Charset charset}
     * @throws     IOException  if the file does not exist,
     *             is a directory rather than a regular file,
     *             or for some other reason cannot be opened for
     *             reading.
     */
    public constructor(file: JavaFile, charset: Charset);
    public constructor(fileNameOrFileOrFd: JavaString | JavaFile | FileDescriptor,
        charset?: Charset) {
        if (fileNameOrFileOrFd instanceof JavaString) {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        } else if (fileNameOrFileOrFd instanceof JavaFile) {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        } else {
            super(new FileInputStream(fileNameOrFileOrFd), charset);
        }
    }

}
