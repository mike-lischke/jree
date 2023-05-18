/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Represents an operation that accepts two input arguments and returns no result. This is the two-arity specialization
 * of Consumer. Unlike most other functional interfaces, BiConsumer is expected to operate via side-effects.
 */
export interface BiConsumer<T, U> {
    /* accept */(t: T, u: U): void;
    andThen?: (after: BiConsumer<T, U>) => BiConsumer<T, U>;
}

export class BiConsumer<T, U> {
    /**
     * @returns a composed BiConsumer that performs, in sequence, this operation followed by the after operation.
     *
     * @param after the operation to perform after this operation
     */
    public andThen?= (after: BiConsumer<T, U>): BiConsumer<T, U> => {
        return (t: T, u: U) => { this(t, u); after(t, u); };
    };
}
