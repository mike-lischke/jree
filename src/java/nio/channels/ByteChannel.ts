/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { ReadableByteChannel } from "./ReadableByteChannel";
import { WritableByteChannel } from "./WritableByteChannel";

/**
 * A channel that can read and write bytes. This interface simply unifies ReadableByteChannel and
 * WritableByteChannel; it does not specify any new operations.
 */
export interface ByteChannel extends ReadableByteChannel, WritableByteChannel {
}
