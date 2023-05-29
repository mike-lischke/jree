/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaIterator } from "./java/util/Iterator";

/**
 * This is the opposite of the IteratorWrapper class. It wraps a Java iterator (with proper modification checking)
 * and returns it as TypeScript iterator for consumption in for loops etc.
 */
export class ReverseIteratorWrapper<T> implements IterableIterator<T> {
    public constructor(private iterator: JavaIterator<T>) {
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this;
    }

    public next(): IteratorResult<T> {
        if (!this.iterator.hasNext()) {
            return { done: true, value: undefined };
        }

        return { done: false, value: this.iterator.next() };
    }
}
