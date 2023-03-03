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

/** This support class provides a view on a map's keys. It allows to modify the map for which it was created. */
export class MapKeyView<K, V> extends Collection<K> implements java.util.Set<K> {
    public constructor(private sharedBackend: IHashMapViewBackend<K, V>) {
        super();
    }

    public *[Symbol.iterator](): IterableIterator<K> {
        yield* this.sharedBackend.backend.keys();
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

    public override contains(o: K): boolean {
        return this.sharedBackend.backend.has(o);
    }

    public override containsAll(c: java.util.Collection<K>): boolean {
        for (const entry of c) {
            if (!this.sharedBackend.backend.has(entry)) {
                return false;
            }
        }

        return true;
    }

    public override equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof MapKeyView)) {
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

    public override iterator(): JavaIterator<K> {
        return new IteratorWrapper(this.sharedBackend.backend.keys());
    }

    public override remove(o: K): boolean {
        const m = this.sharedBackend.backend.remove(o);
        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public override removeAll(c: java.util.Collection<K>): boolean {
        const m = this.sharedBackend.backend.deleteAll(c);

        if (m !== this.sharedBackend.backend) {
            this.sharedBackend.backend = m;

            return true;
        }

        return false;
    }

    public override retainAll(c: java.util.Collection<K>): boolean {
        const m = this.sharedBackend.backend.withMutations((map) => {
            const candidates: K[] = [];
            for (const e of map) {
                if (!c.contains(e[0])) {
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

    public override toArray(): K[];
    public override toArray<U extends K>(a: U[]): U[];
    public override toArray<U extends K>(a?: U[]): K[] | U[] {
        const result = [...this.sharedBackend.backend.keys()];

        return a ? result as U[] : result;
    }
}
