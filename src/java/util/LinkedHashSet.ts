/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { OrderedSet } from "immutable";

import { HashSet, IHashSetViewBackend } from "./HashSet";

export class LinkedHashSet<V> extends HashSet<V> {
    protected createBackend(): IHashSetViewBackend<V> {
        return { backend: OrderedSet<V>() };
    }
}
