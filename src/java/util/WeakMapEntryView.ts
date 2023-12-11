/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Collection } from "./Collection.js";
import { JavaMap } from "./Map.js";
import { JavaSet } from "./Set.js";
import { UnsupportedOperationException } from "../lang/UnsupportedOperationException.js";
import { JavaIterator } from "./Iterator.js";
import { IWeakHashMapViewBackend } from "./WeakHashMap.js";
import { NotImplementedError } from "../../NotImplementedError.js";

/** This support class provides a view on a weak map's entries. It allows to modify the map for which it was created. */
export class WeakMapEntryView<K extends object, V> extends Collection<JavaMap.Entry<K, V>>
    implements JavaSet<JavaMap.Entry<K, V>> {

    #sharedBackend: IWeakHashMapViewBackend<K, V>;

    public constructor(sharedBackend: IWeakHashMapViewBackend<K, V>) {
        super();

        this.#sharedBackend = sharedBackend;
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

    public override contains(o: JavaMap.Entry<K, V>): boolean {
        return this.#sharedBackend.backend.has(o.getKey());
    }

    public override containsAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        for (const entry of c) {
            if (!this.#sharedBackend.backend.has(entry.getKey())) {
                return false;
            }
        }

        return true;
    }

    public override equals(o: unknown): boolean {
        if (o === this) {
            return true;
        }

        if (!(o instanceof WeakMapEntryView)) {
            return false;
        }

        throw new NotImplementedError();
    }

    public override hashCode(): number {
        throw new NotImplementedError();
    }

    public override isEmpty(): boolean {
        return this.#sharedBackend.refSet.size === 0;
    }

    public override iterator(): JavaIterator<JavaMap.Entry<K, V>> {
        throw new NotImplementedError();
    }

    public override remove(o: JavaMap.Entry<K, V>): boolean {
        throw new NotImplementedError();
    }

    public override removeAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        throw new NotImplementedError();
    }

    public override retainAll(c: Collection<JavaMap.Entry<K, V>>): boolean {
        throw new NotImplementedError();
    }

    public override size(): number {
        return this.#sharedBackend.refSet.size;
    }

    public override toArray(): Array<JavaMap.Entry<K, V>>;
    public override toArray<U extends JavaMap.Entry<K, V>>(a: U[]): U[];
    public override toArray<U extends JavaMap.Entry<K, V>>(a?: U[]): Array<JavaMap.Entry<K, V>> | U[] {
        throw new NotImplementedError();
    }
}
