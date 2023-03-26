/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../lang/Object";

/**
 * Represents an operation that accepts two input arguments and returns no result. This is the two-arity specialization
 * of Consumer. Unlike most other functional interfaces, BiConsumer is expected to operate via side-effects.
 */
export interface BiConsumer<T, U> extends IReflection {
    accept(t: T, u: U): void;
}

export class BiConsumer<T, U> {
    /**
     * Returns a {@code Consumer} that wraps the given operation
     *
     * @param accept the operation to perform when the Consumer's accept method is called.
     *
     * @returns a {@code Consumer} that performs the given operation on the given argument
     */
    public static create<T, U>(accept: (t: T, u: U) => void): BiConsumer<T, U> {
        return new class extends BiConsumer<T, U> {
            public override accept = (t: T, u: U) => { accept(t, u); };
        }();
    }

    /**
     * @returns a composed BiConsumer that performs, in sequence, this operation followed by the after operation.
     *
     * @param after the operation to perform after this operation
     */
    public andThen(after: BiConsumer<T, U>): BiConsumer<T, U> {
        return BiConsumer.create<T, U>((t: T, u: U) => {
            this.accept(t, u);
            after.accept(t, u);
        });
    }
}
