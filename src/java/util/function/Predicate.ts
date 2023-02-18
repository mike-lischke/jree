/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/**
 * Represents a predicate (boolean-valued function) of one argument.
 * This is a functional interface whose functional method is {@link #test(Object)}.
 */
export interface Predicate<T> {
    test(t: T): boolean;
}

export class Predicate<T> {
    /**
     * Returns a predicate that tests if two arguments are equal according to {@link Objects#equals(Object, Object)}.
     *
     * @param targetRef the object reference with which to compare for equality, which may be {@code null}
     *
     * @returns a predicate that tests if two arguments are equal according to {@link Objects#equals(Object, Object)}
     */
    public static isEqual<T>(targetRef: T): Predicate<T> {
        return Predicate.create<T>((t: T) => {
            return java.util.Objects.equals(t, targetRef);
        });
    }

    /**
     * Returns a predicate that tests if the argument is {@code null}.
     *
     * @param target the predicate to negate
     *
     * @returns a predicate that tests if the argument is {@code null}
     */
    public static not<T>(target: Predicate<T>): Predicate<T> {
        return Predicate.create<T>((t: T) => {
            return !target.test(t);
        });
    }

    /**
     * Returns a {@code Predicate} that wraps the given operation.
     *
     * @param test the operation to perform when the Predicate's test method is called.
     *
     * @returns a {@code Predicate} that performs the given operation on the given argument
     */
    public static create<T>(test: (t: T) => boolean): Predicate<T> {
        return new class extends Predicate<T> {
            public test = (t: T): boolean => { return test(t); };
        }();
    }

    /**
     * Returns a composed predicate that represents a short-circuiting logical AND of this predicate and another. When
     * evaluating the composed predicate, if this predicate is {@code false}, then the {@code other} predicate is not
     * evaluated.
     *
     * @param other a predicate that will be logically-ANDed with this predicate
     *
     * @returns a composed predicate that represents the short-circuiting logical AND of this predicate and the
     *        {@code other} predicate
     */
    public and(other: Predicate<T>): Predicate<T> {
        return Predicate.create<T>((t: T) => {
            return this.test(t) && other.test(t);
        });
    }

    /**
     * Returns a predicate that represents the logical negation of this predicate.
     *
     * @returns a predicate that represents the logical negation of this predicate
     */
    public negate(): Predicate<T> {
        return Predicate.create<T>((t: T) => {
            return !this.test(t);
        });
    }

    /**
     * Returns a composed predicate that represents a short-circuiting logical OR of this predicate and another. When
     * evaluating the composed predicate, if this predicate is {@code true}, then the {@code other} predicate is not
     * evaluated.
     *
     * @param other a predicate that will be logically-ORed with this predicate
     *
     * @returns a composed predicate that represents the short-circuiting logical OR of this predicate and the
     *       {@code other} predicate
     */
    public or(other: Predicate<T>): Predicate<T> {
        return Predicate.create<T>((t: T) => {
            return this.test(t) || other.test(t);
        });
    }
}
