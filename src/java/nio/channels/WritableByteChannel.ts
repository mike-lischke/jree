/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ByteBuffer } from "../ByteBuffer";
import { Channel } from "./Channel";

export interface WritableByteChannel extends Channel {
    /** Writes a sequence of bytes to this channel from the given buffer. */
    write(src: ByteBuffer): number;
}
