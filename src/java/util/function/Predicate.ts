/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Objects } from "../Objects.js";

/**
 * Represents a predicate (boolean-valued function) of one argument.
 * This is a functional interface whose functional method is {@link #test(Object)}.
 */
export interface Predicate<T> {
    /* test*/(t: T): boolean;
    and?: (other: Predicate<T>) => Predicate<T>;
    negate?: () => Predicate<T>;
    or?: (other: Predicate<T>) => Predicate<T>;
}

export class Predicate<T> {
    /**
     * Emulates the default methods of the Predicate interface, by adding the prototype methods to the given predicate
     * function (if not already there).
     *
     * @param predicate The predicate to extend.
     *
     * @returns The given predicate, with the prototype methods added.
     */
    public static of<T>(predicate: Predicate<T>): Required<Predicate<T>> {
        predicate.and = predicate.and ?? Predicate.prototype.and;
        predicate.negate = predicate.negate || Predicate.prototype.negate;
        predicate.or = predicate.or || Predicate.prototype.or;

        return predicate as Required<Predicate<T>>;

    }
    /**
     * Returns a predicate that tests if two arguments are equal according to {@link Objects#equals(Object, Object)}.
     *
     * @param targetRef the object reference with which to compare for equality, which may be {@code null}
     *
     * @returns a predicate that tests if two arguments are equal according to {@link Objects#equals(Object, Object)}
     */
    public static isEqual<T>(targetRef: T): Predicate<T> {
        return (t: T) => {
            return Objects.equals(t, targetRef);
        };
    }

    /**
     * Returns a predicate that tests if the argument is {@code null}.
     *
     * @param target the predicate to negate
     *
     * @returns a predicate that tests if the argument is {@code null}
     */
    public static not<T>(target: Predicate<T>): Predicate<T> {
        return (t: T) => {
            return !target(t);
        };
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
    public and? = (other: Predicate<T>): Predicate<T> => {
        return (t: T) => {
            return this(t) && other(t);
        };
    };

    /**
     * Returns a predicate that represents the logical negation of this predicate.
     *
     * @returns a predicate that represents the logical negation of this predicate
     */
    public negate? = (): Predicate<T> => {
        return (t: T) => {
            return !this(t);
        };
    };

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
    public or? = (other: Predicate<T>): Predicate<T> => {
        return (t: T) => {
            return this(t) || other(t);
        };
    };
}
