/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";
import { JavaIterator } from "../../JavaIterator";

import { java, NotImplementedError } from "../..";

import { JavaObject } from "../lang/Object";
import { IListIteratorBackend, ListIteratorImpl } from "./ListIteratorImpl";

/**
 * Implementation of the List and Deque interfaces. Implements all optional list operations, and
 * permits all elements (including null).
 *
 * In Java this is a doubly-linked list, but this class uses immutable.js for the actual implementation.
 */
export class LinkedList<T> extends JavaObject implements java.io.Serializable, java.lang.Cloneable<LinkedList<T>>,
    java.util.Deque<T>, java.util.List<T> {
    #sharedBackend: IListIteratorBackend<T>;

    /** Constructs an empty list. */
    public constructor();
    /**
     * Constructs a list containing the elements of the specified collection, in the order they are returned by the
     * collection's iterator.
     *
     * @param c The collection whose elements are to be placed into this list.
     */
    public constructor(c: java.util.Collection<T>);
    public constructor(c?: Iterable<T>) {
        super();

        this.#sharedBackend = {
            list: List(c),
            start: 0,
        };
    }

    public *[Symbol.iterator](): IterableIterator<T> {
        yield* this.#sharedBackend.list;
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public add(e: T): boolean;
    /**
     * Inserts the specified element at the specified position in this list.
     *
     * @param index The index at which the specified element is to be inserted.
     * @param element The element to insert.
     *
     * @throws IndexOutOfBoundsException if the index is out of range (index < 0 || index > size())
     */
    public add(index: number, element: T): void;
    public add(...args: unknown[]): boolean | void {
        switch (args.length) {
            case 1: {
                this.#sharedBackend.list = this.#sharedBackend.list.push(args[0] as T);

                return true;
            }
            case 2: {
                const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
                const index = args[0] as number;
                if (index < 0 || index >= size) {
                    throw new java.lang.IndexOutOfBoundsException();
                }

                this.#sharedBackend.list = this.#sharedBackend.list.insert(index, args[1] as T);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException();
            }
        }
    }

    /**
     * Inserts the specified element at the front of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public addAll(c: java.util.Collection<T>): boolean;
    /**
     * Inserts all of the elements in the specified collection into this list, starting at the specified position.
     *
     * @param index The index at which to insert the first element from the specified collection.
     * @param c The collection containing elements to be added to this list.
     *
     * @throws IndexOutOfBoundsException if the index is out of range (index < 0 || index > size())
     *
     * @returns true if this list changed as a result of the call.
     */
    public addAll(index: number, c: java.util.Collection<T>): boolean;
    public addAll(...args: unknown[]): boolean {
        switch (args.length) {
            case 1: {
                const collection = args[0] as java.util.Collection<T>;
                this.#sharedBackend.list = this.#sharedBackend.list.push(...collection);
                this.#sharedBackend.end && (this.#sharedBackend.end += collection.size());

                return true;
            }

            case 2: {
                const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
                const index = args[0] as number;
                if (index < 0 || index >= size) {
                    throw new java.lang.IndexOutOfBoundsException();
                }

                const collection = args[1] as java.util.Collection<T>;
                this.#sharedBackend.list = this.#sharedBackend.list.splice(index, 0, ...collection);
                this.#sharedBackend.end && (this.#sharedBackend.end += collection.size());

                return true;
            }

            default: {
                throw new java.lang.IllegalArgumentException();
            }
        }
    }

    /**
     * Inserts the specified element at the beginning of this list.
     *
     * @param e The element to add.
     */
    public addFirst(e: T): void {
        this.#sharedBackend.list = this.#sharedBackend.list.unshift(e);
        this.#sharedBackend.end && ++this.#sharedBackend.end;
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e The element to append.
     */
    public addLast(e: T): void {
        this.#sharedBackend.list = this.#sharedBackend.list.push(e);
        this.#sharedBackend.end && ++this.#sharedBackend.end;
    }

    /** Removes all of the elements from this list. */
    public clear(): void {
        if (this.#sharedBackend.start === 0 && this.#sharedBackend.end === undefined) {
            // Fast path: we can just create a new list.
            this.#sharedBackend.list = List();
        } else {
            // Otherwise, remove the range spanned by the start and end values.
            const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;
            this.#sharedBackend.list = this.#sharedBackend.list.splice(this.#sharedBackend.start,
                end - this.#sharedBackend.start);
        }
    }

    /** @returns a shallow copy of this LinkedList. */
    public clone(): LinkedList<T> {
        const clone = new LinkedList<T>();
        clone.#sharedBackend.list = this.#sharedBackend.list.slice();
        clone.#sharedBackend.start = this.#sharedBackend.start;
        clone.#sharedBackend.end = this.#sharedBackend.end;

        return clone;

    }

    /**
     * @param o The element to search for.
     *
     * @returns true if this list contains the specified element.
     */
    public contains(o: T): boolean {
        return this.#sharedBackend.list.contains(o);
    }

    /** @returns an iterator over the elements in this deque in reverse sequential order. */
    public descendingIterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#sharedBackend.list.reverse()[Symbol.iterator]());
    }

    /** @returns but does not remove, the head (first element) of this list. */
    public element(): T {
        if (this.size() === 0) {
            throw new java.lang.NoSuchElementException();
        }

        return this.#sharedBackend.list.get(this.#sharedBackend.start)!;
    }

    /**
     * @returns the element at the specified position in this list.
     *
     * @param index The index in the list.
     */
    public get(index: number): T {
        if (index < 0 || index >= this.size()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return this.#sharedBackend.list.get(index)!;
    }

    /** @returns the first element in this list. */
    public getFirst(): T {
        return this.element();
    }

    /** @returns the last element in this list. */
    public getLast(): T {
        if (this.size() === 0) {
            throw new java.lang.NoSuchElementException();
        }

        const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;

        return this.#sharedBackend.list.get(end - 1)!;
    }

    /**
     * @param o The element to search for.
     *
     * @returns the first index of the specified element in this list, or -1 if this list does not contain the element.
     */
    public indexOf(o: T): number {
        return this.#sharedBackend.list.indexOf(o) - this.#sharedBackend.start;
    }

    /**
     * @returns the index of the last occurrence of the specified element in this list, or - 1 if this list does not
     * contain the element.
     *
     * @param o The element to search for.
     */
    public lastIndexOf(o: T): number {
        return this.#sharedBackend.list.lastIndexOf(o) - this.#sharedBackend.start;
    }

    /**
     * @returns a list-iterator of the elements in this list (in proper sequence), starting at the specified
     * position in the list.
     *
     * @param index The start index.
     */
    public listIterator(index: number): java.util.ListIterator<T> {
        if (index < 0 || index >= this.size()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        return new ListIteratorImpl(this.#sharedBackend, this.#sharedBackend.start + index);
    }

    /**
     * Adds the specified element as the tail (last element) of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public offer(e: T): boolean {
        this.addLast(e);

        return true;
    }

    /**
     * Inserts the specified element at the front of this list.
     *
     * @param e the element to add.
     *
     * @returns true
     */
    public offerFirst(e: T): boolean {
        this.addFirst(e);

        return true;
    }

    /**
     * Inserts the specified element at the end of this list.
     *
     * @param e The element to add.
     *
     * @returns true
     */
    public offerLast(e: T): boolean {
        return this.offer(e);
    }

    /** @returns but does not remove, the head(first element) of this list. */
    public peek(): T {
        return this.element();
    }

    /** @returns but does not remove, the first element of this list, or returns null if this list is empty. */
    public peekFirst(): T | null {
        return this.#sharedBackend.list.first() ?? null;
    }

    /**
     * Retrieves, but does not remove, the last element of this list, or returns null if this list is empty.
     *
     * @returns the last element or null, if the list is empty.
     */
    public peekLast(): T | null {
        return this.#sharedBackend.list.last() ?? null;
    }

    /**
     * Retrieves and removes the head (first element) of this list.
     *
     * @returns The first element, extracted from the list.
     */
    public poll(): T {
        const result = this.element();
        this.#sharedBackend.list = this.#sharedBackend.list.shift();
        this.#sharedBackend.end && --this.#sharedBackend.end;

        return result;
    }

    /**
     * Retrieves and removes the first element of this list, or returns null if this list is empty.
     *
     * @returns The first entry.
     */
    public pollFirst(): T | null {
        if (this.size() === 0) {
            return null;
        }

        const result = this.element();
        this.#sharedBackend.list = this.#sharedBackend.list.shift();
        this.#sharedBackend.end && --this.#sharedBackend.end;

        return result;
    }

    /**
     *  Retrieves and removes the last element of this list, or returns null if this list is empty.
     *
     * @returns The last entry.
     */
    public pollLast(): T | null {
        if (this.size() === 0) {
            return null;
        }

        return this.removeLast();
    }

    /**
     * Pops an element from the stack represented by this list.
     * In other words, removes and returns the first element of this list.
     *
     * @returns The previously last element.
     */
    public pop(): T {
        return this.removeFirst();
    }

    /**
     * Pushes an element onto the stack represented by this list.
     * In other words, inserts the element at the front of this list.
     *
     * @param e The element to add.
     */
    public push(e: T): void {
        this.addFirst(e);
    }

    /** Removes first element from this list. */
    public remove(): T;
    /** Removes the element at the specified position in this list. */
    public remove(index: number): T;
    /** Removes the first occurrence of the specified element from this list, if it is present. */
    public remove(o: T): boolean;
    public remove(...args: unknown[]): T | boolean {
        switch (args.length) {
            case 0: {
                return this.pop();
            }

            case 1: {
                if (typeof args[0] === "number") {
                    if (args[0] < 0 || args[0] >= this.size()) {
                        throw new java.lang.IndexOutOfBoundsException();
                    }

                    const index = args[0] + this.#sharedBackend.start;
                    const element = this.#sharedBackend.list.get(index)!;
                    this.#sharedBackend.list = this.#sharedBackend.list.remove(index);
                    this.#sharedBackend.end && --this.#sharedBackend.end;

                    return element;
                } else {
                    return this.removeFirstOccurrence(args[0] as T);
                }
            }

            default: {
                throw new java.lang.IllegalArgumentException();
            }
        }
    }

    /**
     * Removes and returns the first element from this list.
     *
     * @throws NoSuchElementException if the list is empty.
     *
     * @returns the previously first element.
     */
    public removeFirst(): T {
        const result = this.element();
        this.#sharedBackend.list = this.#sharedBackend.list.shift();
        this.#sharedBackend.end && --this.#sharedBackend.end;

        return result;
    }

    /**
     * Removes the first occurrence of the specified element in this list(when traversing the list from head to tail).
     *
     * @param o The element to remove.
     *
     * @returns true if the element was in the list.
     */
    public removeFirstOccurrence(o: T): boolean {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        const index = this.#sharedBackend.list.indexOf(o);
        if (index > -1) {
            this.#sharedBackend.list = this.#sharedBackend.list.remove(index);
            this.#sharedBackend.end && --this.#sharedBackend.end;
        }

        return index > -1;
    }

    /**
     *  Removes and returns the last element from this list.
     *
     * @returns the previously last element.
     */
    public removeLast(): T {
        const result = this.getLast();
        this.#sharedBackend.list = this.#sharedBackend.list.pop();
        this.#sharedBackend.end && --this.#sharedBackend.end;

        return result;
    }

    /**
     * Removes the last occurrence of the specified element in this list(when traversing the list from head to tail).
     *
     * @param o The element to remove.
     *
     * @returns true if the element was in the list.
     * @throws NoSuchElementException if the list is empty.
     */
    public removeLastOccurrence(o: T): boolean {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        const index = this.#sharedBackend.list.lastIndexOf(o);
        if (index > -1) {
            this.#sharedBackend.list = this.#sharedBackend.list.remove(index);
            this.#sharedBackend.end && --this.#sharedBackend.end;
        }

        return index > -1;
    }

    /**
     * Replaces the element at the specified position in this list with the specified element.
     *
     * @param index The index to change.
     * @param element The new element to set at the given index.
     *
     * @returns The previous element at that index.
     */
    public set(index: number, element: T): T {
        const result = this.get(index);

        this.#sharedBackend.list = this.#sharedBackend.list.set(index, element);

        return result;
    }

    /** @returns the number of elements in this list. */
    public size(): number {
        return (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
    }

    /**
     * Creates a late-binding and fail-fast Spliterator over the elements in this list.
     */
    public spliterator(): java.util.Spliterator<T> {
        //return new JavaSpliterator(this.#sharedBackend.list.spliterator());
        throw new NotImplementedError();
    }

    /** Returns an array containing all of the elements in this list in proper sequence(from first to last element). */
    public toArray(): T[];
    /**
     * Returns an array containing all of the elements in this list in proper sequence(from first to last element)
     * the runtime type of the returned array is that of the specified array.
     */
    public toArray<U>(a: U[]): U[];
    public toArray<U>(_a?: U[]): T[] | U[] {
        return this.#sharedBackend.list.toArray();
    }

    /** @returns an iterator over the elements in this list in proper sequence. */
    public iterator(): java.util.Iterator<T> {
        return new JavaIterator(this.#sharedBackend.list[Symbol.iterator]());
    }

    /**
     * @param c The collection to check.
     * @returns true if this list contains the specified element.
     */
    public containsAll(c: java.util.Collection<T>): boolean {
        const end = this.#sharedBackend.end ?? this.#sharedBackend.list.size;

        return this.#sharedBackend.list.slice(this.#sharedBackend.start, end).isSuperset(c);
    }

    /** @returns true if this list contains no elements. */
    public isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Removes all of this collection's elements that are also contained in the specified collection.
     * After this call returns, this collection will contain no elements in common with the specified collection.
     *
     * @param c The collection to remove.
     *
     * @returns true if this collection changed as a result of the call.
     */
    public removeAll(c: java.util.Collection<T>): boolean {
        const list = this.#sharedBackend.list.filterNot((element) => {
            return c.contains(element);
        });

        const changeCount = this.#sharedBackend.list.count() - list.count();

        // Filtering always creates a new instance.
        this.#sharedBackend.list = list;
        this.#sharedBackend.end && (this.#sharedBackend.end -= changeCount);

        return changeCount > 0;
    }

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     * In other words, removes from this collection all of its elements that are not contained in the specified
     * collection.
     * After this call returns, this collection will contain no elements not contained in the specified collection.
     * If the specified collection is also a list, this operation effectively modifies this list so that its value
     * is the intersection of the two lists.
     *
     * @param c The collection to retain.
     *
     * @returns true if this collection changed as a result of the call.
     */
    public retainAll(c: java.util.Collection<T>): boolean {
        const list = this.#sharedBackend.list.filter((element) => {
            return c.contains(element);
        });

        const changeCount = this.#sharedBackend.list.count() - list.count();
        this.#sharedBackend.list = list;
        this.#sharedBackend.end && (this.#sharedBackend.end -= changeCount);

        return changeCount > 0;
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
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     * (If fromIndex and toIndex are equal, the returned list is empty.)
     * The returned list is backed by this list, so non-structural changes in the returned list are reflected in this
     * list, and vice-versa.
     * The returned list supports all of the optional list operations supported by this list.
     *
     * @param fromIndex low endpoint (inclusive) of the subList
     * @param toIndex high endpoint (exclusive) of the subList
     *
     * @returns a view of the specified range within this list
     */
    public subList(fromIndex: number, toIndex: number): java.util.List<T> {
        const size = (this.#sharedBackend.end ?? this.#sharedBackend.list.size) - this.#sharedBackend.start;
        if (fromIndex < 0 || toIndex > size) {
            throw new java.lang.IndexOutOfBoundsException();
        }
        if (fromIndex > toIndex) {
            throw new java.lang.IllegalArgumentException();
        }

        const subList = new LinkedList<T>();
        subList.#sharedBackend.list = this.#sharedBackend.list;
        subList.#sharedBackend = { ...this.#sharedBackend };
        subList.#sharedBackend.start += fromIndex;
        subList.#sharedBackend.end = this.#sharedBackend.start + toIndex;

        return subList;
    }

    public hashCode(): number {
        return this.#sharedBackend.list.hashCode();
    }

    public equals(obj: unknown): boolean {
        if (this === obj) {
            return true;
        }

        if (!(obj instanceof LinkedList)) {
            return false;
        }

        return this.#sharedBackend.list.equals(obj.#sharedBackend.list);
    }
}
