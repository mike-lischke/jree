/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";

/**
 * Implementing this interface allows an object to be the target of the "for-each loop" statement.
 *
 * With this interface you get both the Java iterator and the Typescript iterator.
 */
export interface Iterable<T> {
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Returns an iterator over elements of type T.
     *
     * @returns an Iterator.
     */
    iterator(): java.util.Iterator<T>;
}

export class Iterable<T> {
    /**
     * Performs the given action for each element of the Iterable until all elements have been processed or the action
     * throws an exception.
     *
     * @param action The action to be performed for each element.
     */
    public forEach(action: java.util.function.Consumer<T>): void {
        for (const item of this) {
            action.accept(item);
        }
    }

    /**
     * Returns a Spliterator over the elements described by this Iterable.
     * There's no default implementation like in Java, so you have to implement always it yourself.
     */
    public spliterator(): java.util.Spliterator<T> {
        throw new NotImplementedError();
    }
}
