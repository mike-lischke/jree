/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

export interface Channel extends java.io.Closeable {
    /** Closes this channel. */
    close(): void;

    /** Tells whether or not this channel is open. */
    isOpen(): boolean;
}
