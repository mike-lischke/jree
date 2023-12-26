/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { HashMapEntry } from "./HashMapEntry.js";
import { JavaMapEntryIterator } from "../../JavaMapEntryIterator.js";
import { IHashMapViewBackend } from "./HashMap.js";
import { Collection } from "./Collection.js";
import { JavaMap } from "./Map.js";
import { JavaSet } from "./Set.js";
import { UnsupportedOperationException } from "../lang/UnsupportedOperationException.js";
import { JavaIterator } from "./Iterator.js";

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

    public override add(_e: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public override addAll(_c: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public override clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    public override contains(o: JavaMap.Entry<K, V>): boolean {
        return this.sharedBackend.backend.has(o.getKey());
    }

    public override containsAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.has(entry.getKey())) {
                return false;
            }
        }

        return true;
    }

    public override equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapEntryView)) {
            return false;
        }

        return this.sharedBackend.backend.equals(o.sharedBackend.backend);
    }

    public override hashCode(): number {
        return this.sharedBackend.backend.hashCode();
    }

    public override isEmpty(): boolean {
        return this.sharedBackend.backend.isEmpty();
    }

    public override iterator(): JavaIterator<JavaMap.Entry<K, V>> {
        return new JavaMapEntryIterator(this.sharedBackend.backend.entries());
    }

    public override remove(o: JavaMap.Entry<K, V>): boolean {
        return this.sharedBackend.backend.remove(o.getKey()) !== null;
    }

    public override removeAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        const m = this.sharedBackend.backend.deleteAll(c.toArray().map((e: JavaMap.Entry<K, V>) => {
            return e.getKey();
        }));

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public override retainAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
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

    public override size(): number {
        return this.sharedBackend.backend.count();
    }

    public override toArray(): Array<JavaMap.Entry<K, V>>;
    public override toArray<U extends JavaMap.Entry<K, V>>(a: U[]): U[];
    public override toArray<U extends JavaMap.Entry<K, V>>(a?: U[]): Array<JavaMap.Entry<K, V>> | U[] {
        const result = [...this.sharedBackend.backend.entries()].map((pair) => {
            return new HashMapEntry(pair[0], pair[1]);
        });

        return a ? result as Array<JavaMap.Entry<K, V>> : result;
    }
}
