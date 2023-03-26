/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { OrderedSet } from "immutable";

import { HashSet, IHashSetViewBackend } from "./HashSet";

export class LinkedHashSet<V> extends HashSet<V> {
    protected createBackend(): IHashSetViewBackend<V> {
        return { backend: OrderedSet<V>() };
    }
}
