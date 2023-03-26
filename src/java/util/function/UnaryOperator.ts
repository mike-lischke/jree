/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { JavaFunction } from "./Function";

/**
 * Represents an operation on a single operand that produces a result of the same type as its operand. This is a
 * specialization of {@link JavaFunction} for the case where the operand and result are of the same type.
 */
export interface UnaryOperator<T> extends JavaFunction<T, T> {
    apply: (t: T) => T;
}

export class UnaryOperator<T> extends JavaFunction<T, T> {
    /**
     * Returns a {@code Unary} that wraps the given operation.
     *
     * @param apply the operation to perform when the Unary's apply method is called.
     *
     * @returns a {@code Unary} that performs the given operation on the given argument
     */
    public static override create<T, R>(apply: (t: T) => R): JavaFunction<T, R>;
    public static override create<T>(apply: (t: T) => T): UnaryOperator<T> {
        return new class extends UnaryOperator<T> {
            public override apply = (t: T): T => { return apply(t); };
        }();
    }

    /**
     * @returns a {@code Unary} that always returns its input argument
     */
    public static identity<T>(): UnaryOperator<T> {
        return UnaryOperator.create<T, T>((t: T) => { return t; });
    }

}
