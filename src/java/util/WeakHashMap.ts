/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Collection } from "./Collection";
import { JavaMap } from "./Map";
import { JavaSet } from "./Set";
import { WeakMapEntryView } from "./WeakMapEntryView";
import { WeakMapKeyView } from "./WeakMapKeyView";

/**
 * This interface provides shared access to the backend of a HashMap instance for all currently active key, value
 * and entry views. This way each of them sees updates of the backend and can update it as well.
 * I wish we had friend classes, which would make this unnecessary.
 */
export interface IWeakHashMapViewBackend<K extends object, V> {
    backend: WeakMap<K, { value: V, ref: WeakRef<K>; }>;
    refSet: Set<WeakRef<K>>;
    finalizationGroup: FinalizationRegistry<{ set: Set<WeakRef<K>>; ref: WeakRef<K>; }>;
}

export class WeakHashMap<K extends object, V> extends JavaObject implements JavaMap<K, V> {
    // Implementation based on https://github.com/tc39/proposal-weakrefs#iterable-weakmaps.
    #sharedBackend: IWeakHashMapViewBackend<K, V>;

    /** Constructs a new, empty WeakHashMap with the given initial capacity and the given load factor. */
    public constructor(initialCapacity?: number, loadFactor?: number);
    /** Constructs a new WeakHashMap with the same mappings as the specified map. */
    public constructor(m: JavaMap<K, V>);
    public constructor(initialCapacityOrM?: number | JavaMap<K, V>, _loadFactor?: number) {
        super();

        this.#sharedBackend = {
            backend: new WeakMap(),
            refSet: new Set(),
            finalizationGroup: new FinalizationRegistry(WeakHashMap.#cleanup),
        };

        // Capacity and load factor are ignored.
        if (initialCapacityOrM && typeof initialCapacityOrM !== "number") {
            for (const entry of initialCapacityOrM.entrySet()) {
                this.put(entry.getKey(), entry.getValue());
            }
        }
    }

    static #cleanup = (obj: { set: Set<WeakRef<{}>>, ref: WeakRef<{}>; }) => {
        obj.set.delete(obj.ref);
    };

    public *[Symbol.iterator](): IterableIterator<[K, V]> {
        for (const ref of this.#sharedBackend.refSet) {
            const key = ref.deref();
            if (!key) {
                continue;
            }

            const { value } = this.#sharedBackend.backend.get(key)!;
            yield [key, value];
        }
    }

    /** Removes all of the mappings from this map. */
    public clear(): void {
        this.#sharedBackend.backend = new WeakMap();
        this.#sharedBackend.refSet.clear();
    }

    /**
     * Returns true if this map contains a mapping for the specified key.
     *
     * @param key tbd
     *
     * @returns tbd
     */
    public containsKey(key: K): boolean {
        return this.#sharedBackend.backend.has(key);
    }

    /**
     * @param value The value to look up.
     *
     * @returns true if this map maps one or more keys to the specified value.
     */
    public containsValue(value: V): boolean {
        for (const [_, candidate] of this) {
            if (candidate === value) {
                return true;
            }
        }

        return false;
    }

    /** @returns a Set view of the mappings contained in this map. */
    public entrySet(): JavaSet<JavaMap.Entry<K, V>> {
        return new WeakMapEntryView(this.#sharedBackend);
    }

    /**
     * @param key The key for which to return the associated value.
     *
     * @returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.
     */
    public get(key: K): V | null {
        const entry = this.#sharedBackend.backend.get(key);

        return entry?.value ?? null;
    }

    /** @returns true if this map contains no key - value mappings. */
    public isEmpty(): boolean {
        return this.#sharedBackend.refSet.size > 0;
    }

    /** @returns a Set view of the keys contained in this map. */
    public keySet(): JavaSet<K> {
        return new WeakMapKeyView(this.#sharedBackend);
    }

    /**
     * Associates the specified value with the specified key in this map.;
     *
     * @param key The target key.
     * @param value The value to associate with the given key.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public put(key: K, value: V): V | null {
        const ref = new WeakRef(key);

        const previous = this.#sharedBackend.backend.get(key);

        this.#sharedBackend.backend.set(key, { value, ref });
        this.#sharedBackend.refSet.add(ref);
        this.#sharedBackend.finalizationGroup.register(key, { set: this.#sharedBackend.refSet, ref }, ref);

        return previous?.value ?? null;
    }

    /**
     * Copies all of the mappings from the specified map to this map.
     *
     * @param m A map with the values to copy.
     */
    public putAll(m: JavaMap<K, V>): void {
        for (const entry of m.entrySet()) {
            this.put(entry.getKey(), entry.getValue());
        }
    }

    /**
     * Removes the mapping for the specified key from this map if present.
     *
     * @param key The key of the mapping to remove.
     *
     * @returns the previous value associated with key, or null if there was no mapping for key.
     *          (A null return can also indicate that the map previously associated null with key.)
     */
    public remove(key: K): V | null {
        const entry = this.#sharedBackend.backend.get(key);
        if (!entry) {
            return null;
        }

        this.#sharedBackend.backend.delete(key);
        this.#sharedBackend.refSet.delete(entry.ref);
        this.#sharedBackend.finalizationGroup.unregister(entry.ref);

        return entry.value;
    }

    /** @returns the number of key - value mappings in this map. */
    public size(): number {
        return this.#sharedBackend.refSet.size;
    }

    /** Returns a Collection view of the values contained in this map. */
    public values(): Collection<V> {
        throw new NotImplementedError();
    }

    public override hashCode(): number {
        let result = 0;
        for (const entry of this.entrySet()) {
            result += entry.hashCode();
        }

        return result;
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof WeakHashMap)) {
            return false;
        }

        if (this.#sharedBackend.refSet.size !== o.#sharedBackend.refSet.size) {
            return false;
        }

        // This class is intended primarily for use with key objects whose equals methods test for
        // object identity using the === operator (reference equality).
        for (const [key, value] of this) {
            const other = o.get(key);
            if (other === undefined || other !== value) {
                return false;
            }
        }

        return true;
    }

    public override toString(): JavaString {
        const entries: string[] = [];
        for (const [key, value] of this) {
            entries.push(`${key}=${value}`);
        }

        return new JavaString(`{${entries.join(", ")}}`);
    }
}
