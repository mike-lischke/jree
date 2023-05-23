/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import {
    Comparable, IllegalStateException, JavaString, NullPointerException, UnsupportedOperationException,
} from "../lang";
import { ArrayIndexOutOfBoundsException } from "../lang/ArrayIndexOutOfBoundsException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { JavaObject } from "../lang/Object";
import { StringBuilder } from "../lang/StringBuilder";
import { AbstractCollection } from "./AbstractCollection";
import { Collection } from "./Collection";
import { Comparator } from "./Comparator";
import { ConcurrentModificationException } from "./ConcurrentModificationException";
import { JavaIterator } from "./Iterator";
import { List } from "./List";
import { ListIterator } from "./ListIterator";
import { NoSuchElementException } from "./NoSuchElementException";
import { Objects } from "./Objects";
import { Spliterator } from "./Spliterator";
import { UnaryOperator } from "./function";
import { Consumer } from "./function/Consumer";
import { Predicate } from "./function/Predicate";
import { Stream } from "./stream";

/**
 * This interface provides shared access to the backend of a list class.
 * It is usually not shared itself, but holds the shared list.
 */
export interface ISubList<T> {
    /** The underlying data. */
    data: T[];

    /**
     * The list from which this sub list was created. If undefined then this sub list represents the original
     * list and index values are relative to the start of the data array.
     */
    parentList?: AbstractList<T>;

    /** The start index of the sub list relative to the parent list (inclusive). */
    start: number;

    /** The end index of the sub list relative to the parent list (exclusive). */
    end: number;
}

/**
 * This is the base class for all list implementations. It provides the core functionality and the
 * iterator implementation (both, Java and Typescript iterators). Additionally, it is range-aware and can be
 * used to implement sub lists.
 *
 * The actual implementation here goes a bit further and implements all abstract methods too. It manages the underlying
 * memory and sub list handling. It's essentially a combined implementation of AbstractList and AbstractCollection.
 */
export class AbstractList<T> extends AbstractCollection<T> implements List<T> {

    protected modCount = 0;

    #IteratorImpl = class IteratorImpl<T> extends JavaObject implements JavaIterator<T> {
        // Holds the direction we navigated last (either by calling next() or previous()).
        protected movedForward: boolean | undefined;

        protected currentModCount = 0;

        public constructor(protected owner: AbstractList<T>, protected index: number) {
            super();

            this.currentModCount = owner.modCount;

            if (index < 0 || index > owner.size()) {
                throw new IndexOutOfBoundsException();
            }
        }

        public forEachRemaining(consumer: (element: T) => void): void {
            while (this.hasNext()) {
                consumer(this.next());
            }
        }

        public hasNext(): boolean {
            return this.index < this.owner.size();
        }

        public next(): T {
            this.checkModCount();

            if (!this.hasNext()) {
                throw new NoSuchElementException();
            }

            this.movedForward = true;

            return this.owner.get(this.index++);
        }

        public nextIndex(): number {
            return this.index;
        }

        public remove(): void {
            if (this.movedForward === undefined) {
                throw new IllegalStateException();
            }

            if (this.movedForward) {
                // Index was moved to next element.
                this.owner.remove(this.index - 1);
            } else {
                // Index at last returned element.
                this.owner.remove(this.index);
            }

            this.currentModCount = this.owner.modCount;
            this.movedForward = undefined;
        }

        protected checkModCount(): void {
            if (this.currentModCount !== this.owner.modCount) {
                throw new ConcurrentModificationException();
            }
        }
    };

    #ListIteratorImpl = class ListIteratorImpl<T> extends this.#IteratorImpl<T> implements ListIterator<T> {
        public add(element: T): void {
            this.movedForward = undefined;
            if (this.owner.size() === 0) {
                this.owner.add(element);
            } else {
                this.owner.add(this.index, element);
            }

            ++this.index;
        }

        public hasPrevious(): boolean {
            return this.index > 0;
        }

        public previous(): T {
            this.checkModCount();

            if (!this.hasPrevious) {
                throw new NoSuchElementException();
            }

            this.movedForward = false;

            return this.owner.get(--this.index);
        }

        public previousIndex(): number {
            return this.index - 1;
        }

        public set(element: T): void {
            if (this.movedForward === undefined) {
                throw new IllegalStateException();
            }

            if (this.movedForward) {
                // Index was moved to next element.
                this.owner.set(this.index - 1, element);
            } else {
                // Index at last returned element.
                this.owner.set(this.index, element);
            }
        }

    };

    #subListDetails: ISubList<T>;

    protected constructor(list?: ISubList<T>) {
        super();

        this.#subListDetails = list ?? {
            data: [],
            start: 0,
            end: 0,
        };
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#subListDetails.data.slice(this.#subListDetails.start, this.#subListDetails.end);
    }

    /**
     * Adds the specified element to the end of this list.
     *
     * @param element The element to add.
     *
     * @returns true if the element was added.
     */
    public override add(element: T): boolean;
    /**
     * Inserts the specified element at the specified position in this list. Shifts the element
     * currently at that position (if any) and any subsequent elements to the right (adds one to
     * their indices).
     *
     * @param index The index at which to insert the element.
     * @param element The element to insert.
     *
     * @returns true if the element was added.
     *
     * @throws IndexOutOfBoundsException if the index is out of range.
     */
    public override add(index: number, element: T): void;
    public override add(...args: unknown[]): void | boolean {
        this.checkReadOnly();
        this.checkModCount();

        switch (args.length) {
            case 1: {
                // If there's no parent (sub)list, we can work directly on the data.
                if (this.#subListDetails.parentList === undefined) {
                    if (this.#subListDetails.data.length === this.#subListDetails.end) {
                        this.#subListDetails.data.push(args[0] as T);
                    } else {
                        this.#subListDetails.data[this.#subListDetails.end] = args[0] as T;
                    }
                } else {
                    // Otherwise do the manipulation on the parent list (possibly recursively).
                    this.#subListDetails.parentList.add(this.#subListDetails.end, args[0] as T);
                }

                ++this.#subListDetails.end;
                ++this.modCount;

                return true;
            }

            case 2: {
                const index = Math.floor(args[0] as number);
                if (index < 0 || index > this.size()) {
                    throw new ArrayIndexOutOfBoundsException();
                }

                const element = args[1] as T;
                if (this.#subListDetails.parentList === undefined) {
                    this.ensureCapacity(this.#subListDetails.end + 1);
                    this.#subListDetails.data.copyWithin(index + 1, index, this.#subListDetails.end);
                    this.#subListDetails.data[index] = element;
                } else {
                    this.#subListDetails.parentList.add(this.#subListDetails.start + index, element);
                }

                ++this.#subListDetails.end;
                ++this.modCount;

                break;
            }

            default: {
                throw new IllegalArgumentException();
            }
        }
    }

    /**
     * Appends all of the elements in the specified collection to the end of this list, in the order
     * that they are returned by the specified collection's Iterator. The behavior of this operation
     * is undefined if the specified collection is modified while the operation is in progress.
     * (This implies that the behavior of this call is undefined if the specified collection is this
     * list, and this list is nonempty.)
     *
     * @param c The collection whose elements are to be added to this list.
     *
     * @returns true if this list changed as a result of the call.
     */
    public override addAll(c: Collection<T>): boolean;
    /**
     * Inserts all of the elements in the specified collection into this list, starting at the
     * specified position. Shifts the element currently at that position (if any) and any subsequent
     * elements to the right (increases their indices). The new elements will appear in this list in
     * the order that they are returned by the specified collection's iterator. The behavior of this
     * operation is undefined if the specified collection is modified while the operation is in
     * progress. (This implies that the behavior of this call is undefined if the specified collection
     * is this list, and this list is nonempty.)
     *
     * @param index The index at which to insert the first element from the specified collection.
     * @param c The collection whose elements are to be added to this list.
     *
     * @returns true if this list changed as a result of the call.
     */
    public override addAll(index: number, c: Collection<T>): boolean;
    public override addAll(...args: unknown[]): boolean {
        this.checkReadOnly();
        this.checkModCount();

        switch (args.length) {
            case 1: {
                const c = args[0] as Collection<T>;
                if (this.#subListDetails.parentList === undefined) {
                    this.ensureCapacity(this.size() + c.size());
                    for (const element of c) {
                        this.#subListDetails.data[this.#subListDetails.end++] = element;
                    }
                } else {
                    this.#subListDetails.parentList.addAll(this.#subListDetails.end, c);
                    this.#subListDetails.end += c.size();
                }

                ++this.modCount;

                return true;
            }

            case 2: {
                let index = Math.floor(args[0] as number);
                if (index < 0 || index >= this.size()) {
                    throw new ArrayIndexOutOfBoundsException();
                }

                const c = args[1] as Collection<T>;
                if (this.#subListDetails.parentList === undefined) {
                    // The start index must be 0 if there's no parent list.
                    this.ensureCapacity(index + c.size());
                    for (const element of c) {
                        this.#subListDetails.data[index++] = element;
                    }
                } else {
                    this.#subListDetails.parentList.addAll(this.#subListDetails.start + index, c);
                    index += c.size();
                }

                ++this.modCount;
                this.#subListDetails.end = Math.max(this.#subListDetails.end, index);

                return true;
            }

            default: {
                throw new IllegalArgumentException();
            }
        }
    }

    /**
     * Removes all of the elements from this list. The list will be empty after this call returns.
     * This method is equivalent to calling `removeRange(0, size())`.
     */
    public override clear(): void {
        this.removeRange(0, this.size());
    }

    /**
     * Returns true if this list contains the specified element.
     * More formally, returns true if and only if this list contains at least one element e such that
     * `Object.equals(element, e)`.
     *
     * @param element The element whose presence in this list is to be tested.
     *
     * @returns true if this list contains the specified element.
     */
    public override contains(element: T): boolean {
        if (element === null) {
            throw new NullPointerException();
        }

        this.checkModCount();

        if (this.#subListDetails.parentList === undefined) {
            for (let i = 0; i < this.#subListDetails.end; ++i) {
                const entry = this.#subListDetails.data[i];
                if (Objects.equals(entry, element)) {
                    return true;
                }
            }
        } else {
            const index = this.#subListDetails.parentList.indexOf(element) - this.#subListDetails.start;
            if (index >= 0 && index < this.size()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Returns true if this list contains all of the elements of the specified collection.
     * More formally, returns true if and only if this list contains at least one element e such that
     * `is(element, e)`.
     *
     * @param c The collection whose elements are to be tested for containment in this list.
     *
     * @returns true if this list contains all of the elements of the specified collection.
     */
    public override containsAll(c: Collection<T>): boolean {
        if (c == null) {
            throw new NullPointerException();
        }

        this.checkModCount();

        for (const element of c) {
            if (!this.contains(element)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Increases the capacity of this ArrayList instance, if necessary, to ensure that it can hold at least the number
     * of elements specified by the minimum capacity argument.
     *
     * @param minCapacity The desired minimum capacity.
     */
    public ensureCapacity(minCapacity: number): void {
        this.checkModCount();

        this.#subListDetails.data.length = Math.max(this.#subListDetails.data.length, minCapacity);
    }

    /**
     * Compares the specified object with this list for equality. Returns true if and only if the
     * specified object is also a list, both lists have the same size, and all corresponding pairs
     * of elements in the two lists are equal. (Two elements e1 and e2 are equal if (e1==null ? e2==null
     * : e1.equals(e2)).) In other words, two lists are defined to be equal if they contain the same
     * elements in the same order. This definition ensures that the equals method works properly
     * across different implementations of the List interface.
     *
     * @param other The object to be compared for equality with this list.
     *
     * @returns true if the specified object is equal to this list.
     */
    public override equals(other: unknown): boolean {
        this.checkModCount();

        if (this === other) {
            return true;
        }

        if (!(other instanceof AbstractList)) {
            return false;
        }

        if (this.size() !== other.size()) {
            return false;
        }

        const size = this.size();
        for (let i = 0; i < size; ++i) {
            if (!Objects.equals(this.get(i), other.get(i))) {
                return false;
            }
        }

        return true;
    }

    public override forEach(action: Consumer<T>): void {
        if (action == null) {
            throw new NullPointerException();
        }

        const expectedModeCount = this.modCount;
        const size = this.size();

        for (let i = 0; i < size; ++i) {
            action(this.get(i));
        }

        if (this.modCount !== expectedModeCount) {
            throw new ConcurrentModificationException();
        }
    }

    /**
     * Returns the element at the specified position in this list.
     *
     * @param index The index of the element to return.
     *
     * @returns The element at the specified position in this list.
     *
     * @throws IndexOutOfBoundsException if the index is out of range.
     */
    public get(index: number): T {
        this.checkModCount();

        index = Math.floor(index);
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException();
        }

        if (this.#subListDetails.parentList === undefined) {
            return this.#subListDetails.data[index];
        } else {
            return this.#subListDetails.parentList.get(this.#subListDetails.start + index);
        }
    }

    /**
     * Returns the hash code value for this list.
     *
     * @returns The hash code value for this list.
     */
    public override hashCode(): number {
        this.checkModCount();

        let result = 1;
        for (const element of this) {
            result = 31 * result + Objects.hashCode(element);
        }

        return result;
    }

    /**
     * Returns the index of the first occurrence of the specified element in this list, or -1 if
     * this list does not contain the element. More formally, returns the lowest index i such that
     * `is(element, get(i))`, or -1 if there is no such index.
     *
     * @param element The element to search for.
     *
     * @returns The index of the first occurrence of the specified element in this list, or -1 if
     *          this list does not contain the element.
     */
    public indexOf(element: T): number {
        if (element === null) {
            throw new NullPointerException();
        }

        this.checkModCount();

        const array = this.toArray();

        return array.findIndex((value) => { return Objects.equals(element, value); });
    }

    /**
     * @returns true if this list contains no elements.
     */
    public override isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     * The elements will be returned in order from first (index 0) to last (index size() - 1).
     * The returned iterator is a "weakly consistent" iterator that will never throw
     * {@link ConcurrentModificationException}, and guarantees to traverse elements as they existed upon
     * construction of the iterator, and may (but is not guaranteed to) reflect any modifications
     * subsequent to construction.
     *
     * @returns An iterator over the elements in this list in proper sequence.
     */
    public override iterator(): JavaIterator<T> {
        this.checkModCount();

        return new this.#IteratorImpl(this, 0);
    }

    public override parallelStream(): Stream<T> {
        throw new NotImplementedError();
    }

    /**
     * Returns the index of the last occurrence of the specified element in this list, or -1 if
     * this list does not contain the element. More formally, returns the highest index i such that
     * `is(element, get(i))`, or -1 if there is no such index.
     *
     * @param element The element to search for.
     *
     * @returns The index of the last occurrence of the specified element in this list, or -1 if
     *          this list does not contain the element.
     */
    public lastIndexOf(element: T): number {
        if (element === null) {
            throw new NullPointerException();
        }

        this.checkModCount();

        if (this.isEmpty()) {
            return -1;
        }

        const array = this.toArray().reverse();
        const index = array.findIndex((value) => { return Objects.equals(element, value); });
        if (index === -1) {
            return -1;
        }

        return array.length - index - 1;
    }

    /**
     * Returns a list iterator over the elements in this list (in proper sequence).
     * The elements will be returned in order from first (index 0) to last (index size() - 1).
     * The returned iterator is a "weakly consistent" iterator that will never throw
     * {@link ConcurrentModificationException}, and guarantees to traverse elements as they existed upon
     * construction of the iterator, and may (but is not guaranteed to) reflect any modifications
     * subsequent to construction.
     *
     * @param index The index of the first element to be returned from the list iterator (by a call to
     * @returns A list iterator over the elements in this list (in proper sequence).
     */
    public listIterator(index = 0): ListIterator<T> {
        this.checkModCount();
        index = Math.floor(index);

        return new this.#ListIteratorImpl(this, index);
    }

    /**
     * Removes the element at the specified position in this list. Shifts any subsequent elements to the left
     * (subtracts one from their indices). Returns the element that was removed from the list.
     *
     * @param index The index of the element to be removed.
     *
     * @returns The element previously at the specified position.
     *
     * @throws IndexOutOfBoundsException if the index is out of range.
     */
    public override remove(index: number): T;
    /**
     * Removes the first occurrence of the specified element from this list, if it is present. If this list does not
     * contain the element, it is unchanged. More formally, removes the element with the lowest index i such that
     * `Objects.equals(element, get(i))` (if such an element exists). Returns true if this list contained the specified
     * element (or equivalently, if this list changed as a result of the call).
     *
     * @param element The element to be removed from this list, if present.
     *
     * @returns true if this list contained the specified element.
     */
    public override remove(element: T): boolean;
    public override remove(...args: unknown[]): boolean | T {
        this.checkReadOnly();
        this.checkModCount();

        switch (args.length) {
            case 1: {
                // Note: we cannot distinguish between an argument being an index or an element of type number.
                // Therefore, we assume it's an index if it's a number.
                if (typeof args[0] === "number") {
                    const index = Math.floor(args[0]);
                    if (index < 0 || index >= this.size()) {
                        throw new IndexOutOfBoundsException();
                    }

                    return this.removeAt(index);
                } else {
                    return this.removeValue(args[0] as T);
                }
            }

            default: {
                throw new IllegalArgumentException();
            }
        }
    }

    /**
     * Removes from this list all of its elements that are contained in the specified collection.
     *
     * @param c The collection containing elements to be removed from this list.
     *
     * @returns true if this list changed as a result of the call.
     */
    public override removeAll(c: Collection<T>): boolean {
        if (c == null) {
            throw new NullPointerException();
        }

        this.checkReadOnly();
        this.checkModCount();

        if (this === c) {
            // Fast path.
            this.clear();

            return c.size() > 0;
        }

        let result = false;

        // We know that the collection is not this list, so we can iterate and remove at the same time.
        c.forEach((value: T) => {
            if (this.removeValue(value)) {
                result = true;
            }
        });

        return result;
    }

    /**
     * Removes all of the elements of this collection that satisfy the given predicate.
     *
     * @param filter A predicate which returns true for elements to be removed.
     *
     * @returns true if any elements were removed.
     */
    public override removeIf(filter: Predicate<T>): boolean {
        if (filter == null) {
            throw new NullPointerException();
        }

        this.checkReadOnly();
        this.checkModCount();

        const candidates: T[] = [];
        this.forEach((value: T) => {
            if (filter(value)) {
                candidates.push(value);
            }
        });

        candidates.forEach((value) => {
            // Have to use this.remove() instead of this.removeValue() in case this.remove() is overridden.
            this.remove(value);
        });

        return candidates.length > 0;
    }

    /**
     * Removes the elements in the specified range from this list.
     * This call shortens the list by (toIndex - fromIndex) elements.
     *
     * @param fromIndex The index of the first element to be removed.
     * @param toIndex The index after the last element to be removed.
     *
     * @throws IndexOutOfBoundsException if an endpoint index value is out of range
     * @throws IllegalArgumentException if the endpoint indices are out of order
     */
    public removeRange(fromIndex: number, toIndex: number): void {
        this.checkReadOnly();
        this.checkModCount();

        fromIndex = Math.floor(fromIndex);
        toIndex = Math.floor(toIndex);
        if (fromIndex < 0 || toIndex > this.size()) {
            throw new IndexOutOfBoundsException();
        }

        if (fromIndex > toIndex) {
            throw new IllegalArgumentException();
        }

        const delta = toIndex - fromIndex;
        if (delta === 0) {
            return;
        }

        if (this.#subListDetails.parentList === undefined) {
            this.#subListDetails.data.copyWithin(fromIndex, toIndex, this.#subListDetails.end);
            this.#subListDetails.data.fill(null as T, this.#subListDetails.end - delta, this.#subListDetails.end);
        } else {
            this.#subListDetails.parentList.removeRange(this.#subListDetails.start + fromIndex,
                this.#subListDetails.start + toIndex);
        }

        this.#subListDetails.end -= delta;
        ++this.modCount;
    }

    public replaceAll(operator: UnaryOperator<T> | null): void {
        if (operator === null) {
            throw new NullPointerException();
        }

        this.checkReadOnly();

        const size = this.size();
        const expectedModCount = this.modCount;

        for (let i = 0; i < size; ++i) {
            const oldValue = this.get(i);
            const newValue = operator(oldValue);
            if (oldValue !== newValue) {
                this.set(i, newValue);
            }
        }

        if (this.modCount !== expectedModCount) {
            throw new ConcurrentModificationException();
        }
    }

    /**
     * Retains only the element in this list that are contained in the specified collection. In other words, removes
     * from this list all of its elements that are not contained in the specified collection.
     *
     * @param c The collection containing elements to be retained in this list.
     *
     * @returns true if this list changed as a result of the call.
     */
    public override retainAll(c: Collection<T>): boolean {
        if (c == null) {
            throw new NullPointerException();
        }

        this.checkReadOnly();
        this.checkModCount();

        if (this === c) {
            // Fast path.
            return false;
        }

        let result = false;
        this.removeIf((value: T): boolean => {
            const missed = !c.contains(value);
            result ||= missed;

            return missed;
        });

        return result;
    }

    /**
     * Replaces the element at the specified position in this list with the specified element.
     *
     * @param index The index of the element to replace.
     * @param element The element to be stored at the specified position.
     *
     * @returns The element previously at the specified position.
     */
    public set(index: number, element: T): T {
        this.checkReadOnly();
        this.checkModCount();

        index = Math.floor(index);
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException();
        }

        if (this.#subListDetails.parentList === undefined) {
            const result = this.#subListDetails.data[index];
            this.#subListDetails.data[this.#subListDetails.start + index] = element;

            return result;
        } else {
            return this.#subListDetails.parentList.set(index + this.#subListDetails.start, element);
        }
    }

    /**
     * @returns The number of elements in this list.
     */
    public override size(): number {
        this.checkModCount();

        return this.#subListDetails.end - this.#subListDetails.start;
    }

    public sort(c: Comparator<T> | null): void {
        this.checkReadOnly();
        const expectedModCount = this.modCount;
        const list = this.toArray();
        if (c !== null) {
            list.sort((a: T, b: T) => {
                return c(a, b);
            });
        } else {
            list.sort((a: T, b: T) => {
                return (a as Comparable<T>).compareTo(b);
            });
        }

        if (this.modCount !== expectedModCount) {
            throw new ConcurrentModificationException();
        }

        list.forEach((value: T, index: number) => {
            this.set(index, value);
        });
    }

    public override stream(): Stream<T> {
        throw new NotImplementedError();
    }

    public override spliterator(): Spliterator<T> {
        throw new NotImplementedError();
    }

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     * (If fromIndex and toIndex are equal, the returned list is empty.) The returned list is backed by this list, so
     * non-structural changes in the returned list are reflected in this list, and vice-versa. The returned list
     * supports all of the optional list operations supported by this list.
     *
     * @param fromIndex The low endpoint (inclusive) of the subList.
     * @param toIndex The high endpoint (exclusive) of the subList.
     *
     * @returns A view of the specified range within this list.
     *
     * @throws IndexOutOfBoundsException if an endpoint index value is out of range
     * @throws IllegalArgumentException if the endpoint indices are out of order
     */
    public subList(fromIndex: number, toIndex: number): List<T> {
        this.checkModCount();

        fromIndex = Math.floor(fromIndex);
        toIndex = Math.floor(toIndex);
        if (fromIndex < 0 || toIndex > this.size()) {
            throw new IndexOutOfBoundsException();
        }

        if (fromIndex > toIndex) {
            throw new IllegalArgumentException();
        }

        const list = new AbstractList<T>({
            parentList: this,
            data: this.#subListDetails.data,
            start: fromIndex, // Indexes are relative to their parent list.
            end: toIndex,
        });
        list.modCount = this.modCount;

        if ("readOnly" in this) {
            Object.defineProperty(list, "readOnly", {
                value: this.readOnly,
                writable: false,
                configurable: false,
                enumerable: true,
            });
        }

        return list;
    }

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element).
     *
     * @returns An array containing all of the elements in this list in proper sequence.
     */
    public override toArray(): T[];
    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element);
     * the runtime type of the returned array is that of the specified array. If the list fits in the specified array,
     * it is returned therein. Otherwise, a new array is allocated with the runtime type of the specified array and
     * the size of this list.
     *
     * @param a The array into which the elements of this list are to be stored, if it is big enough; otherwise, a new
     *          array of the same runtime type is allocated for this purpose.
     *
     * @returns An array containing the elements of this list.
     *
     * Note: In Java this method accept any element type and throws an ArrayStoreException if the given type is not
     * assignable to the list element type. In Typescript we enforce the type to be assignable to the list element type.
     */
    public override toArray<T2 extends T>(a: T2[]): T2[];
    public override toArray<T2 extends T>(a?: T2[]): T2[] | T[] {
        this.checkModCount();

        if (!a || a.length < this.size()) {
            return this.arrayFromRange(0, this.size());
        }

        // The array is big enough, to hold all elements.
        this.copyToArray(a);

        return a;
    }

    /**
     * Returns a string representation of this list. The string representation consists of a list of the list's
     * elements in the order they are returned by its iterator, enclosed in square brackets ("[]"). Adjacent elements
     * are separated by the characters ", " (comma and space). Elements are converted to strings as by
     * JavaString.valueOf(Object).
     *
     * @returns A string representation of this list.
     */
    public override toString(): JavaString {
        this.checkModCount();

        const builder = new StringBuilder();
        builder.append("[");
        for (let i = 0; i < this.size(); i++) {
            if (i > 0) {
                builder.append(", ");
            }
            builder.append(`${this.get(i)}`);
        }
        builder.append("]");

        return builder.toString();
    }

    /**
     * Creates a clone of this ranged list.
     *
     * @param c The constructor of the clone.
     *
     * @returns A clone of this ranged list.
     */
    protected createClone<L extends AbstractList<T>>(c: (new () => L)): L {
        const clone = new c();
        clone.#subListDetails = {
            ...this.#subListDetails,
            data: this.#subListDetails.data.slice(),
        };
        clone.modCount = this.modCount;

        if ("readOnly" in this) {
            Object.defineProperty(clone, "readOnly", {
                value: this.readOnly,
                writable: false,
                configurable: false,
                enumerable: true,
            });
        }

        return clone;
    }

    /**
     * Copies the elements of this list into the specified array.
     *
     * @param array The target array. It must be large enough to hold all elements of this list.
     */
    protected copyToArray(array: T[]): void {
        for (let i = 0; i < this.size(); i++) {
            array[i] = this.get(i);
        }

        // If the target array is bigger than the list, we need to set the entry following the last set element to null.
        if (array.length > this.size()) {
            array[this.size()] = null as T;
        }
    }

    /**
     * Copies a sub range of this list into the specified array.
     *
     * @param start The start index of the sub range.
     * @param end The end index of the sub range.
     *
     * @returns An array containing the elements of the sub range.
     */
    protected arrayFromRange(start: number, end: number): T[] {
        if (this.#subListDetails.parentList === undefined) {
            return this.#subListDetails.data.slice(start, end);
        } else {
            return this.#subListDetails.parentList.arrayFromRange(this.#subListDetails.start + start,
                this.#subListDetails.start + end);
        }
    }

    protected [Symbol.toPrimitive](): string {
        return `${this.toString().valueOf()}`;
    }

    private checkModCount(): void {
        if (this.#subListDetails.parentList !== undefined) {
            if (this.#subListDetails.parentList.modCount !== this.modCount) {
                throw new ConcurrentModificationException();
            }
        }
    }

    /**
     * Removes the first occurrence of the specified element from this list, if it is present.
     *
     * @param value The element to be removed from this list, if present.
     *
     * @returns true if this list contained the specified element.
     */
    private removeValue(value: T): boolean {
        const index = this.indexOf(value);
        if (index === -1) {
            return false;
        }

        this.removeAt(index);

        return true;
    }

    /**
     * Removes the element at the specified position in this list. It does not check for concurrent modification or
     * index out of bounds.
     *
     * @param index The index of the element to be removed.
     *
     * @returns The element that was removed from the list.
     */
    private removeAt(index: number): T {
        let result: T;
        if (this.#subListDetails.parentList === undefined) {
            result = this.#subListDetails.data[index];
            if (index + 1 < this.#subListDetails.data.length) {
                this.#subListDetails.data.copyWithin(index, index + 1, this.#subListDetails.end);
            }
            this.#subListDetails.data[this.#subListDetails.end - 1] = null as T;
        } else {
            result = this.#subListDetails.parentList.remove(index + this.#subListDetails.start);
        }
        --this.#subListDetails.end;
        ++this.modCount;

        return result;
    }

    private checkReadOnly(): void {
        if ("readOnly" in this && this.readOnly) {
            throw new UnsupportedOperationException("This list is read-only.");
        }
    }

}
