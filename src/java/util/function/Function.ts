/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../lang/Object";

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface JavaFunction<T, R> extends IReflection {
    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     *
     * @returns the function result
     */
    apply: (t: T) => R;
}

export class JavaFunction<T, R> {
    /**
     * Returns a {@code Function} that wraps the given operation
     *
     * @param apply the operation to perform when the Function's apply method is called.
     *
     * @returns a {@code Function} that performs the given operation on the given argument
     */
    public static create<T, R>(apply: (t: T) => R): JavaFunction<T, R> {
        return new class extends JavaFunction<T, R> {
            public override apply = (t: T): R => { return apply(t); };
        }();
    }

    /**
     * Returns a composed {@code Consumer} that performs, in sequence, this operation followed by the {@code after}
     * operation.
     *
     * @param after the operation to perform after this operation
     *
     * @returns a composed {@code Consumer} that performs in sequence this operation followed by the {@code after}
     *         operation
     *
     * Implementation note: this implements the default method of the {@link Consumer} interface.
     */
    public andThen<V>(after: JavaFunction<R, V>): JavaFunction<T, V> {
        return JavaFunction.create<T, V>((t: T) => {
            return after.apply(this.apply(t));
        });
    }

    /**
     * Returns a composed {@code Function} that first applies the {@code before} function to its input, and then applies
     * this function to the result.
     *
     * @param before the function to apply before this function is applied
     *
     * @returns a composed {@code Function} that first applies the {@code before} function and then applies this
     *          function
     */
    public compose<V>(before: JavaFunction<V, T>): JavaFunction<V, R> {
        return JavaFunction.create<V, R>((v: V) => {
            return this.apply(before.apply(v));
        });
    }
}
