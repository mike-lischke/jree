/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ByteBuffer } from "../ByteBuffer";
import { Channel } from "./Channel";

export interface ReadableByteChannel extends Channel {
    /** Reads a sequence of bytes from this channel into the given buffer. */
    read(dst: ByteBuffer): number;
}
