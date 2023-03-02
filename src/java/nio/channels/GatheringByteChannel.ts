/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/** A channel that can write bytes to a sequence of buffers. */
export interface GatheringByteChannel extends java.nio.channels.WritableByteChannel {
    write(src: java.nio.ByteBuffer): number;
    /** Writes a sequence of bytes to this channel from a subsequence of the given buffers. */
    write(source: java.nio.ByteBuffer[]): bigint;
    /** Writes a sequence of bytes to this channel from a subsequence of the given buffers. */
    write(source: java.nio.ByteBuffer[], offset: number, length: number): bigint;

}
