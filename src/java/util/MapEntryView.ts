/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { HashMapEntry } from "./HashMapEntry";
import { JavaMapEntryIterator } from "../../JavaMapEntryIterator";
import { IHashMapViewBackend } from "./HashMap";
import { Collection } from "./Collection";
import { JavaMap } from "./Map";
import { JavaSet } from "./Set";
import { UnsupportedOperationException } from "../lang/UnsupportedOperationException";
import { JavaIterator } from "./Iterator";

/** This support class provides a view on a map's keys. It allows to modify the map for which it was created. */
export class MapEntryView<K, V> extends Collection<JavaMap.Entry<K, V>> implements JavaSet<JavaMap.Entry<K, V>> {
    public constructor(private sharedBackend: IHashMapViewBackend<K, V>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<JavaMap.Entry<K, V>> {
        for (const entry of this.sharedBackend.backend.entries()) {
            yield new HashMapEntry(entry[0], entry[1]);
        }
    }

    public add(_e: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public addAll(_c: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    public contains(o: JavaMap.Entry<K, V>): boolean {
        return this.sharedBackend.backend.has(o.getKey());
    }

    public containsAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.has(entry.getKey())) {
                return false;
            }
        }

        return true;
    }

    public equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapEntryView)) {
            return false;
        }

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    public iterator(): JavaIterator<JavaMap.Entry<K, V>> {
        return new JavaMapEntryIterator(this.sharedBackend.backend.entries());
    }

    public remove(o: K): boolean {
        return this.sharedBackend.backend.remove(o) !== null;
    }

    public removeAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        const m = this.sharedBackend.backend.deleteAll(c.toArray().map((e: JavaMap.Entry<K, V>) => {
            return e.getKey();
        }));

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public retainAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (!c.contains(new HashMapEntry(e[0], e[1]))) {
                    candidates.push(e[0]);
                }
            }

            for (const k of candidates) {
                map.remove(k);
            }
        });

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public size(): number {
        return this.sharedBackend.backend.count();
    }

    public toArray(): Array<JavaMap.Entry<K, V>>;
    public toArray<U extends JavaMap.Entry<K, V>>(a: U[]): U[];
    public toArray<U extends JavaMap.Entry<K, V>>(a?: U[]): Array<JavaMap.Entry<K, V>> | U[] {
        const result = [...this.sharedBackend.backend.entries()].map((pair) => {
            return new HashMapEntry(pair[0], pair[1]);
        });

        return a ? result as Array<JavaMap.Entry<K, V>> : result;
    }
}
