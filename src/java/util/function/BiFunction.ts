/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaFunction } from "./Function.js";

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface BiFunction<T, U, R> /* extends JavaFunction<T, R> */ {
    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     *
     * @returns the function result
     */
    /* apply*/(t: T, u: U): R;

    andThen?: <V>(after: JavaFunction<R, V>) => BiFunction<T, U, V>;
}

export class BiFunction<T, U, R> implements BiFunction<T, U, R> {
    /**
     * Returns a composed function that first applies this function to its input, and then applies the after function
     * to the result.
     *
     * @param after the function to apply after this function is applied
     *
     * @returns a composed function that first applies this function and then applies the after function
     *
     * Implementation note: this implements the default method of the {@link BiFunction} interface.
     */
    public andThen? = <V>(after: JavaFunction<R, V>): BiFunction<T, U, V> => {
        return (t: T, u: U): V => {
            return after(this(t, u));
        };
    };
}
