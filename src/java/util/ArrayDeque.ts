/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { JavaObject } from "../lang/Object";

export class ArrayDeque<T> extends JavaObject implements java.util.Deque<T>, java.io.Serializable,
    java.lang.Cloneable<ArrayDeque<T>> {

    /** Constructs an empty array deque with an initial capacity sufficient to hold 16 elements. */
    public constructor();
    /** Constructs an empty array deque with an initial capacity sufficient to hold the specified number of elements. */
    public constructor(numElements: number);
    /**
     * Constructs an array deque containing the elements of the specified collection, in the order they are returned
     * by the collection's iterator.
     */
    public constructor(c: java.util.Collection<T>);
    public constructor(numElementsOrC?: number | java.util.Collection<T>) {
        super();
    }

    public addFirst(e: T): void {

    }
}
