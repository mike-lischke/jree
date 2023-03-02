/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "./java/lang/Object";
import { UnsupportedOperationException } from "./java/lang/UnsupportedOperationException";
import { JavaIterator } from "./java/util/Iterator";

/** A JRE iterator which wraps a Typescript iterator. */
export class IteratorWrapper<T> extends JavaObject implements JavaIterator<T> {

    private nextValue: IteratorResult<T, T>;

    public constructor(private iterator: IterableIterator<T>) {
        super();
        this.nextValue = iterator.next();
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        // Note: we already have read the first entry from the iterator to have something for `hasNext()`.
        //       This must be returned first, before returning the rest of the given iterator.
        if (this.nextValue.done) {
            return;
        }

        yield this.nextValue.value;
        yield* this.iterator;
    }

    public hasNext(): boolean {
        return !this.nextValue.done;
    }

    public next(): T {
        const result = this.nextValue;
        this.nextValue = this.iterator.next();

        return result.value;
    }

    public remove(): void {
        throw new UnsupportedOperationException();
    }

}
