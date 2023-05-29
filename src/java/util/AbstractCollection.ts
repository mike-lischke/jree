/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../lang";
import { JavaObject } from "../lang/Object";
import { Collection } from "./Collection";
import { Consumer } from "./function/Consumer";
import { Predicate } from "./function/Predicate";
import { JavaIterator } from "./Iterator";
import { Spliterator } from "./Spliterator";
import { Stream } from "./stream";

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
