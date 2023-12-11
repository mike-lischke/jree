/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { OrderedMap } from "immutable";

import { HashMap, IHashMapViewBackend } from "./HashMap.js";

export class LinkedHashMap<K, V> extends HashMap<K, V> {
    protected override createBackend(): IHashMapViewBackend<K, V> {
        return { backend: OrderedMap<K, V>() };
    }
}
