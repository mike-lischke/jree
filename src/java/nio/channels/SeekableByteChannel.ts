/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ByteBuffer } from "../ByteBuffer";
import { ByteChannel } from "./ByteChannel";

/** A byte channel that maintains a current position and allows the position to be changed. */
export interface SeekableByteChannel extends ByteChannel {
    /** Returns this channel's position. */
    position(): bigint;

    /** Sets this channel's position. */
    position(newPosition: bigint): SeekableByteChannel;

    /** Reads a sequence of bytes from this channel into the given buffer. */
    read(dst: ByteBuffer): number;

    /** Returns the current size of entity to which this channel is connected. */
    size(): bigint;

    /** Truncates this channel's file to the given size. */
    truncate(size: bigint): SeekableByteChannel;

    write(src: ByteBuffer): number;
}
