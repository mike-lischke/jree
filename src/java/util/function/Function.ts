/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface JavaFunction<T, R> {
    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     *
     * @returns the function result
     */
    /* apply*/(t: T): R;

    andThen?: <V>(after: JavaFunction<R, V>) => JavaFunction<T, V>;
    compose?: <V>(before: JavaFunction<V, T>) => JavaFunction<V, R>;
}

export class JavaFunction<T, R> {
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
    public andThen?= <V>(after: JavaFunction<R, V>): JavaFunction<T, V> => {
        return (t: T): V => {
            return after(this(t));
        };
    };

    /**
     * Returns a composed {@code Function} that first applies the {@code before} function to its input, and then applies
     * this function to the result.
     *
     * @param before the function to apply before this function is applied
     *
     * @returns a composed {@code Function} that first applies the {@code before} function and then applies this
     *          function
     */
    public compose?= <V>(before: JavaFunction<V, T>): JavaFunction<V, R> => {
        return (v: V): R => {
            return this(before(v));
        };
    };
}
