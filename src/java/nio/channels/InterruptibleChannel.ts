/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Channel } from "./Channel";

/** A channel that can be asynchronously closed and interrupted. */
export interface InterruptibleChannel extends Channel {
    /** Closes this channel. */
    close(): void;
}
