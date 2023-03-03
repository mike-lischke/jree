/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { is, List as ImmList } from "immutable";

import { IteratorWrapper } from "../../IteratorWrapper";
import { IListBackend, ListIteratorImpl } from "./ListIteratorImpl";
import { AbstractCollection } from "./AbstractCollection";
import { List } from "./List";
import { StringBuilder } from "../lang/StringBuilder";
import { Collection } from "./Collection";
import { ArrayIndexOutOfBoundsException } from "../lang/ArrayIndexOutOfBoundsException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { Consumer } from "./function/Consumer";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { MurmurHash } from "../../MurmurHash";
import { JavaIterator } from "./Iterator";
import { ListIterator } from "./ListIterator";
import { Predicate } from "./function/Predicate";
import { Spliterator } from "./Spliterator";
import { NotImplementedError } from "../../NotImplementedError";
import { JavaString } from "../lang";

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

    #sharedBackend: IListBackend<T>;

    protected constructor(list?: IListBackend<T>) {
        super();

        this.#sharedBackend = list ?? {
            list: ImmList(),
            start: 0,
            end: 0,
            updateEnd: (delta: number) => {
                // Nothing to do here.
            },
        };
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#sharedBackend.list;
    }

    /**
     * Adds the specified element to the end of this list.
     *
     * @param element The element to add.
     *
     * @returns true if the element was added.
     */
    public add(element: T): boolean;
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
    public add(index: number, element: T): void;
    public add(...args: unknown[]): void | boolean {
        switch (args.length) {
            case 1: {
                this.#sharedBackend.list = this.#sharedBackend.list.push(args[0] as T);
                this.changeSize(1);

                return true;
            }

            case 2: {
                const index = args[0] as number;
                if (index < 0 || index > this.size()) {
                    throw new ArrayIndexOutOfBoundsException();
                }

                const element = args[1] as T;
                if (index === this.size()) {
                    this.#sharedBackend.list = this.#sharedBackend.list.push(element);
                    this.changeSize(1);

                    return;
                }

                this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.start + index,
                    0, element);
                this.changeSize(1);

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
    public addAll(c: Collection<T>): boolean;
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
    public addAll(index: number, c: Collection<T>): boolean;
    public addAll(...args: unknown[]): boolean {
        switch (args.length) {
            case 1: {
                const c = args[0] as Collection<T>;
                this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.end, 0, ...c);
                this.changeSize(c.size());

                return true;
            }

            case 2: {
                const index = this.#sharedBackend.start + (args[0] as number);
                if (index < 0 || index >= this.size()) {
                    throw new ArrayIndexOutOfBoundsException();
                }

                const c = args[1] as Collection<T>;
                this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.start + index, 0, ...c);
                this.changeSize(c.size());

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
    public clear(): void {
        const count = this.size();
        if (this.#sharedBackend.start === 0 && this.#sharedBackend.end === undefined) {
            // Fast path.
            this.#sharedBackend.list = ImmList();
            this.changeSize(-count);
        } else {
            this.removeRange(0, this.size());
        }
    }

    /**
     * Returns true if this list contains the specified element.
     * More formally, returns true if and only if this list contains at least one element e such that
     * `is(element, e)`.
     *
     * @param element The element whose presence in this list is to be tested.
     *
     * @returns true if this list contains the specified element.
     */
    public contains(element: T): boolean {
        const index = this.#sharedBackend.list.findIndex((value, i) => {
            if (i < this.#sharedBackend.start || i >= this.#sharedBackend.end) {
                return false;
            }

            return is(element, value);
        });

        return index > -1;
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
    public containsAll(c: Collection<T>): boolean {
        for (const element of c) {
            if (!this.contains(element)) {
                return false;
            }
        }

        return true;
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
    public equals(other: unknown): boolean {
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
            if (!is(this.#sharedBackend.list.get(this.#sharedBackend.start + i),
                other.#sharedBackend.list.get(other.#sharedBackend.start + i))) {
                return false;
            }
        }

        return true;
    }

    public forEach(action: Consumer<T>): void {
        for (let i = this.#sharedBackend.start; i < this.#sharedBackend.end; ++i) {
            action.accept(this.#sharedBackend.list.get(i)!);
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
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException();
        }

        return this.#sharedBackend.list.get(this.#sharedBackend.start + index)!;
    }

    /**
     * Returns the hash code value for this list.
     *
     * @returns The hash code value for this list.
     */
    public hashCode(): number {
        if (this.#sharedBackend.start === 0 && this.#sharedBackend.end === this.#sharedBackend.list.count()) {
            // Fast path
            return this.#sharedBackend.list.hashCode();
        }

        let hashCode = 1;
        for (let i = this.#sharedBackend.start; i < this.#sharedBackend.end; ++i) {
            const element = this.#sharedBackend.list.get(i);
            hashCode = 31 * hashCode + MurmurHash.hashCode(element);
        }

        return hashCode;
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
        const index = this.#sharedBackend.list.findIndex((value, i) => {
            if (i < this.#sharedBackend.start || i >= this.#sharedBackend.end) {
                return false;
            }

            return is(element, value);
        });

        return index - this.#sharedBackend.start;
    }

    /**
     * @returns true if this list contains no elements.
     */
    public isEmpty(): boolean {
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
    public iterator(): JavaIterator<T> {
        if (this.#sharedBackend.start === 0 && this.#sharedBackend.end === undefined) {
            // Fast path
            return new IteratorWrapper(this.#sharedBackend.list[Symbol.iterator]());
        }

        const subList = this.#sharedBackend.list.slice(this.#sharedBackend.start, this.#sharedBackend.end);

        return new IteratorWrapper(subList[Symbol.iterator]());
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
        if (this.isEmpty()) {
            return -1;
        }

        const index = this.#sharedBackend.list.findIndex((value, i) => {
            if (i < this.#sharedBackend.start || i >= this.#sharedBackend.end) {
                return false;
            }

            return is(element, value);
        });

        return index - this.#sharedBackend.start;
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
        return new ListIteratorImpl(this.#sharedBackend, this.#sharedBackend.start + index);
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
    public remove(index: number): T;
    /**
     * Removes the first occurrence of the specified element from this list, if it is present. If this list does not
     * contain the element, it is unchanged. More formally, removes the element with the lowest index i such that
     * `is(element, get(i))` (if such an element exists). Returns true if this list contained the specified element
     * (or equivalently, if this list changed as a result of the call).
     *
     * @param element The element to be removed from this list, if present.
     *
     * @returns true if this list contained the specified element.
     */
    public remove(element: T): boolean;
    public remove(...args: unknown[]): boolean | T {
        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    const index = args[0] - this.#sharedBackend.start;
                    if (index < 0 || index >= this.size()) {
                        throw new IndexOutOfBoundsException();
                    }

                    const result = this.#sharedBackend.list.get(index)!;
                    this.#sharedBackend.list = this.#sharedBackend.list.splice(index, 1);
                    this.changeSize(-1);

                    return result;
                } else {
                    const index = this.#sharedBackend.list.indexOf(args[0] as T);
                    if (index > -1) {
                        if (this.#sharedBackend.start <= index && index < this.#sharedBackend.end) {
                            this.#sharedBackend.list.splice(index, 1);
                            this.changeSize(-1);

                            return true;
                        }
                    }

                    return false;
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
    public removeAll(c: Collection<T>): boolean {
        const oldSize = this.#sharedBackend.list.count();
        this.#sharedBackend.list = this.#sharedBackend.list.filter((value, index) => {
            return index >= this.#sharedBackend.start && index < this.#sharedBackend.end && !c.contains(value);
        });

        if (this.#sharedBackend.list.count() < oldSize) {
            this.changeSize(this.#sharedBackend.list.count() - oldSize);

            return true;
        }

        return false;
    }

    /**
     * Removes all of the elements of this collection that satisfy the given predicate.
     *
     * @param filter A predicate which returns true for elements to be removed.
     *
     * @returns true if any elements were removed.
     */
    public removeIf(filter: Predicate<T>): boolean {
        const oldSize = this.#sharedBackend.list.count();
        this.#sharedBackend.list = this.#sharedBackend.list.filterNot((value, index) => {
            return index >= this.#sharedBackend.start && index < this.#sharedBackend.end && filter.test(value);
        });

        if (this.#sharedBackend.list.count() < oldSize) {
            this.changeSize(this.#sharedBackend.list.count() - oldSize);

            return true;
        }

        return false;
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

        this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.start + fromIndex, delta);

        this.changeSize(-delta);
    }

    /**
     * Retains only the element in this list that are contained in the specified collection. In other words, removes
     * from this list all of its elements that are not contained in the specified collection.
     *
     * @param c The collection containing elements to be retained in this list.
     *
     * @returns true if this list changed as a result of the call.
     */
    public retainAll(c: Collection<T>): boolean {
        const oldSize = this.#sharedBackend.list.count();
        this.#sharedBackend.list = this.#sharedBackend.list.filter((value, index) => {
            return index >= this.#sharedBackend.start && index < this.#sharedBackend.end && c.contains(value);
        });

        if (this.#sharedBackend.list.count() < oldSize) {
            this.changeSize(this.#sharedBackend.list.count() - oldSize);

            return true;
        }

        return false;
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
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException();
        }

        const result = this.#sharedBackend.list.get(this.#sharedBackend.start + index)!;
        this.#sharedBackend.list = this.#sharedBackend.list.set(this.#sharedBackend.start + index, element);

        return result;
    }

    /**
     * @returns The number of elements in this list.
     */
    public size(): number {
        return this.#sharedBackend.end - this.#sharedBackend.start;
    }

    public spliterator(): Spliterator<T> {
        throw new NotImplementedError();
    }

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     * (If fromIndex and toIndex are equal, the returned list is empty.) The returned list is backed by this list, so
     * non-structural changes in the returned list are reflected in this list, and vice-versa. The returned list
     * supports  all of the optional list operations supported by this list.
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
        if (fromIndex < 0 || toIndex > this.size()) {
            throw new IndexOutOfBoundsException();
        }

        if (fromIndex > toIndex) {
            throw new IllegalArgumentException();
        }

        const list = new AbstractList<T>({
            list: this.#sharedBackend.list,
            start: this.#sharedBackend.start + fromIndex,
            end: this.#sharedBackend.start + toIndex,
            updateEnd: (delta) => {
                this.changeSize(delta);
            },
        });
        list.modCount = this.modCount;

        return list;
    }

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element).
     *
     * @returns An array containing all of the elements in this list in proper sequence.
     */
    public toArray(): T[];
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
    public toArray<T2 extends T>(a: T2[]): T2[];
    public toArray<T2 extends T>(a?: T2[]): T2[] | T[] {
        if (!a || a.length > this.size()) {
            return this.#sharedBackend.list.slice(this.#sharedBackend.start, this.#sharedBackend.end).toArray();
        }

        // The array is big enough, to hold all elements.
        this.copyToArray(a, 0);

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
    public toString(): JavaString {
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
        clone.#sharedBackend = {
            ...this.#sharedBackend,
            list: this.#sharedBackend.list.slice(),
        };
        clone.modCount = this.modCount;

        return clone;
    }

    /**
     * Copies the elements of this list into the specified array.
     *
     * @param array The target array. It must be large enough to hold all elements of this list.
     * @param index A start index in the target array.
     *
     * @throws IndexOutOfBoundsException if the index is either < 0, larger than the target array size, or if
     *         the list size + the start index exceeds the target array upper bound.
     */
    protected copyToArray(array: T[], index: number): void {
        if (index < 0 || index >= array.length) {
            throw new IndexOutOfBoundsException();
        }

        if (index + this.size() > array.length) {
            throw new IndexOutOfBoundsException();
        }

        const end = this.#sharedBackend.end;
        this.#sharedBackend.list.forEach((value, i) => {
            if (i >= this.#sharedBackend.start && i < end) {
                array[index++] = value;
            }
        });

        // If the target array is bigger than the list, we need to set the entry following the last set element to null.
        if (array.length > this.size()) {
            array[this.size()] = null as T;
        }
    }

    /**
     * Applies the given value to this list and notifies the shared backend about the change.
     *
     * @param delta The delta to apply.
     */
    private changeSize(delta: number): void {
        ++this.modCount;
        this.#sharedBackend.end += delta;

        this.#sharedBackend.updateEnd(delta);
    }
}
