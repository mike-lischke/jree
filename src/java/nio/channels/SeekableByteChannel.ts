/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ByteBuffer } from "../ByteBuffer.js";
import { ByteChannel } from "./ByteChannel.js";

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
