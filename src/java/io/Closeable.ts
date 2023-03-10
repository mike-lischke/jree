/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { AutoCloseable } from "../lang/AutoCloseable";

export interface Closeable extends AutoCloseable {
    /** Closes this stream and releases any system resources associated with it. */
    close(): void;
}
