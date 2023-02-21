/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { Collection } from "./Collection";

// The set interface does not add any new method to the Collection interface.

export interface Set<T> extends java.util.Collection<T> {
    add(e: T): boolean;
}

export class Set<T> extends Collection<T> {
}
