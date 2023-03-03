/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../lang";
import { JavaObject } from "../lang/Object";
import { Collection } from "./Collection";
import { Consumer } from "./function/Consumer";
import { Predicate } from "./function/Predicate";
import { JavaIterator } from "./Iterator";
import { Spliterator } from "./Spliterator";

/**
 * This is the base class for all collections in this library. It implements the common methods of the
 * Collection interface. The actual implementation of the collection is done by the derived classes.
 */
export abstract class AbstractCollection<T> extends JavaObject implements Collection<T> {
    protected constructor() {
        super();
    }

    public abstract [Symbol.iterator](): IterableIterator<T>;

    public abstract add(e: T): boolean;
    public abstract addAll(c: Collection<T>): boolean;
    public abstract clear(): void;
    public abstract contains(o: T): boolean;
    public abstract containsAll(c: Collection<T>): boolean;
    public abstract override equals(other: unknown): boolean;
    public abstract forEach(action: Consumer<T>): void;
    public abstract override hashCode(): number;
    public abstract isEmpty(): boolean;
    public abstract iterator(): JavaIterator<T>;
    public abstract remove(o: unknown): boolean;
    public abstract removeAll(c: Collection<T>): boolean;
    public abstract removeIf(filter: Predicate<T>): boolean;
    public abstract retainAll(c: Collection<T>): boolean;
    public abstract size(): number;
    public abstract spliterator(): Spliterator<T>;
    // @ts-ignore
    public abstract toString(): JavaString;
    public abstract toArray(): T[];
    public abstract toArray<U>(a: U[]): U[];
}
