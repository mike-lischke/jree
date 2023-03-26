/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ByteBuffer } from "../ByteBuffer";
import { WritableByteChannel } from "./WritableByteChannel";

/** A channel that can write bytes to a sequence of buffers. */
export interface GatheringByteChannel extends WritableByteChannel {
    write(src: ByteBuffer): number;
    /** Writes a sequence of bytes to this channel from a subsequence of the given buffers. */
    write(source: ByteBuffer[]): bigint;
    /** Writes a sequence of bytes to this channel from a subsequence of the given buffers. */
    write(source: ByteBuffer[], offset: number, length: number): bigint;

}
