/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

export interface AutoCloseable {
    /** Closes this resource, relinquishing any underlying resources. */
    close(): void;
}
