/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IteratorWrapper } from "../../IteratorWrapper";

import { java } from "../..";
import { IHashMapViewBackend } from "./HashMap";
import { Collection } from "./Collection";
import { JavaIterator } from "./Iterator";

/** This support class provides a view on a map's values. It allows to modify the map for which it was created. */
export class MapValueView<K, V> extends Collection<V> implements java.util.Set<V> {
    public constructor(private sharedBackend: IHashMapViewBackend<K, V>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<V> {
        yield* this.sharedBackend.backend.values();
    }

    public override add(_e: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public override addAll(_c: unknown): boolean {
        throw new java.lang.UnsupportedOperationException();
    }

    public override clear(): void {
        this.sharedBackend.backend = this.sharedBackend.backend.clear();
    }

    public override contains(o: V): boolean {
        return this.sharedBackend.backend.includes(o);
    }

    public override containsAll(c: java.util.Collection<V>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.includes(entry)) {
                return false;
            }
        }

        return true;
    }

    public override equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapValueView)) {
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

    public override iterator(): JavaIterator<V> {
        return new IteratorWrapper(this.sharedBackend.backend.values());
    }

    public override remove(o: V): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (e[1] === o) {
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

    public override removeAll(c: java.util.Collection<V>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (c.contains(e[1])) {
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

    public override retainAll(c: java.util.Collection<V>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (!c.contains(e[1])) {
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

    public override toArray(): V[];
    public override toArray<U extends V>(a: U[]): U[];
    public override toArray<U extends V>(a?: U[]): V[] | U[] {
        const result = [...this.sharedBackend.backend.values()];

        return a ? result as U[] : result;
    }
}
