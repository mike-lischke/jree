/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { JavaIterable } from "../lang/Iterable";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Predicate } from "./function/Predicate";
import { JavaIterator } from "./Iterator";
import { Spliterator } from "./Spliterator";
import { Stream } from "./stream";

export interface Collection<T> extends JavaIterable<T> {
    /**
     * Ensures that this collection contains the specified element.
     */
    add(e: T): boolean;

    /**
     * Adds all of the elements in the specified collection to this collection.
     */
    addAll(c: Collection<T>): boolean;

    /**
     * Removes all of the elements from this collection.
     */
    clear(): void;

    /**
     * Returns true if this collection contains the specified element.
     */
    contains(o: T): boolean;

    /**
     * Returns true if this collection contains all of the elements in the specified collection.
     */
    containsAll(c: Collection<T>): boolean;

    /**
     * Compares the specified object with this collection for equality.
     */
    equals(other: unknown): boolean;

    /**
     * Returns the hash code value for this collection.
     */
    hashCode(): number;

    /**
     * Returns true if this collection contains no elements.
     */
    isEmpty(): boolean;

    /** Returns an iterator over the elements in this collection. */
    iterator(): JavaIterator<T>;

    /** Returns a sequential Stream with this collection as its source. */
    parallelStream(): Stream<T>;

    /**
     * Removes a single instance of the specified element from this collection, if it is present.
     */
    remove(o: unknown): boolean;

    /**
     * Removes all of this collection's elements that are also contained in the specified collection.
     */
    removeAll(c: Collection<T>): boolean;

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     */
    retainAll(c: Collection<T>): boolean;

    /**
     * Returns the number of elements in this collection.
     */
    size(): number;

    /** Returns a sequential Stream with this collection as its source. */
    stream(): Stream<T>;

    /**
     * Returns a string representation of this collection.
     * The string representation consists of a list of the collection's elements in the order they are returned by
     * its iterator, enclosed in square brackets ("[]"). Adjacent elements are separated by the characters ", " (comma
     * and space). Elements are converted to strings as by String.valueOf(Object).
     * Returns "[]" if this collection contains no elements.
     *
     * @returns a string representation of this collection
     */
    toString(): JavaString;

    /**
     * Returns an array containing all of the elements in this collection.
     */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this collection; the runtime type of the returned array
     * is that of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];
}

export class Collection<T> extends JavaObject {
    /**
     * Removes all of the elements of this collection that satisfy the given predicate.
     *
     * @param filter a predicate which returns true for elements to be removed
     *
     * @returns true if any elements were removed
     */
    public removeIf(filter: Predicate<T>): boolean {
        let removed = false;
        const it = this.iterator();
        while (it.hasNext()) {
            if (filter.test(it.next())) {
                it.remove();
                removed = true;
            }
        }

        return removed;
    }

    /**
     * Creates a {@link Spliterator} over the elements in this collection.
     */
    public spliterator(): Spliterator<T> {
        throw new NotImplementedError();
    }

    /**
     * Returns an array containing all of the elements in this collection, using the provided generator function to
     * allocate the returned array.
     *
     * @param generator a function which produces a new array of the desired type and the provided length
     */
    /* Enabling this causes a compiler error in the interface declaration.
        public toArray<T>(generator: IntFunction<T[]>): T[] {
        throw new NotImplementedError();
    }*/

    public override toString(): JavaString {
        return new JavaString(super.toString());
    }
}
