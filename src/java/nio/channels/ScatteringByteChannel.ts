/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

export interface ScatteringByteChannel extends java.nio.channels.ReadableByteChannel {
    read(target: java.nio.ByteBuffer): number;
    /** Reads a sequence of bytes from this channel into the given buffers. */
    read(target: java.nio.ByteBuffer[]): bigint;
    /** Reads a sequence of bytes from this channel into a subsequence of the given buffers. */
    read(target: java.nio.ByteBuffer[], offset: number, length: number): bigint;
}
