/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "./java/lang/Object";
import { UnsupportedOperationException } from "./java/lang/UnsupportedOperationException";
import { JavaIterator } from "./java/util/Iterator";
import { Consumer } from "./java/util/function";

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

    public forEachRemaining(action: Consumer<T>): void {
        while (this.hasNext()) {
            action(this.next());
        }
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
