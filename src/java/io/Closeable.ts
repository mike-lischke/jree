/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AutoCloseable } from "../lang/AutoCloseable";

export interface Closeable extends AutoCloseable {
    /** Closes this stream and releases any system resources associated with it. */
    close(): void;
}
