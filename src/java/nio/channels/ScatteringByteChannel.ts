/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ByteBuffer } from "../ByteBuffer";
import { ReadableByteChannel } from "./ReadableByteChannel";

export interface ScatteringByteChannel extends ReadableByteChannel {
    read(target: ByteBuffer): number;
    /** Reads a sequence of bytes from this channel into the given buffers. */
    read(target: ByteBuffer[]): bigint;
    /** Reads a sequence of bytes from this channel into a subsequence of the given buffers. */
    read(target: ByteBuffer[], offset: number, length: number): bigint;
}
