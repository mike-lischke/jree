/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

export interface WritableByteChannel extends java.nio.channels.Channel {
    /** Writes a sequence of bytes to this channel from the given buffer. */
    write(src: java.nio.ByteBuffer): number;
}
