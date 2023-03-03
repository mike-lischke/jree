/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { Consumer } from "../util/function/Consumer";
import { JavaIterator } from "../util/Iterator";
import { Spliterator } from "../util/Spliterator";
import { JavaObject } from "./Object";
import { JavaString } from "./String";

/**
 * Implementing this interface allows an object to be the target of the "for-each loop" statement.
 *
 * With this interface you get both the Java iterator and the Typescript iterator.
 */
export interface JavaIterable<T> {
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Returns an iterator over elements of type T.
     *
     * @returns an Iterator.
     */
    iterator(): JavaIterator<T>;
}

export class JavaIterable<T> extends JavaObject {
    /**
     * Performs the given action for each element of the Iterable until all elements have been processed or the action
     * throws an exception.
     *
     * @param action The action to be performed for each element.
     */
    public forEach(action: Consumer<T>): void {
        for (const item of this) {
            action.accept(item);
        }
    }

    /**
     * Returns a Spliterator over the elements described by this Iterable.
     * There's no default implementation like in Java, so you have to implement always it yourself.
     */
    public spliterator(): Spliterator<T> {
        throw new NotImplementedError();
    }

    public override toString(): JavaString {
        return new JavaString(super.toString());
    }
}
