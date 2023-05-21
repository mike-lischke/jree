/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { Consumer } from "../util/function/Consumer";
import { JavaIterator } from "../util/Iterator";
import { Spliterator } from "../util/Spliterator";
import { NullPointerException } from "./NullPointerException";
import { IReflection, JavaObject } from "./Object";
import { JavaString } from "./String";

/**
 * Implementing this interface allows an object to be the target of the "for-each loop" statement.
 *
 * With this interface you get both the Java iterator and the Typescript iterator.
 */
export interface JavaIterable<T> extends IReflection {
    [Symbol.iterator](): IterableIterator<T>;

    /**
     * Returns an iterator over elements of type T.
     *
     * @returns an Iterator.
     */
    iterator(): JavaIterator<T>;
}

export class JavaIterable<T> extends JavaObject {
    public static isIterable<T>(object: unknown): object is JavaIterable<T> {
        return (object != null) && (typeof object === "object") && ("iterator" in object);
    }

    /**
     * Performs the given action for each element of the Iterable until all elements have been processed or the action
     * throws an exception.
     *
     * @param action The action to be performed for each element.
     */
    public forEach(action: Consumer<T> | null): void {
        if (!action) {
            throw new NullPointerException();
        }

        for (const item of this) {
            action(item);
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
