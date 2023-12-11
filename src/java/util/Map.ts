/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import { makeReadOnly } from "../../helpers.js";
import { NullPointerException } from "../lang/NullPointerException.js";
import { UnsupportedOperationException } from "../lang/UnsupportedOperationException.js";
import { IReflection, JavaObject } from "../lang/Object.js";
import { Collection } from "./Collection.js";
import { Objects } from "./Objects.js";
import { JavaSet } from "./Set.js";
import { BiFunction } from "./function/BiFunction.js";
import { JavaFunction } from "./function/Function.js";

/** An object that maps keys to values. A map cannot contain duplicate keys; each key can map to at most one value. */
export interface JavaMap<K, V> extends IReflection {
    /** Removes all of the mappings from this map (optional operation). */
    clear(): void;

    /** Returns true if this map contains a mapping for the specified key. */
    containsKey(key: K): boolean;

    /** Returns true if this map maps one or more keys to the specified value. */
    containsValue(value: V): boolean;

    /** Returns a Set view of the mappings contained in this map. */
    entrySet(): JavaSet<JavaMap.Entry<K, V>>;

    /** Compares the specified object with this map for equality. */
    equals(o: unknown): boolean;

    /** Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key. */
    get(key: K): V | null;

    /** Returns the hash code value for this map. */
    hashCode(): number;

    /** Returns true if this map contains no key-value mappings. */
    isEmpty(): boolean;

    /** Returns a Set view of the keys contained in this map. */
    keySet(): JavaSet<K>;

    /** Associates the specified value with the specified key in this map (optional operation). */
    put(key: K, value: V): V | null;

    /** Copies all of the mappings from the specified map to this map (optional operation). */
    putAll(m: JavaMap<K, V>): void;

    /** Removes the mapping for a key from this map if it is present (optional operation). */
    remove(key: K): V | null;

    /** Returns the number of key-value mappings in this map. */
    size(): number;

    /** Returns a Collection view of the values contained in this map. */
    values(): Collection<V>;
}

export class JavaMap<K, V> extends JavaObject implements JavaMap<K, V> {
    /**
     * Attempts to compute a mapping for the specified key and its current mapped value (or null if there is no current
     * mapping).
     *
     * @param key key with which the specified value is to be associated
     * @param remappingFunction the function to compute a value
     *
     * @returns the new value associated with the specified key, or null if none
     */
    public compute(key: K, remappingFunction: BiFunction<K, V | null, V>): V | null {
        const oldValue = this.get(key);
        if (remappingFunction == null) {
            throw new NullPointerException();
        }

        const newValue = remappingFunction(key, oldValue);
        if (oldValue != null) {
            if (newValue != null) {
                this.put(key, newValue);
            } else {
                this.remove(key);
            }
        } else {
            if (newValue != null) {
                this.put(key, newValue);
            } else {
                return null;
            }
        }

        return newValue;
    }

    /**
     * If the specified key is not already associated with a value (or is mapped to null), attempts to compute its value
     * using the given mapping function and enters it into this map unless null.
     *
     * @param key key with which the specified value is to be associated
     * @param mappingFunction the function to compute a value
     *
     * @returns the current (existing or computed) value associated with the specified key, or null if the computed
     *          value is null
     */
    public computeIfAbsent(key: K, mappingFunction: JavaFunction<K, V>): V | null {
        const oldValue = this.get(key);
        if (oldValue == null) {
            if (mappingFunction == null) {
                throw new NullPointerException();
            }

            const newValue = mappingFunction(key);
            if (newValue != null) {
                this.put(key, newValue);
            }

            return newValue;
        }

        return oldValue;
    }

    /**
     * If the value for the specified key is present and non-null, attempts to compute a new mapping given the key and
     * its current mapped value. If the function returns null, the mapping is removed.
     *
     * @param key key with which the specified value is to be associated
     * @param remappingFunction the function to compute a value
     *
     * @returns the new value associated with the specified key, or null if none
     */
    public computeIfPresent(key: K, remappingFunction: BiFunction<K, V, V | null>): V | null {
        const oldValue = this.get(key);
        if (oldValue != null) {
            if (remappingFunction == null) {
                throw new NullPointerException();
            }

            const newValue = remappingFunction(key, oldValue);
            if (newValue != null) {
                this.put(key, newValue);
            } else {
                this.remove(key);
            }

            return newValue;
        }

        return null;
    }

    /**
     * Performs the given action for each entry in this map until all entries have been processed or the action
     * throws an exception.
     *
     * @param action The action to be performed for each entry.
     */
    public forEach(action: BiFunction<K, V, void>): void {
        this.entrySet().forEach((entry) => {
            action(entry.getKey(), entry.getValue());
        });
    }

    /**
     * @returns the value to which the specified key is mapped, or defaultValue if this map contains no mapping for
     * the key.
     *
     * @param key the key whose associated value is to be returned
     * @param defaultValue the default mapping of the key
     */
    public getOrDefault(key: K, defaultValue: V): V {
        const value = this.get(key);

        return value != null ? value : defaultValue;
    }

    /**
     * If the specified key is not already associated with a value or is associated with null, associates it with the
     * given non-null value. Otherwise, replaces the associated value with the results of the given remapping function,
     * or removes if the result is null.
     *
     * @param key key with which the resulting value is to be associated
     * @param value the non-null value to be merged with the existing value associated with the key or, if no existing
     *              value or a null value is associated with the key, to be associated with the key
     * @param remappingFunction the remapping function to recompute a value if present
     *
     * @returns the new value associated with the specified key, or null if no value is associated with the key
     */
    public merge(key: K, value: V, remappingFunction: BiFunction<V, V, V>): V | null {
        const oldValue = this.get(key);
        if (remappingFunction == null) {
            throw new NullPointerException();
        }

        const newValue = oldValue == null ? value : remappingFunction(oldValue, value);
        if (newValue == null) {
            this.remove(key);
        } else {
            this.put(key, newValue);
        }

        return newValue;
    }

    /**
     * If the specified key is not already associated with a value (or is mapped to null) associates it with the given
     * value and returns null, else returns the current value.
     *
     * @param key key with which the specified value is to be associated
     * @param value value to be associated with the specified key
     *
     * @returns the previous value associated with the specified key, or null if there was no mapping for the key.
     *          (A null return can also indicate that the map previously associated null with the key, if the
     *          implementation supports null values.)
     */
    public putIfAbsent(key: K, value: V): V | null {
        const oldValue = this.get(key);
        if (oldValue == null) {
            this.put(key, value);
        }

        return oldValue;
    }

    /** Replaces the entry for the specified key only if it is currently mapped to some value. */
    public replace(key: K, value: V | null): V | null;
    /** Replaces the entry for the specified key only if currently mapped to the specified value. */
    public replace(key: K, oldValue: V | null, newValue: V | null): boolean;
    public replace(...args: unknown[]): V | null | boolean {
        if (args.length === 2) {
            const [key, value] = args as [K, V];
            const oldValue = this.get(key);
            if (oldValue != null) {
                return this.put(key, value);
            }

            return null;
        } else {
            const [key, oldValue, newValue] = args as [K, V, V];
            const currentValue = this.get(key);
            if (currentValue !== null && Objects.equals(currentValue, oldValue)) {
                this.put(key, newValue);

                return true;
            }
        }

        return false;
    }

    public replaceAll(func: BiFunction<K, V, V>): void {
        if (func == null) {
            throw new NullPointerException();
        }

        this.entrySet().forEach((entry) => {
            entry.setValue(func(entry.getKey(), entry.getValue()));
        });
    }
}

export namespace JavaMap {
    export abstract class Entry<K, V> extends JavaObject {
        /** Returns the key corresponding to this entry. */
        public abstract getKey(): K;

        /** Returns the value corresponding to this entry. */
        public abstract getValue(): V;

        /** Replaces the value corresponding to this entry with the specified value (optional operation). */
        public abstract setValue(value: V): V;
    }

    /**
     * @param map the Map for which an unmodifiable view is to be returned.
     *
     * @returns an unmodifiable Map containing the entries of the given Map.
     */
    export const copyOf = <K, V>(map: JavaMap<K, V>): JavaMap<K, V> => {
        const result = new JavaMap<K, V>();
        map.entrySet().forEach((entry) => {
            return result.put(entry.getKey(), entry.getValue());
        });

        return makeReadOnly(result);
    };

    /**
     * @returns an unmodifiable Map.Entry containing the given key and value.
     *
     * @param key the key for the entry
     * @param value the value for the entry
     */
    export const entry = <K, V>(key: K, value: V): Entry<K, V> => {
        if (key == null || value == null) {
            throw new NullPointerException();
        }

        return new class extends Entry<K, V> {
            public constructor() {
                super();
            }

            public getKey(): K {
                return key;
            }

            public getValue(): V {
                return value;
            }

            public setValue(value: V): V {
                throw new UnsupportedOperationException();
            }
        }();
    };

    export function of<K, V>(): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K,
        v6: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K,
        v6: V, k7: K, v7: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K,
        v6: V, k7: K, v7: V, k8: K, v8: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K,
        v6: V, k7: K, v7: V, k8: K, v8: V, k9: K, v9: V): JavaMap<K, V>;
    export function of<K, V>(k1: K, v1: V, k2: K, v2: V, k3: K, v3: V, k4: K, v4: V, k5: K, v5: V, k6: K,
        v6: V, k7: K, v7: V, k8: K, v8: V, k9: K, v9: V, k10: K, v10: V): JavaMap<K, V>;
    /**
     * @returns an unmodifiable Map containing the given key-value pairs.
     *
     * @param args the key-value pairs that make up the map
     */
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    export function of<K, V>(...args: unknown[]): JavaMap<K, V> {
        const result = new JavaMap<K, V>();
        for (let i = 0; i < args.length; i += 2) {
            result.put(args[i] as K, args[i + 1] as V);
        }

        return makeReadOnly(result);
    }

    /**
     * @param entries the entries for the new map
     *
     * @returns an unmodifiable map containing keys and values extracted from the given entries.
     */
    export const ofEntries = <K, V>(...entries: Array<Entry<K, V>>): JavaMap<K, V> => {
        const result = new JavaMap<K, V>();
        entries.forEach((entry) => {
            return result.put(entry.getKey(), entry.getValue());
        });

        return makeReadOnly(result);
    };
}
