/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/** A channel that can be asynchronously closed and interrupted. */
export interface InterruptibleChannel extends java.nio.channels.Channel {
    /** Closes this channel. */
    close(): void;
}
