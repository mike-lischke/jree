/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface Function<T, R> {
    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     *
     * @returns the function result
     */
    apply: (t: T) => R;
}

export class Function<T, R> {
    /**
     * Returns a {@code Function} that wraps the given operation
     *
     * @param apply the operation to perform when the Function's apply method is called.
     *
     * @returns a {@code Function} that performs the given operation on the given argument
     */
    public static create<T, R>(apply: (t: T) => R): Function<T, R> {
        return new class extends Function<T, R> {
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
    public andThen<V>(after: Function<R, V>): Function<T, V> {
        return Function.create<T, V>((t: T) => {
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
    public compose<V>(before: Function<V, T>): Function<V, R> {
        return Function.create<V, R>((v: V) => {
            return this.apply(before.apply(v));
        });
    }
}
