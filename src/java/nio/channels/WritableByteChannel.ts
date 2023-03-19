/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ByteBuffer } from "../ByteBuffer";
import { Channel } from "./Channel";

export interface WritableByteChannel extends Channel {
    /** Writes a sequence of bytes to this channel from the given buffer. */
    write(src: ByteBuffer): number;
}
