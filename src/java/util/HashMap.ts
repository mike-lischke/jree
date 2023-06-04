/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Map } from "immutable";
import { Serializable } from "../io/Serializable";
import { Cloneable } from "../lang/Cloneable";

import { Collection } from "./Collection";
import { JavaMap } from "./Map";
import { MapEntryView } from "./MapEntryView";

import { MapKeyView } from "./MapKeyView";
import { MapValueView } from "./MapValueView";
import { JavaSet } from "./Set";

/**
 * This interface provides shared access to the backend of a HashMap instance for all currently active key, value
 * and entry views. This way each of them sees updates of the backend and can update it as well.
 * I wish we had friend classes, which would make this unnecessary.
 */
export interface IHashMapViewBackend<K, V> {
    backend: Map<K, V>;
}

export class HashMap<K, V> extends JavaMap<K, V> implements Cloneable<HashMap<K, V>>, Serializable {

    private sharedBackend: IHashMapViewBackend<K, V>;

    public constructor(initialCapacity?: number, loadFactor?: number);
    public constructor(map: JavaMap<K, V>);
    public constructor(initialCapacityOrMap?: number | JavaMap<K, V>, _loadFactor?: number) {
        super();

        this.sharedBackend = this.createBackend();

        // Initial capacity and load factor are ignored in this implementation.
        if (initialCapacityOrMap && typeof initialCapacityOrMap !== "number") {
            this.putAll(initialCapacityOrMap);
        }
    }

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        yield* this.sharedBackend.backend[Symbol.iterator]();
    }

    /** Removes all of the mappings from this map. */
    public override clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    /** @returns a shallow copy of this HashMap instance: the keys and values themselves are not cloned. */
    public override clone(): HashMap<K, V> {
        return new HashMap<K, V>(this);
    }

    /**
     * @param key The key to look up.
     *
     * @returns true if this map contains a mapping for the specified key.
     */
    public override containsKey(key: K): boolean {
        return this.sharedBackend.backend.has(key);
    }

    /**
     * @param value The value to look up.
     *
     * @returns true if this map maps one or more keys to the specified value.
     */
    public override containsValue(value: V): boolean {
        return this.sharedBackend.backend.includes(value);
    }

    /** @returns a Set view of the mappings contained in this map. */
    public override entrySet(): JavaSet<JavaMap.Entry<K, V>> {
        return new MapEntryView(this.sharedBackend);
    }

    /**
     * @param key The key for which to return the associated value.
     *
     * @returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
     */
    public override get(key: K): V | null {
        return this.sharedBackend.backend.get(key) ?? null;
    }

    /** @returns true if this map contains no key-value mappings. */
    public override isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    /** @returns a Set view of the keys contained in this map. */
    public override keySet(): JavaSet<K> {
        return new MapKeyView<K, V>(this.sharedBackend);
    }

    /**
     * Associates the specified value with the specified key in this map.
     *
     * @param key The target key.
     * @param value The value to associate with the given key.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public override put(key: K, value: V): V | null {
        const previous = this.sharedBackend.backend.get(key);
        const m = this.sharedBackend.backend.set(key, value);
        if (this.sharedBackend.backend !== m) {
            this.sharedBackend.backend = m;
        }

        return previous ?? null;
    }

    /**
     * Copies all of the mappings from the specified map to this map.
     *
     * @param map A map with the values to copy.
     */
    public override putAll(map: JavaMap<K, V>): void {
        const m = this.sharedBackend.backend.withMutations((mutable) => {
            for (const entry of map.entrySet()) {
                mutable.set(entry.getKey(), entry.getValue());
            }
        });

        this.sharedBackend.backend = m;
    }

    /**
     * Removes the mapping for the specified key from this map if present.
     *
     * @param key The key of the mapping to remove.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public override remove(key: K): V | null {
        const previous = this.sharedBackend.backend.get(key);
        this.sharedBackend.backend = this.sharedBackend.backend.delete(key);

        return previous ?? null;
    }

    public override size(): number {
        return this.sharedBackend.backend.count();
    }

    public override hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public override equals(o: Object): boolean {
        if (!(o instanceof HashMap)) {
            return false;
        }

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public override values(): Collection<V> {
        return new MapValueView(this.sharedBackend);
    }

    protected createBackend(): IHashMapViewBackend<K, V> {
        return { backend: Map<K, V>() };
    }
}
