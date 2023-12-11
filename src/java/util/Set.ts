/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError.js";
import { Collection } from "./Collection.js";
import { Collections } from "./Collections.js";
import { HashSet } from "./HashSet.js";
import { JavaIterator } from "./Iterator.js";
import { Spliterator } from "./Spliterator.js";

/**
 * A collection that contains no duplicate elements. More formally, sets contain no pair of elements e1 and e2 such
 * that e1.equals(e2), and at most one null element. As implied by its name, this interface models the mathematical
 * set abstraction.
 */
export interface JavaSet<T> extends Collection<T> {
    /** Adds the specified element to this set if it is not already present (optional operation). */
    add(e: T): boolean;

    /**
     * Adds all of the elements in the specified collection to this set if they're not already present
     * (optional operation).
     */
    addAll(c: Collection<T>): boolean;

    /** Removes all of the elements from this set (optional operation). */
    clear(): void;

    /** Returns true if this set contains the specified element. */
    contains(o: T): boolean;

    /** Returns true if this set contains all of the elements of the specified collection. */
    containsAll(c: Collection<T>): boolean;

    /** Compares the specified object with this set for equality. */
    equals(o: unknown): boolean;

    /** Returns the hash code value for this set. */
    hashCode(): number;

    /** Returns true if this set contains no elements. */
    isEmpty(): boolean;

    /** Returns an iterator over the elements in this set. */
    iterator(): JavaIterator<T>;

    /** Removes the specified element from this set if it is present (optional operation). */
    remove(o: T): boolean;

    /**
     * Removes from this set all of its elements that are contained in the specified collection (optional operation).
     */
    removeAll(c: Collection<T>): boolean;

    /**
     * Retains only the elements in this set that are contained in the specified collection (optional operation).
     * In other words, removes from this set all of its elements that are not contained in the specified collection.
     */
    retainAll(c: Collection<T>): boolean;

    /** Returns the number of elements in this set (its cardinality). */
    size(): number;

    /** Returns an array containing all of the elements in this collection. */
    toArray(): T[];

    /** Returns an array containing all of the elements in this collection. */
    toArray<T>(a: T[]): T[];
}

export class JavaSet<T> extends Collection<T> {
    public static copyOf<T>(c: Collection<T>): JavaSet<T> {
        const result = new HashSet<T>();
        for (const element of c) {
            result.add(element);
        }

        return Collections.unmodifiableSet(result);
    }

    /** Returns an unmodifiable set containing no elements. */
    public static of<T>(): JavaSet<T>;
    /** Returns an unmodifiable set containing one element. */
    public static of<T>(e1: T): JavaSet<T>;
    /** Returns an unmodifiable set containing two elements. */
    public static of<T>(e1: T, e2: T): JavaSet<T>;
    /** Returns an unmodifiable set containing three elements. */
    public static of<T>(e1: T, e2: T, e3: T): JavaSet<T>;
    /** Returns an unmodifiable set containing four elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T): JavaSet<T>;
    /** Returns an unmodifiable set containing five elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T): JavaSet<T>;
    /** Returns an unmodifiable set containing six elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T, e6: T): JavaSet<T>;
    /** Returns an unmodifiable set containing seven elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T, e6: T, e7: T): JavaSet<T>;
    /** Returns an unmodifiable set containing eight elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T, e6: T, e7: T, e8: T): JavaSet<T>;
    /** Returns an unmodifiable set containing nine elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T, e6: T, e7: T, e8: T, e9: T): JavaSet<T>;
    /** Returns an unmodifiable set containing ten elements. */
    public static of<T>(e1: T, e2: T, e3: T, e4: T, e5: T, e6: T, e7: T, e8: T, e9: T,
        e10: T): JavaSet<T>;
    /** Returns an unmodifiable set containing the given elements. */
    public static of<T>(...elements: T[]): JavaSet<T>;
    public static of<T>(...elements: T[]): JavaSet<T> {
        const result = new HashSet<T>();
        for (const element of elements) {
            result.add(element);
        }

        return Collections.unmodifiableSet(result);
    }

    /** Creates a Spliterator over the elements in this set. */
    public override spliterator(): Spliterator<T> {
        throw new NotImplementedError();
    }
}
