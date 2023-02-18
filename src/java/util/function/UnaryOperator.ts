/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Function } from "./Function";

/**
 * Represents an operation on a single operand that produces a result of the same type as its operand. This is a
 * specialization of {@link Function} for the case where the operand and result are of the same type.
 */
export interface UnaryOperator<T> extends Function<T, T> {
    apply: (t: T) => T;
}

// @ts-expect-error, because of different type parameters in the factory method.
export class UnaryOperator<T> extends Function<T, T> {
    /**
     * Returns a {@code Unary} that wraps the given operation.
     *
     * @param apply the operation to perform when the Unary's apply method is called.
     *
     * @returns a {@code Unary} that performs the given operation on the given argument
     */
    public static create<T>(apply: (t: T) => T): UnaryOperator<T> {
        return new class extends UnaryOperator<T> {
            public apply = (t: T): T => { return apply(t); };
        }();
    }

    /**
     * @returns a {@code Unary} that always returns its input argument
     */
    public static identity<T>(): UnaryOperator<T> {
        return UnaryOperator.create<T>((t: T) => { return t; });
    }

}