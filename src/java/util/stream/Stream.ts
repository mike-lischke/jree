/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { long } from "../../../types";

import { JavaFunction } from "../function/Function";
import { BiConsumer } from "../function/BiConsumer";
import { Predicate } from "../function/Predicate";
import { Supplier } from "../function/Supplier";
import { BaseStream } from "./BaseStream";
import { IntStream } from "./IntStream";
import { LongStream } from "./LongStream";
import { Consumer } from "../function/Consumer";
import { Comparator } from "../Comparator";
import { Optional } from "../Optional";

export interface Stream<T> extends BaseStream<T, Stream<T>> {
    /** Returns whether all elements of this stream match the provided predicate. */
    allMatch(predicate: Predicate<T>): boolean;

    /** Returns whether any elements of this stream match the provided predicate. */
    anyMatch(predicate: Predicate<T>): boolean;

    /** Performs a mutable reduction operation on the elements of this stream. */
    collect<R>(supplier: Supplier<R>, accumulator: BiConsumer<R, T>, combiner: BiConsumer<R, R>): R;

    /** Performs a mutable reduction operation on the elements of this stream using a Collector. */
    // collect<R, A>(collector: Collector<T, A, R>): R;

    /**
     * Creates a lazily concatenated stream whose elements are all the elements of the first stream followed by all
     * the elements of the second stream.
     */
    concat(other: Stream<T>): Stream<T>;

    /** Returns the count of elements in this stream. */
    count(): long;

    /** Returns a stream consisting of the distinct elements (according to Object.equals(Object)) of this stream. */
    distinct(): Stream<T>;

    /**
     * Returns, if this stream is ordered, a stream consisting of the remaining elements of this stream after dropping
     * the longest prefix of elements that match the given predicate.
     */
    dropWhile(predicate: Predicate<T>): Stream<T>;

    /** Returns an empty sequential Stream. */
    empty(): Stream<T>;

    /** Returns a stream consisting of the elements of this stream that match the given predicate. */
    filter(predicate: Predicate<T>): Stream<T>;

    /** Returns an Optional describing some element of the stream, or an empty Optional if the stream is empty. */
    findAny(): T;

    /** Returns an Optional describing the first element of this stream, or an empty Optional if the stream is empty. */
    findFirst(): T;

    /**
     * Returns a stream consisting of the results of replacing each element of this stream with the contents of a
     * mapped stream produced by applying the provided mapping function to each element.
     */
    flatMap<R>(mapper: JavaFunction<T, Stream<R>>): Stream<R>;

    /**
     * Returns an DoubleStream consisting of the results of replacing each element of this stream with the contents of
     * a mapped stream produced by applying the provided mapping function to each element.
     */
    // flatMapToDouble(mapper: JavaFunction<T, DoubleStream>): DoubleStream;

    /**
     * Returns an IntStream consisting of the results of replacing each element of this stream with the contents of a
     * mapped stream produced by applying the provided mapping function to each element.
     */
    flatMapToInt(mapper: JavaFunction<T, IntStream>): IntStream;

    /**
     * Returns an LongStream consisting of the results of replacing each element of this stream with the contents of a
     * mapped stream produced by applying the provided mapping function to each element.
     */
    flatMapToLong(mapper: JavaFunction<T, LongStream>): LongStream;

    /** Performs an action for each element of this stream. */
    forEach(action: Consumer<T>): void;

    /**
     * Performs an action for each element of this stream, in the encounter order of the stream if the stream has a
     * defined encounter order.
     */
    forEachOrdered(action: Consumer<T>): void;

    /** Returns a stream consisting of the elements of this stream, truncated to be no longer than maxSize in length. */
    limit(maxSize: long): Stream<T>;

    /** Returns a stream consisting of the results of applying the given function to the elements of this stream. */
    map<R>(mapper: JavaFunction<T, R>): Stream<R>;

    /**
     * Returns a DoubleStream consisting of the results of applying the given function to the elements of this stream.
     */
    // mapToDouble(mapper: toDoubleFunction<T>): DoubleStream;

    /**
     * Returns an IntStream consisting of the results of applying the given function to the elements of this stream.
     */
    // mapToInt(mapper: toIntFunction<T>): IntStream;

    /**
     * Returns an LongStream consisting of the results of applying the given function to the elements of this stream.
     */
    // mapToLong(mapper: toLongFunction<T>): LongStream;

    /** Returns the maximum element of this stream according to the provided Comparator. */
    max(comparator: Comparator<T>): Optional<T>;

    /** Returns the minimum element of this stream according to the provided Comparator. */
    min(comparator: Comparator<T>): Optional<T>;

    /** Returns whether no elements of this stream match the provided predicate. */
    noneMatch(predicate: Predicate<T>): boolean;

    /**
     * Returns a stream consisting of the elements of this stream, additionally performing the provided action on each
     * element as elements are consumed from the resulting stream.
     */
    peek(action: Consumer<T>): Stream<T>;

    /**
     * Performs a reduction on the elements of this stream, using an associative accumulation function, and returns an
     * Optional describing the reduced value, if any.
     *
     * @param accumulator an associative, non-interfering, stateless function for combining two values
     *
     * @returns the result of the reduction
     */
    // reduce(accumulator: BinaryOperator<T>): Optional<T>;

    /**
     * Performs a reduction on the elements of this stream, using the provided identity value and an associative
     * accumulation function, and returns the reduced value.
     *
     * @param identity the identity value for the accumulating function
     * @param accumulator an associative, non-interfering, stateless function for combining two values
     *
     * @returns the result of the reduction
     */
    // reduce(identity: T, accumulator: BinaryOperator<T>): T;

    /**
     * Performs a reduction on the elements of this stream, using the provided identity, accumulation and combining
     * functions.
     *
     * @param identity the identity value for the accumulating function
     * @param accumulator an associative, non-interfering, stateless function for combining two values
     * @param combiner an associative, non-interfering, stateless function for combining two values, which must be
     *                 compatible with the accumulator function
     *
     * @returns the result of the reduction
     */
    // reduce<U>(identity: U, accumulator: BiFunction<U, ? super T, U>, combiner: BinaryOperator<U>): U;

    /**
     * Returns a stream consisting of the remaining elements of this stream after discarding the first n elements
     * of the stream.
     *
     * @param n the number of leading elements to skip
     *
     * @returns the new stream
     */
    skip(n: long): Stream<T>;

    /**
     * Returns a stream consisting of the elements of this stream, sorted according to natural order.
     *
     * @returns the new stream
     */
    sorted(): Stream<T>;

    /**
     * Returns a stream consisting of the elements of this stream, sorted according to the provided Comparator.
     *
     * @param comparator a non-interfering, stateless Comparator to be used to compare stream elements
     *
     * @returns the new stream
     */
    sorted(comparator: Comparator<T>): Stream<T>;

    /**
     * Returns, if this stream is ordered, a stream consisting of the longest prefix of elements taken from this stream
     * that match the given predicate.
     *
     * @param predicate a non-interfering, stateless predicate to apply to elements to determine if they match
     *
     * @returns the new stream
     */
    takeWhile(predicate: Predicate<T>): Stream<T>;

    /**
     * @returns an array containing the elements of this stream
     */
    toArray(): T[];

    /**
     * @returns an array containing the elements of this stream, using the provided generator function to allocate the
     *         returned array, as well as any additional arrays that might be required for a partitioned execution or
     *        for resizing.
     *
     * @param generator a function which produces a new array of the desired type and the provided length
     */
    // toArray(generator: IntFunction<T[]>): T[];
}

export class Stream<T> {
    /** A mutable builder for a Stream. */
    // export const builder = () => Stream.Builder<T>;

    /**
     * Returns an infinite sequential unordered stream where each element is generated by the provided Supplier.
     *
     * @param s the Supplier of generated elements
     *
     * @returns a new infinite sequential unordered Stream
     */
    // public static generate<T>(s: Supplier<T>): Stream<T>;

    /**
     * Returns a sequential ordered Stream produced by iterative application of the given next function to an initial
     * element, conditioned on satisfying the given hasNext predicate.
     *
     * @param seed the initial element
     * @param hasNext a predicate to apply to the previous element to determine if the stream should continue
     * @param next a function to apply to the previous element to produce the next element
     *
     * @returns a new sequential Stream
     */
    // public static iterate<T>(seed: T, hasNext: Predicate<T>, next: JavaFunction<T, T>): Stream<T>;

    /**
     * Returns an infinite sequential ordered Stream produced by iterative application of a function f to an initial
     * element seed, producing a Stream consisting of seed, f(seed), f(f(seed)), etc.
     *
     * @param seed the initial element
     * @param f a function to be applied to the previous element to produce a new element
     *
     * @returns a new sequential Stream
     */
    // public static iterate<T>(seed: T, f: UnaryOperator<T>): Stream<T>;

    /**
     * @returns a sequential Stream containing a single element.
     *
     * @param t the single element
     */
    // public static of<T>(t: T): Stream<T>;

    /**
     * @returns a sequential ordered stream whose elements are the specified values.
     *
     * @param values the elements of the new stream
     */
    // public static of<T>(...values: T[]): Stream<T>;

    /**
     * @returns a sequential Stream containing a single element, if non-null, otherwise returns an empty Stream.
     *
     * @param t the single element
     */
    // public static ofNullable<T>(t: T): Stream<T>;

    /**
     * Returns, if this stream is ordered, a stream consisting of the longest prefix of elements taken from this stream
     * that match the given predicate.
     *
     * @param predicate a non-interfering, stateless predicate to apply to elements to determine if they match
     *
     * @returns the new stream
     */
    public takeWhile(predicate: Predicate<T>): Stream<T> | null {
        return null;
    }
}

export namespace Stream {
    /**
     * A mutable builder for a Stream. This allows the creation of a Stream by generating elements individually and
     * adding them to the Builder (without the copying overhead that comes from using an ArrayList as a temporary
     * buffer.)
     */
    export interface Builder<T> {
        /** Adds an element to the stream being built. */
        accept(t: T): void;

        /** Adds an element to the stream being built. */
        add(t: T): void;

        /** Builds the stream, transitioning this builder to the built state. */
        build(): Stream<T>;
    }
}
