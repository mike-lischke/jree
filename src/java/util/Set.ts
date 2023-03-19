/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Collection } from "./Collection";

// The set interface does not add any new method to the Collection interface.

export interface JavaSet<T> extends Collection<T> {
    add(e: T): boolean;
}

export class JavaSet<T> extends Collection<T> {
}
