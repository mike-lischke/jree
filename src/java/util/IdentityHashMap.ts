/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../lang/Object";

import { MurmurHash } from "../../MurmurHash";
import { NotImplementedError } from "../../NotImplementedError";
import { Cloneable } from "../lang/Cloneable";
import { Serializable } from "../io/Serializable";
import { JavaMap } from "./Map";
import { JavaSet } from "./Set";
import { Collection } from "./Collection";

export class IdentityHashMap<K, V> extends JavaObject
    implements Cloneable<IdentityHashMap<K, V>>, Serializable, JavaMap<K, V> {

    // Since we are using reference equality in this map, we can just let TS map do the heavy lifting.
    private backingStore = new Map<K, V>();

    public constructor(expectedMaxSize?: number);
    public constructor(map: JavaMap<K, V>);
    public constructor(expectedMaxSizeOrMap?: number | JavaMap<K, V>) {
        super();

        if (expectedMaxSizeOrMap && typeof expectedMaxSizeOrMap !== "number") {
            if (expectedMaxSizeOrMap) {
                this.putAll(expectedMaxSizeOrMap);
            }
        }

        // Ignore the max expected size.
    }

    public clear(): void {
        this.backingStore.clear();
    }

    public override clone(): IdentityHashMap<K, V> {
        return new IdentityHashMap<K, V>(this);
    }

    public containsKey(key: K): boolean {
        return this.backingStore.has(key);
    }

    public containsValue(value: V): boolean {
        for (const e of this.backingStore) {
            if (e[1] === value) {
                return true;
            }
        }

        return false;
    }

    public entrySet(): JavaSet<JavaMap.Entry<K, V>> {
        throw new NotImplementedError();
    }

    public get(key: K): V | null {
        return this.backingStore.get(key) ?? null;
    }

    public isEmpty(): boolean {
        return this.backingStore.size === 0;
    }

    public keySet(): JavaSet<K> {
        throw new NotImplementedError();
    }

    public put(key: K, value: V): V | null {
        const result = this.backingStore.get(key);
        this.backingStore.set(key, value);

        return result ?? null;
    }

    public putAll(map: JavaMap<K, V>): void {
        if (map instanceof IdentityHashMap<K, V>) {
            (map.backingStore as Map<K, V>).forEach((value, key) => {
                this.backingStore.set(key, value);
            });
        } else {
            const entries = map.entrySet();
            for (const entry of entries) {
                this.backingStore.set(entry.getKey()!, entry.getValue()!);
            }
        }
    }

    public remove(key: K): V | null {
        const result = this.backingStore.get(key);
        this.backingStore.delete(key);

        return result ?? null;
    }

    public size(): number {
        return this.backingStore.size;
    }

    public override hashCode(): number {
        let sum = 0;
        for (const entry of this.backingStore) {
            sum += (entry[0] === null ? 0 : MurmurHash.hashCode(entry[0]))
                ^ (entry[1] === null ? 0 : MurmurHash.hashCode([1]));
        }

        return sum;
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof IdentityHashMap<K, V>)) {
            return false;
        }

        if (this.backingStore.size !== o.backingStore.size) {
            return false;
        }

        for (const entry of o.backingStore as Map<K, V>) {
            const value = this.backingStore.get(entry[0]);
            if (value === undefined || value !== entry[1]) {
                return false;
            }
        }

        return true;
    }

    public values(): Collection<V> {
        throw new NotImplementedError();
    }
}
