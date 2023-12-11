/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Set } from "immutable";

import { IteratorWrapper } from "../../IteratorWrapper.js";
import { Collection } from "./Collection.js";
import { JavaIterator } from "./Iterator.js";
import { Cloneable } from "../lang/Cloneable.js";
import { Serializable } from "../io/Serializable.js";
import { JavaSet } from "./Set.js";
import { JavaString } from "../lang/String.js";
import { StringBuilder } from "../lang/StringBuilder.js";

/**
 * This interface provides shared access to the backend of a HashSet instance for all currently active value
 * and entry views. This way each of them sees updates of the backend and can update it as well.
 */
export interface IHashSetViewBackend<V> {
    backend: Set<V>;
}

export class HashSet<T> extends Collection<T> implements Cloneable<HashSet<T>>, Serializable, JavaSet<T> {

    #sharedBackend: IHashSetViewBackend<T> = {
        backend: Set<T>(),
    };

    public constructor(c?: Collection<T>);
    public constructor(initialCapacity: number, loadFactor?: number);
    public constructor(cOrInitialCapacity?: Collection<T> | number, _loadFactor?: number) {
        super();

        // The load factor is ignored in this implementation.
        if (cOrInitialCapacity && typeof cOrInitialCapacity !== "number") {
            this.addAll(cOrInitialCapacity);
        }
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#sharedBackend.backend[Symbol.iterator]();
    }

    public override hashCode(): number {
        return this.#sharedBackend.backend.hashCode();
    }

    public override equals(o: unknown): boolean {
        if (!(o instanceof HashSet)) {
            return false;
        }

        return this.#sharedBackend.backend.equals(o.#sharedBackend.backend);
    }

    /**
     * Adds the specified element to this set if it is not already present.
     *
     * @param t The value to add.
     *
     * @returns True if the value was actually added (i.e. wasn't member of this set yet), otherwise false.
     */
    public override add(t: T): boolean {
        const set = this.#sharedBackend.backend.add(t);
        if (set !== this.#sharedBackend.backend) {
            this.#sharedBackend.backend = set;

            return true;
        }

        return false;
    }

    /** @returns the number of elements in this set (its cardinality). */
    public override size(): number {
        return this.#sharedBackend.backend.count();
    }

    /** @returns true if this set contains no elements. */
    public override isEmpty(): boolean {
        return this.#sharedBackend.backend.isEmpty();
    }

    /** @returns an iterator over the elements in this set. */
    public override iterator(): JavaIterator<T> {
        return new IteratorWrapper(this.#sharedBackend.backend[Symbol.iterator]());
    }

    /**
     * @param o The value to check.
     *
     * @returns true if this set contains the specified element.
     */
    public override contains(o: T): boolean {
        return this.#sharedBackend.backend.has(o);
    }

    /** @returns an array containing all of the elements in this collection. */
    public override toArray(): T[];
    public override toArray<U extends T>(a: U[]): U[];
    public override toArray<U extends T>(a?: U[]): T[] | U[] {
        if (a === undefined) {
            return this.#sharedBackend.backend.toArray();
        } else {
            return this.#sharedBackend.backend.toArray() as U[];
        }
    }

    /**
     * Removes the specified element from this set if it is present.
     *
     * @param obj The value to remove.
     *
     * @returns True if the value was part of this set (i.e. the set has been changed by this call), otherwise false.
     */
    public override remove(obj: T): boolean {
        if (obj === undefined) {
            return false;
        }

        const s = this.#sharedBackend.backend.delete(obj);
        if (this.#sharedBackend.backend !== s) {
            this.#sharedBackend.backend = s;

            return true;
        }

        return false;
    }

    /**
     * @param collection The values to check.
     *
     * @returns true if this collection contains all of the elements in the specified collection.
     */
    public override containsAll(collection: Collection<T>): boolean {
        if (collection instanceof HashSet) {
            let allFound = true;
            collection.#sharedBackend.backend.forEach((value) => {
                if (!this.#sharedBackend.backend.contains(value as T)) {
                    allFound = false;

                    return false;
                }

                return true;
            });

            return allFound;
        } else {
            for (const o of collection) {
                if (!this.contains(o)) {
                    return false;
                }
            }
        }

        return true;
    }

    public override addAll(c: Collection<T>): boolean {
        const s = this.#sharedBackend.backend.withMutations((set) => {
            if (c instanceof HashSet) {
                c.#sharedBackend.backend.forEach((value) => {
                    set.add(value as T);
                });
            } else {
                for (const o of c) {
                    set.add(o);
                }
            }
        });

        if (s !== this.#sharedBackend.backend) {
            this.#sharedBackend.backend = s;

            return true;
        }

        return false;
    }

    /**
     * Retains only the elements in this collection that are contained in the specified collection (optional operation).
     *
     * @param c The collection with the elements to retain.
     *
     * @returns True if this set was changed by this method, otherwise false.
     */
    public override retainAll(c: Collection<T>): boolean {
        const s = this.#sharedBackend.backend.intersect(c);
        if (s !== this.#sharedBackend.backend) {
            this.#sharedBackend.backend = s;

            return true;
        }

        return false;
    }

    /**
     * Removes from this set all of its elements that are contained in the specified collection (optional operation).
     *
     * @param c The collection with the elements to remove.
     *
     * @returns True if this set was changed by this method, otherwise false.
     */
    public override removeAll(c: Collection<T>): boolean {
        const s = this.#sharedBackend.backend.withMutations((set) => {
            for (const o of c) {
                set.delete(o);
            }
        });

        if (this.#sharedBackend.backend !== s) {
            this.#sharedBackend.backend = s;

            return true;
        }

        return false;
    }

    /** Removes all of the elements from this set. */
    public override clear(): void {
        this.#sharedBackend.backend = this.#sharedBackend.backend.clear();
    }

    /** @returns a shallow copy of this HashSet instance: the elements themselves are not cloned. */
    public override clone(): HashSet<T> {
        const result = new HashSet<T>(this);

        return result;
    }

    public override toString(): JavaString {
        if (this.size() === 0) {
            return new JavaString("{}");
        }

        const buf = new StringBuilder();
        buf.append("{");
        let first = true;
        this.#sharedBackend.backend.forEach((value) => {
            if (first) {
                first = false;
            } else {
                buf.append(", ");
            }

            buf.append(JSON.stringify(value));
        });
        buf.append("}");

        return buf.toString();
    }
}
