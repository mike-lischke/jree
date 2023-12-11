/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Channel } from "./Channel.js";

/** A channel that can be asynchronously closed and interrupted. */
export interface InterruptibleChannel extends Channel {
    /** Closes this channel. */
    close(): void;
}
