/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../lang/Object";

/**
 * An object for traversing and partitioning elements of a source. The source of elements covered by a Spliterator
 * could be, for example, an array, a Collection, an IO channel, or a generator function.
 */
export interface Spliterator<T> extends IReflection {
    /**
     * Returns a set of characteristics of this Spliterator and its elements.
     */
    characteristics(): number;

    /**
     * If this Spliterator's source is {@link java.util.Spliterator#ORDERED}, returns the estimate of the number of
     * elements that would be encountered by a {@link java.util.Spliterator#forEachRemaining} traversal, or returns
     * {@link java.util.Spliterator#UNKNOWN_SIZE} if infinite, unknown, or too expensive to compute.
     */
    estimateSize(): number;

    /**
     * Performs the given action for each remaining element, sequentially in the current thread, until all elements have
     * been processed or the action throws an exception.
     *
     * @param action The action
     */
    forEachRemaining(action: (value: T) => void): void;

    /**
     * If this Spliterator's source is SORTED by a Comparator, returns that Comparator.
     *
     * @returns a Comparator, or null if the elements are not sorted, or are sorted by a Comparator that is not
     *          available or cannot be sensibly compared.
     *
     */
    getComparator(): (a: T, b: T) => number | null;

    /**
     * Convenience method that returns estimateSize() if this Spliterator is SIZED, else -1.
     *
     * @returns the estimated size, if known, else {@link java.util.Spliterator#UNKNOWN_SIZE}.
     */
    getExactSizeIfKnown(): number;

    /**
     * Returns true if this Spliterator's characteristics() contain all of the given characteristics.
     *
     * @param characteristics the characteristics to check for
     *
     * @returns true if all the given characteristics are present, else false
     */
    hasCharacteristics(characteristics: number): boolean;

    /**
     * If a remaining element exists, performs the given action on it, returning true; else returns false. If this
     * Spliterator is {@link java.util.Spliterator#ORDERED}, actions are performed in encounter order.
     *
     * @param action The action
     *
     * @returns true if the action was performed, else false
     */
    tryAdvance(action: (value: T) => void): boolean;

    /**
     * If this Spliterator can be partitioned, returns a Spliterator covering elements, that will, upon return from this
     * method, not be covered by this Spliterator.
     *
     * @returns a Spliterator, or null if this Spliterator cannot be partitioned.
     */
    trySplit(): Spliterator<T> | undefined;
}

export namespace Spliterator {
    export const ORDERED = 0x00000010;
    export const DISTINCT = 0x00000001;
    export const SORTED = 0x00000004;
    export const SIZED = 0x00000040;
    export const NONNULL = 0x00000100;
    export const IMMUTABLE = 0x00000400;
    export const CONCURRENT = 0x00001000;
    export const SUBSIZED = 0x00;

    export interface OfPrimitive<
        T,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        T_CONS extends (value: T) => void,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        T_SPLITR extends OfPrimitive<T, T_CONS, T_SPLITR>>
        extends Spliterator<T> {
        /**
         * Performs the given action for each remaining element, sequentially in the current thread, until all elements
         * have been processed or the action throws an exception.
         *
         * @param action The action
         * @param T_CONS The type of the action
         */
        forEachRemaining(action: T_CONS): void;

        /**
         * If a remaining element exists, performs the given action on it, returning true; else returns false. If this
         * Spliterator is {@link java.util.Spliterator#ORDERED}, actions are performed in encounter order.
         *
         * @param action The action
         *
         * @returns true if the action was performed, else false
         */
        tryAdvance(action: T_CONS): boolean;
    }

    export interface OfInt extends Spliterator.OfPrimitive<number, (value: number) => void, OfInt> {
        forEachRemaining(action: (value: number) => void): void;

        tryAdvance(action: (value: number) => void): boolean;
    }

    export interface OfLong extends Spliterator.OfPrimitive<bigint, (value: bigint) => void, OfLong> {
        forEachRemaining(action: (value: bigint) => void): void;

        tryAdvance(action: (value: bigint) => void): boolean;
    }

    export interface OfDouble extends Spliterator.OfPrimitive<number, (value: number) => void, OfInt> {
        forEachRemaining(action: (value: number) => void): void;

        tryAdvance(action: (value: number) => void): boolean;
    }

}
