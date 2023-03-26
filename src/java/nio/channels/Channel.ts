/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Closeable } from "../../io/Closeable";

export interface Channel extends Closeable {
    /** Closes this channel. */
    close(): void;

    /** Tells whether or not this channel is open. */
    isOpen(): boolean;
}
