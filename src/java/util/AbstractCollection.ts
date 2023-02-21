/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { JavaObject } from "../lang/Object";

/**
 * This is the base class for all collections in this library. It implements the common methods of the
 * java.util.Collection interface. The actual implementation of the collection is done by the derived classes.
 */
export abstract class AbstractCollection<T> extends JavaObject implements java.util.Collection<T> {
    protected constructor() {
        super();
    }

    public abstract [Symbol.iterator](): IterableIterator<T>;

    public abstract add(e: T): boolean;
    public abstract addAll(c: java.util.Collection<T>): boolean;
    public abstract clear(): void;
    public abstract contains(o: T): boolean;
    public abstract containsAll(c: java.util.Collection<T>): boolean;
    public abstract equals(other: unknown): boolean;
    public abstract forEach(action: java.util.function.Consumer<T>): void;
    public abstract hashCode(): number;
    public abstract isEmpty(): boolean;
    public abstract iterator(): java.util.Iterator<T>;
    public abstract remove(o: unknown): boolean;
    public abstract removeAll(c: java.util.Collection<T>): boolean;
    public abstract removeIf(filter: java.util.function.Predicate<T>): boolean;
    public abstract retainAll(c: java.util.Collection<T>): boolean;
    public abstract size(): number;
    public abstract spliterator(): java.util.Spliterator<T>;
    public abstract toString(): java.lang.String;
    public abstract toArray(): T[];
    public abstract toArray<U>(a: U[]): U[];
}
