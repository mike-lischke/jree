/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";

import { isEquatable, java, JavaIterator, NotImplementedError, S } from "../..";
import { JavaObject } from "../lang/Object";
import { IListIteratorBackend, ListIteratorImpl } from "./ListIteratorImpl";

/** The Vector class implements a growable array of objects. */
export class Vector<T> extends JavaObject implements java.util.List<T>, java.util.RandomAccess,
    java.lang.Cloneable<Vector<T>>, java.io.Serializable {

    #sharedBackend: IListIteratorBackend<T> = {
        list: List<T>(),
        start: 0,
    };

    /**
     * Constructs an empty vector so that its internal data array has size 10 and its standard capacity increment is
     * zero.
     *
     * @param initialCapacity the initial capacity of the vector
     * @param capacityIncrement the amount by which the capacity is increased when the vector overflows
     */
    public constructor(initialCapacity?: number, capacityIncrement?: number) {
        super();
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.#sharedBackend.list.values();
    }

    /**
     * Inserts the specified element at the specified position in this Vector.
     *
     * @param index the index at which the specified element is to be inserted
     * @param element element to be inserted
     * @throws ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index > size())
     */
    public add(index: number, element: T): void;
    /** Appends the specified element to the end of this Vector. */
    public add(element: T): boolean;
    public add(indexOrElement: number | T, element?: T): void | boolean {
        if (element === undefined) {
            this.#sharedBackend.list = this.#sharedBackend.list.push(indexOrElement as T);
        } else {
            const index = indexOrElement as number;
            const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;
            if (index < 0 || index >= end) {
                throw new java.lang.ArrayIndexOutOfBoundsException();
            }
            this.#sharedBackend.list = this.#sharedBackend.list.splice(indexOrElement as number, 0, element);
        }

        this.#sharedBackend.end && ++this.#sharedBackend.end;

        return true;
    }

    /**
     * Inserts all of the elements in the specified Collection into this Vector at the specified position.
     *
     * @param index the index at which to insert the first element from the specified Collection
     * @param elements the elements to be inserted into this Vector
     *
     * @returns true if this Vector changed as a result of the call
     *
     */
    public addAll(index: number, elements: java.util.Collection<T>): boolean;
    /**
     * Appends all of the elements in the specified Collection to the end of this Vector, in the order that they are
     * returned by the specified Collection's Iterator.
     *
     * @param elements the elements to be inserted into this Vector
     *
     * @returns true if this Vector changed as a result of the call
     */
    public addAll(elements: java.util.Collection<T>): boolean;
    public addAll(...args: unknown[]): boolean {
        let count = 0;
        switch (args.length) {
            case 1: {
                const elements = args[0] as java.util.Collection<T>;
                count = elements.size();
                this.#sharedBackend.list = this.#sharedBackend.list.push(...elements.toArray());

                break;
            }

            case 2: {
                const index = args[0] as number;
                const elements = args[1] as java.util.Collection<T>;
                count = elements.size();
                const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
                if (index < 0 || index >= size) {
                    throw new java.lang.ArrayIndexOutOfBoundsException();
                }

                this.#sharedBackend.list = this.#sharedBackend.list.splice(index, 0, ...elements.toArray());

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException();
            }
        }

        this.#sharedBackend.end && (this.#sharedBackend.end += count);

        return true;
    }

    /**
     * Adds the specified component to the end of this vector, increasing its size by one.
     *
     * @param element the component to be added
     */
    public addElement(element: T): void {
        this.add(element);
    }

    /**
     * Returns the current capacity of this vector.
     *
     * @returns the current capacity (the length of its internal data array, kept private so as not to be
     *          modified by the user)
     */
    public capacity(): number {
        return this.#sharedBackend.list.size;
    }

    /**
     * Removes all of the elements from this Vector. The Vector will be empty after this call returns.
     */
    public clear(): void {
        if (this.#sharedBackend.start === 0 && this.#sharedBackend.end === undefined) {
            // Fast path.
            this.#sharedBackend.list = List();
            this.#sharedBackend.end = undefined;
        } else {
            this.removeRange(0, this.size());
        }
    }

    /**
     * Returns a clone of this Vector. The copy will contain a reference to a clone of the internal data array, not a
     * reference to the original internal data array of this Vector object.
     *
     * @returns a clone of this Vector
     */
    public clone(): Vector<T> {
        const clone = new Vector<T>();
        clone.#sharedBackend.list = this.#sharedBackend.list.slice();
        clone.#sharedBackend.start = this.#sharedBackend.start;
        clone.#sharedBackend.end = this.#sharedBackend.end;

        return clone;
    }

    /**
     * Returns true if this Vector contains the specified element.
     *
     * @param element the element whose presence in this Vector is to be tested
     *
     * @returns true if this Vector contains the specified element
     */
    public contains(element: T): boolean {
        return this.#sharedBackend.list.indexOf(element) !== -1;
    }

    /**
     * Returns true if this Vector contains all of the elements in the specified Collection.
     *
     * @param elements the elements whose presence in this Vector is to be tested
     *
     * @returns true if this Vector contains all of the elements in the specified Collection
     */
    public containsAll(elements: java.util.Collection<T>): boolean {
        return this.#sharedBackend.list.isSuperset(elements);
    }

    /**
     * Copies the components of this vector into the specified array.
     * The item at index k in this vector is copied into component k of the array.
     * The array must be big enough to hold all the objects in this vector, else an IndexOutOfBoundsException is thrown.
     * If the array is longer than the vector, the array element following the end of the collection is set to null.
     * This method is identical in functionality to the toArray() method (which is part of the Collection interface).
     *
     * @throws IndexOutOfBoundsException - if copying would cause access of data outside array bounds.
     * @throws NullPointerException - if the specified array is null.
     *
     * @param anArray the array into which the components get copied
     */
    public copyInto(anArray: T[]): void {
        const length = (this.#sharedBackend.end ?? anArray.length) - this.#sharedBackend.start;
        if (anArray.length < length) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        for (let i = 0; i < length; ++i) {
            anArray[i] = this.#sharedBackend.list.get(i + this.#sharedBackend.start)!;
        }
    }

    /**
     * Returns the element at the specified position in this Vector.
     *
     * @param index the index of the element to return
     *
     * @returns the element at the specified position in this Vector
     */
    public elementAt(index: number): T | undefined {
        if (index < 0 || index >= this.#sharedBackend.list.size) {
            throw new java.lang.ArrayIndexOutOfBoundsException(index);
        }

        return this.#sharedBackend.list.get(index);
    }

    /**
     * Returns an enumeration of the components of this vector.
     */
    public elements(): java.util.Enumeration<T> {
        throw new NotImplementedError();
    }

    /**
     * Increases the capacity of this Vector, if necessary, to ensure that it can hold at least the number of components
     * specified by the minimum capacity argument.
     *
     * @param minCapacity the desired minimum capacity
     */
    public ensureCapacity(minCapacity: number): void {
        // Nothing to do here.
    }

    /**
     * Compares the specified Object with this Vector for equality. Returns true if and only if the specified Object is
     * also a Vector, both Vectors have the same size, and all corresponding pairs of elements in the two Vectors are
     * equal. In other words, two Vectors are defined to be equal if they contain the same elements in the same order.
     * This definition ensures that the equals method works properly across different implementations of the Vector
     * class.
     *
     * @param other the Object to be compared for equality with this Vector
     *
     * @returns true if the specified Object is equal to this Vector
     */
    public equals(other: unknown): boolean {
        if (other instanceof Vector) {
            return this.#sharedBackend.list.equals(other.#sharedBackend.list);
        }

        return false;
    }

    /**
     * Returns the first component (the item at index 0) of this vector.
     * Throws a NoSuchElementException if this vector has no components.
     *
     * @returns the first component of this vector
     */
    public firstElement(): T {
        if (this.#sharedBackend.list.size === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.#sharedBackend.list.first();
    }

    /**
     * Performs the given action for each element of the Iterable until all elements have been processed or the action
     * throws an exception.
     *
     * @param action the action to be performed for each element
     */
    public forEach(action: (element: T) => void): void {
        const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;
        for (let i = this.#sharedBackend.start; i < end; ++i) {
            action(this.#sharedBackend.list.get(i)!);
        }
    }

    /**
     * Returns the element at the specified position in this Vector.
     * Throws an IndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     * This method is identical in functionality to the get method (which is part of the List interface).
     * This method exists in conjunction with the set method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @param index the index of the element to return
     *
     * @returns the element at the specified position in this Vector
     */
    public get(index: number): T {
        if (index < 0 || index >= this.#sharedBackend.list.size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.#sharedBackend.list.get(index)!;
    }

    /**
     * Returns the hash code value for this Vector.
     * This ensures that v1.equals(v2) implies that v1.hashCode() == v2.hashCode() for any two Vectors v1 and v2,
     * as required by the general contract of Object.hashCode.
     * Note that the hash code values change if the elements in the Vector are changed. This means that the hash code
     * values do not uniquely identify the Vector objects.
     *
     * @returns the hash code value for this Vector
     */
    public hashCode(): number {
        return this.#sharedBackend.list.hashCode();
    }

    /**
     * Returns the index of the first occurrence of the specified element in this Vector, or -1 if this Vector does not
     * contain the element.
     * More formally, returns the lowest index i such that (o==null ? get(i)==null : o.equals(get(i))),
     * or -1 if there is no such index.
     *
     * @param element the element to search for
     * @param index the index to start the search from
     *
     * @throws IndexOutOfBoundsException - if the specified index is negative or not less than the current size of this
     *         Vector.
     * @returns the index of the first occurrence of the specified element in this Vector, or -1 if this Vector does not
     * contain the element.
     */
    public indexOf(element: T, index?: number): number {
        const start = this.#sharedBackend.start + (index ?? 0);
        if (start < 0 || start >= this.#sharedBackend.list.size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (isEquatable(element)) {
            return this.#sharedBackend.list.findIndex((e, i) => {
                return i >= start && element.equals(e);
            });
        } else {
            return this.#sharedBackend.list.findIndex((e, i) => {
                return i >= start && element === e;
            });
        }
    }

    /**
     * Inserts the specified object as a component in this vector at the specified index.
     *
     * @param element the element to insert
     * @param index the index at which the specified element is to be inserted
     */
    public insertElementAt(element: T, index: number): void {
        this.add(index, element);
    }

    /**
     * Returns true if this Vector contains no elements.
     *
     * @returns true if this Vector contains no elements
     */
    public isEmpty(): boolean {
        return this.#sharedBackend.list.size === 0;
    }

    public iterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#sharedBackend.list.values());
    }

    /**
     * Returns the last component of the vector.
     * Throws a NoSuchElementException if this vector has no components.
     * This method is identical in functionality to the get method (which is part of the List interface).
     * This method exists in conjunction with the set method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @returns the last component of the vector
     */
    public lastElement(): T {
        if (this.#sharedBackend.list.size === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.#sharedBackend.list.last();
    }

    /**
     * Returns the index of the last occurrence of the specified element in this Vector, or -1 if this Vector does not
     * contain the element.
     * More formally, returns the highest index i such that (o==null ? get(i)==null : o.equals(get(i))),
     * or -1 if there is no such index.
     * Throws an IndexOutOfBoundsException if the specified index is negative.
     *
     * @param element the element to search for
     * @param index the index to start the search from
     *
     * @returns the index of the last occurrence of the specified element in this Vector, or -1 if this Vector does not
     */
    public lastIndexOf(element: T, index?: number): number {
        const start = this.#sharedBackend.start + (index ?? this.#sharedBackend.list.size - 1);
        if (start < 0 || start >= this.#sharedBackend.list.size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        if (isEquatable(element)) {
            return this.#sharedBackend.list.reduceRight((index, e, i) => {
                return index === -1 && i <= start && element.equals(e) ? i : index;
            }, -1);
        } else {
            return this.#sharedBackend.list.reduceRight((index, e, i) => {
                return index === -1 && i <= start && element === e ? i : index;
            }, -1);
        }
    }

    /**
     * Returns a list iterator over the elements in this list (in proper sequence).
     * The list iterator is initially positioned before the first element in the list.
     * The specified index indicates the first element that would be returned by an initial call to the next method.
     * An initial call to the previous method would return the element with the specified index minus one.
     * Throws an IndexOutOfBoundsException if the specified index is out of range (index < 0 || index > size()).
     *
     * @param index the index of the first element to be returned from the list iterator (by a call to the next method)
     *
     * @returns a list iterator over the elements in this list (in proper sequence)
     */
    public listIterator(index?: number): java.util.ListIterator<T> {
        return new ListIteratorImpl(this.#sharedBackend, index);
    }

    /**
     * Removes the element at the specified position in this Vector.
     * Shifts any subsequent elements to the left (subtracts one from their indices).
     * Throws ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     *
     * @param index the index of the element to be removed
     * @returns the element that was removed from the Vector
     */
    public remove(index: number): T;
    /**
     * Removes the first occurrence of the specified element from this Vector, if it is present.
     * If this Vector does not contain the element, it is unchanged.
     *
     * @param element the element to be removed from this Vector, if present
     *
     * @returns true if this Vector contained the specified element
     */
    public remove(element: T): boolean;
    public remove(...args: unknown[]): T | boolean {
        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    // T could also be a number, but this would create an ambiguity here.
                    // We solve this by assuming that a number is always an index.
                    const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
                    if (args[0] < 0 || args[0] >= size) {
                        throw new java.lang.ArrayIndexOutOfBoundsException();
                    }

                    const index = this.#sharedBackend.start + args[0];
                    const element = this.#sharedBackend.list.get(index)!;
                    this.#sharedBackend.list = this.#sharedBackend.list.remove(index);
                    this.#sharedBackend.end && --this.#sharedBackend.end;

                    return element;
                }

                const index = this.#sharedBackend.list.indexOf(args[0] as T);
                if (index !== -1) {
                    this.#sharedBackend.list = this.#sharedBackend.list.remove(index);
                    this.#sharedBackend.end && --this.#sharedBackend.end;

                    return true;
                }

                return false;
            }

            default: {
                throw new java.lang.IllegalArgumentException();
            }
        }
    }

    /**
     * Removes from this Vector all of its elements that are contained in the specified Collection.
     *
     * @param elements the elements to be removed from this Vector
     *
     * @returns true if this Vector changed as a result of the call
     */
    public removeAll(elements: java.util.Collection<T>): boolean {
        let count = 0;
        const list = this.#sharedBackend.list.withMutations((list) => {
            for (const element of elements) {
                const index = list.indexOf(element);
                if (index !== -1) {
                    list.remove(index);
                    ++count;
                }
            }
        });

        if (list !== this.#sharedBackend.list) {
            this.#sharedBackend.list = list;
            this.#sharedBackend.end && (this.#sharedBackend.end -= count);

            return true;
        }

        return false;
    }

    /**
     * Removes all of the elements from this Vector.
     * The Vector will be empty after this call returns.
     * This method is identical in functionality to the clear method (which is part of the List interface).
     * This method exists in conjunction with the addElement method so that the Vector class can implement the
     * java.util.List interface.
     */
    public removeAllElements(): void {
        this.clear();
    }

    /**
     * Removes the first occurrence of the specified element from this Vector, if it is present.
     *
     * @param element the element to be removed from this Vector, if present
     *
     * @returns the element that was removed from the Vector
     */
    public removeElement(element: T): boolean {
        return this.remove(element);
    }

    /**
     * Removes the element at the specified position in this Vector.
     * Throws ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     *
     * @param index the index of the element to be removed
     */
    public removeElementAt(index: number): void {
        const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
        if (index < this.#sharedBackend.start || index >= size) {
            throw new java.lang.ArrayIndexOutOfBoundsException();
        }

        this.#sharedBackend.list = this.#sharedBackend.list.remove(this.#sharedBackend.start + index);
    }

    /**
     * Removes all of the elements of this collection that satisfy the given predicate.
     * Errors or runtime exceptions thrown during iteration or by the predicate are relayed to the caller.
     *
     * @param filter a predicate which returns true for elements to be removed
     *
     * @returns true if any elements were removed
     */
    public removeIf(filter: (element: T) => boolean): boolean {
        const list = this.#sharedBackend.list.filter((value) => {
            return !filter(value);
        });

        if (list !== this.#sharedBackend.list) {
            this.#sharedBackend.list = list;

            return true;
        }

        return false;
    }

    /**
     * Removes from this Vector all of the elements whose index is between fromIndex, inclusive, and toIndex, exclusive.
     *
     * @param fromIndex the index of the first element to be removed
     * @param toIndex the index after the last element to be removed
     *
     * @throws ArrayIndexOutOfBoundsException if fromIndex or toIndex out of range
     *      (fromIndex < 0 || toIndex > size() || fromIndex > toIndex)
     */
    public removeRange(fromIndex: number, toIndex: number): void {
        const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
        if (fromIndex < 0 || toIndex > size || fromIndex > toIndex) {
            throw new java.lang.ArrayIndexOutOfBoundsException();
        }

        this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.start + fromIndex,
            toIndex - fromIndex);
    }

    /**
     * Replaces each element of this list with the result of applying the operator to that element.
     *
     * @param operator the operator to apply to each element
     */
    public replaceAll(operator: (element: T) => T): void {
        this.#sharedBackend.list = this.#sharedBackend.list.map(operator);
    }

    /**
     * Retains only the elements in this Vector that are contained in the specified Collection.
     *
     * @param elements the elements to be retained in this Vector
     *
     * @returns true if this Vector changed as a result of the call
     */
    public retainAll(elements: java.util.Collection<T>): boolean {
        const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;
        const list = this.#sharedBackend.list.filter((value, index) => {
            if (index < this.#sharedBackend.start || index >= end) {
                return true;
            }

            return elements.contains(value);
        });

        if (list !== this.#sharedBackend.list) {
            this.#sharedBackend.end && (this.#sharedBackend.end -= this.#sharedBackend.list.size + list.size);
            this.#sharedBackend.list = list;

            return true;
        }

        return false;
    }

    /**
     * Replaces the element at the specified position in this Vector with the specified element.
     * Throws an IndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     *
     * @param index the index of the element to replace
     * @param element the element to be stored at the specified position
     *
     * @returns the element previously at the specified position
     */
    public set(index: number, element: T): T {
        const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
        if (index < this.#sharedBackend.start || index >= size) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const oldElement = this.#sharedBackend.list.get(this.#sharedBackend.start + index)!;
        this.#sharedBackend.list = this.#sharedBackend.list.set(this.#sharedBackend.start + index, element);

        return oldElement;
    }

    /**
     * Sets the element at the specified position in this Vector to be the specified object.
     * The previous component at that position is discarded.
     * Throws an ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     * This method is identical in functionality to the set method (which is part of the List interface).
     * Note that the set method reverses the order of the parameters, to more closely match array usage.
     * This method exists in conjunction with the get method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @param element what the element is to be set to
     * @param index the index of the element to be modified
     */
    public setElementAt(element: T, index: number): void {
        this.set(index, element);
    }

    /**
     * Sets the size of this Vector.
     * If the new size is greater than the current size, new null items are added to the end of the Vector.
     * If the new size is less than the current size, all components at index newSize and greater are discarded.
     * Throws an ArrayIndexOutOfBoundsException if the new size is negative.
     *
     * @param newSize the new size of this Vector
     */
    public setSize(newSize: number): void {
        if (newSize < 0) {
            throw new java.lang.ArrayIndexOutOfBoundsException();
        }

        this.#sharedBackend.list = this.#sharedBackend.list.setSize(newSize);
    }

    /**
     * Returns the number of components in this Vector.
     * This method is identical in functionality to the size method (which is part of the List interface).
     * This method exists in conjunction with the setSize method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @returns the number of components in this Vector
     */
    public size(): number {
        return (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
    }

    /**
     * Returns a view of the portion of this Vector between the specified fromIndex, inclusive, and toIndex, exclusive.
     * The returned Vector is backed by this Vector, so non-structural changes in the returned Vector are reflected in
     * this Vector, and vice-versa. The returned Vector supports all of the optional Vector operations supported by
     * this Vector.
     * Throws an IndexOutOfBoundsException if fromIndex or toIndex out of range
     *      (fromIndex < 0 || toIndex > size || fromIndex > toIndex).
     * This method eliminates the need for explicit range operations (of the sort that commonly exist for arrays).
     *
     * @param fromIndex low endpoint (inclusive) of the subList
     * @param toIndex high endpoint (exclusive) of the subList
     *
     * @returns a view of the specified range within this Vector
     */
    public subList(fromIndex: number, toIndex: number): java.util.List<T> {
        const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
        if (fromIndex < 0 || toIndex > size || fromIndex > toIndex) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const subList = new Vector<T>();
        subList.#sharedBackend = { ...this.#sharedBackend };
        subList.#sharedBackend.start += fromIndex;
        subList.#sharedBackend.end = this.#sharedBackend.start + toIndex;

        return subList;
    }

    /**
     * Creates a late-binding and fail-fast Spliterator over the elements in this list.
     */
    public spliterator(): java.util.Spliterator<T> {
        //return new JavaSpliterator(this.#sharedBackend.list.spliterator());
        throw new NotImplementedError();
    }

    /**
     * @returns an array containing all of the elements in this Vector in the correct order
     */
    public toArray(): T[] {
        return this.#sharedBackend.list.toArray();
    }

    /**
     * Returns a string representation of this Vector, containing the String representation of each element.
     *
     * @returns a string representation of this Vector
     */
    public toString(): java.lang.String {
        const buffer = new java.lang.StringBuffer();
        buffer.append(S`[`);
        for (let i = 0; i < this.size(); i++) {
            buffer.append(java.lang.String.valueOf(this.get(i)));
            if (i < this.size() - 1) {
                buffer.append(S`, `);
            }
        }
        buffer.append(S`]`);

        return buffer.toString();
    }

    public trimToSize(): void {
        // Nothing to do here.
    }
}
