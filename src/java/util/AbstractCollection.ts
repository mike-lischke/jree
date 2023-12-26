/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../lang/String.js";
import { JavaObject } from "../lang/Object.js";
import { Collection } from "./Collection.js";
import { Consumer } from "./function/Consumer.js";
import { Predicate } from "./function/Predicate.js";
import { JavaIterator } from "./Iterator.js";
import { Spliterator } from "./Spliterator.js";
import { Stream } from "./stream/Stream.js";

/**
 * This class provides a skeletal implementation of the Collection interface, to minimize the effort required to
 * implement this interface.
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
    public abstract parallelStream(): Stream<T>;
    public abstract remove(o: unknown): boolean;
    public abstract removeAll(c: Collection<T>): boolean;
    public abstract removeIf(filter: Predicate<T>): boolean;
    public abstract retainAll(c: Collection<T>): boolean;
    public abstract size(): number;
    public abstract stream(): Stream<T>;
    public abstract spliterator(): Spliterator<T>;
    public abstract override toString(): JavaString;
    public abstract toArray(): T[];
    public abstract toArray<U>(a: U[]): U[];
}
