/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ReadableByteChannel } from "./ReadableByteChannel";
import { WritableByteChannel } from "./WritableByteChannel";

/**
 * A channel that can read and write bytes. This interface simply unifies ReadableByteChannel and
 * WritableByteChannel; it does not specify any new operations.
 */
export interface ByteChannel extends ReadableByteChannel, WritableByteChannel {
}
