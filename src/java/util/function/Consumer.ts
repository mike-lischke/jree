/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Represents an operation that accepts a single input argument and returns no result. Unlike most other functional
 * interfaces, {@code Consumer} is expected to operate via side-effects.
 */
export interface Consumer<T> {
    /**
     * Performs this operation on the given argument.
     *
     * @param t the input argument
     */
    /* accept */(t: T): void;

    /** @returns a composed Consumer that performs, in sequence, this operation followed by the after operation. */
    andThen?: (after: Consumer<T>) => Consumer<T>;
}

export class Consumer<T> implements Consumer<T> {
    public andThen?= (after: Consumer<T>): Consumer<T> => {
        const result = (t: T) => { this(t); after(t); };
        result.andThen = (after: Consumer<T>): Consumer<T> => { return this.andThen!(after); };

        return result;
    };
}
