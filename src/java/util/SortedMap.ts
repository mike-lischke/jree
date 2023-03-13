/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Comparator } from "./Comparator";
import { JavaMap } from "./Map";
import { JavaSet } from "./Set";

/**
 * A Map that further provides a total ordering on its keys. The map is ordered according to the natural ordering of
 * its keys, or by a Comparator typically provided at sorted map creation time. This order is reflected when iterating
 * over the sorted map's collection views (returned by the entrySet, keySet and values methods). Several additional
 * operations are provided to take advantage of the ordering. (This interface is the map analogue of SortedSet.)
 */
export interface SortedMap<K, V> extends JavaMap<K, V> {
    /**
     * @returns a comparator used to order the keys in this map, or null if this map uses the natural ordering of
     * its keys.
     */
    comparator(): Comparator<K>;

    /** @returns a Set view of the mappings contained in this map. */
    entrySet(): JavaSet<JavaMap.Entry<K, V>>;

    /** @returns the first (lowest) key currently in this map. */
    firstKey(): K;

    /** @returns a view of the portion of this map whose keys are strictly less than toKey. */
    headMap(toKey: K): SortedMap<K, V>;

    /** @returns a Set view of the keys contained in this map. */
    keySet(): JavaSet<K>;

    /** @returns the last (highest) key currently in this map. */
    lastKey(): K;

    /** @returns a view of the portion of this map whose keys range from fromKey, inclusive, to toKey, exclusive. */
    subMap(fromKey: K, toKey: K): SortedMap<K, V>;

    /** @returns a view of the portion of this map whose keys are greater than or equal to fromKey. */
    tailMap(fromKey: K): SortedMap<K, V>;

    /** @returns a Collection view of the values contained in this map. */
    values(): JavaSet<V>;
}
