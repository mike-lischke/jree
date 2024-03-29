/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IteratorWrapper } from "../../IteratorWrapper.js";
import { NotImplementedError } from "../../NotImplementedError.js";

import { UnsupportedOperationException } from "../lang/UnsupportedOperationException.js";
import { Collection } from "./Collection.js";
import { JavaIterator } from "./Iterator.js";
import { JavaSet } from "./Set.js";
import { IWeakHashMapViewBackend } from "./WeakHashMap.js";

/** This support class provides a view on a weak map's keys. It allows to modify the map for which it was created. */
export class WeakMapKeyView<K extends object, V> extends Collection<K>
    implements JavaSet<K> {
    #sharedBackend: IWeakHashMapViewBackend<K, V>;

    public constructor(sharedBackend: IWeakHashMapViewBackend<K, V>) {
        super();

        this.#sharedBackend = sharedBackend;
    }

    public *[Symbol.iterator](): IterableIterator<K> {
        for (const ref of this.#sharedBackend.refSet) {
            const key = ref.deref();
            if (!key) {
                continue;
            }

            yield key;
        }
    }

    public override add(_e: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public override addAll(_c: unknown): boolean {
        throw new UnsupportedOperationException();
    }

    public override clear(): void {
        this.#sharedBackend.backend = new WeakMap();
        this.#sharedBackend.refSet.clear();
    }

    public override contains(o: K): boolean {
        return this.#sharedBackend.backend.has(o);
    }

    public override containsAll(c: Collection<K>): boolean {
        for (const entry of c) {
            if (!this.#sharedBackend.backend.has(entry)) {
                return false;
            }
        }

        return true;
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof WeakMapKeyView)) {
            return false;
        }

        if (this.#sharedBackend.refSet.size !== o.#sharedBackend.refSet.size) {
            return false;
        }

        return this.containsAll(o);

    }

    public override hashCode(): number {
        throw new NotImplementedError();
    }

    public override isEmpty(): boolean {
        return this.#sharedBackend.refSet.size === 0;
    }

    public override iterator(): JavaIterator<K> {
        return new IteratorWrapper(this[Symbol.iterator]());
    }

    public override remove(o: K): boolean {
        const entry = this.#sharedBackend.backend.get(o);
        if (!entry) {
            return false;
        }

        this.#sharedBackend.backend.delete(o);
        this.#sharedBackend.refSet.delete(entry.ref);
        this.#sharedBackend.finalizationGroup.unregister(entry.ref);

        return true;
    }

    public override removeAll(c: Collection<K>): boolean {
        let changed = false;
        for (const entry of c) {
            changed = this.remove(entry) || changed;
        }

        return changed;
    }

    public override retainAll(c: Collection<K>): boolean {
        const candidates: K[] = [];
        for (const e of this) {
            if (!c.contains(e)) {
                candidates.push(e);
            }
        }

        for (const k of candidates) {
            this.remove(k);
        }

        return candidates.length > 0;
    }

    public override size(): number {
        return this.#sharedBackend.refSet.size;
    }

    public override toArray(): K[];
    public override toArray<U extends K>(a: U[]): U[];
    public override toArray<U extends K>(a?: U[]): K[] | U[] {
        // Cannot create a list of the keys, as that would make them strongly referenced.
        throw new NotImplementedError();
    }
}
