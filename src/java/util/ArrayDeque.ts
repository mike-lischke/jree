/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { Serializable } from "../io/Serializable";
import { JavaString } from "../lang";
import { Cloneable } from "../lang/Cloneable";
import { AbstractCollection } from "./AbstractCollection";
import { ArrayList } from "./ArrayList";
import { Collection } from "./Collection";
import { Deque } from "./Deque";
import { Consumer } from "./function/Consumer";
import { Predicate } from "./function/Predicate";
import { JavaIterator } from "./Iterator";
import { NoSuchElementException } from "./NoSuchElementException";
import { Spliterator } from "./Spliterator";
import { Vector } from "./Vector";

/**
 * A resizable-array implementation of the Deque interface. Array deques have no capacity restrictions; they grow as
 * necessary to support usage.
 */
export class ArrayDeque<T> extends AbstractCollection<T> implements Deque<T>, Serializable, Cloneable<ArrayDeque<T>> {

    #backend: ArrayList<T>;

    /** Constructs an empty array deque with an initial capacity sufficient to hold 16 elements. */
    public constructor();
    /** Constructs an empty array deque with an initial capacity sufficient to hold the specified number of elements. */
    public constructor(numElements: number);
    /**
     * Constructs an array deque containing the elements of the specified collection, in the order they are returned
     * by the collection's iterator.
     */
    public constructor(c: Collection<T>);
    public constructor(numElementsOrC?: number | Collection<T>) {
        super();

        this.#backend = new Vector<T>();
        if (numElementsOrC !== undefined || !(typeof numElementsOrC === "number")) {
            this.#backend.addAll(numElementsOrC as Collection<T>);
        }
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.#backend[Symbol.iterator]();
    }

    /**
     * Inserts the specified element at the front of this deque.
     *
     * @param e the element to add
     *
     * @returns true
     */
    public add(e: T): boolean {
        this.#backend.add(e);

        return true;
    }

    /**
     * Adds all of the elements in the specified collection to the front of this deque, in the order that they are
     * returned by the specified collection's iterator.
     *
     * @param c the collection containing elements to be added to this deque
     *
     * @returns true if this deque changed as a result of the call
     */
    public addAll(c: Collection<T>): boolean {
        return this.#backend.addAll(c);
    }

    /**
     * Inserts the specified element at the front of this deque.
     *
     * @param e the element to add
     */
    public addFirst(e: T): void {
        this.#backend.add(0, e);
    }

    /**
     * Inserts the specified element at the end of this deque.
     *
     * @param e the element to add
     */
    public addLast(e: T): void {
        this.#backend.add(e);
    }

    /**
     * Removes all of the elements from this deque.
     * The deque will be empty after this call returns.
     */
    public clear(): void {
        this.#backend.clear();
    }

    /**
     * Returns a shallow copy of this ArrayDeque instance.
     * (The elements themselves are not cloned.)
     *
     * @returns a shallow copy of this ArrayDeque instance
     */
    public override clone(): ArrayDeque<T> {
        return new ArrayDeque<T>(this.#backend);
    }

    /**
     * Returns true if this deque contains the specified element.
     * More formally, returns true if and only if this deque contains at least one element e such that
     * (o === null ? e === null : o.equals(e)).
     *
     * @param o element whose presence in this deque is to be tested
     *
     * @returns true if this deque contains the specified element
     */
    public contains(o: T): boolean {
        return this.#backend.contains(o);
    }

    public containsAll(c: Collection<T>): boolean {
        return this.#backend.containsAll(c);
    }

    public descendingIterator(): JavaIterator<T> {
        throw new NotImplementedError();
    }

    /**
     * Retrieves, but does not remove, the first element of this deque, or returns null if this deque is empty.
     *
     * @returns the first element of this deque, or null if this deque is empty
     */
    public element(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.#backend.get(0);
    }

    public equals(o: Object): boolean {
        return this.#backend.equals(o);
    }

    /**
     * Performs the given action for each element of the Iterable until all elements have been processed or the action
     * throws an exception. Actions are performed in the order of iteration (if an iteration order is specified).
     * Exceptions thrown by the action are relayed to the caller.
     *
     * @param action The action to be performed for each element
     */
    public forEach(action: Consumer<T>): void {
        for (let i = 0; i < this.#backend.size(); ++i) {
            action.accept(this.#backend.get(i)!);
        }
    }

    /**
     * Retrieves, but does not remove, the first element of this deque, or returns null if this deque is empty.
     * This method is equivalent to peekFirst().
     *
     * @returns the first element of this deque
     * @throws NoSuchElementException if this deque is empty
     */
    public getFirst(): T {
        return this.#backend.get(0);
    }

    /**
     * Retrieves, but does not remove, the last element of this deque, or returns null if this deque is empty.
     * This method is equivalent to peekLast().
     *
     * @returns the last element of this deque
     * @throws NoSuchElementException if this deque is empty
     */
    public getLast(): T {
        return this.#backend.get(this.#backend.size() - 1);
    }

    /**
     * @returns the hash code value for this deque
     */
    public hashCode(): number {
        return this.#backend.hashCode();
    }

    /**
     * Returns true if this deque contains no elements.
     *
     * @returns true if this deque contains no elements
     */
    public isEmpty(): boolean {
        return this.#backend.isEmpty();
    }

    /**
     * Returns an iterator over the elements in this deque in proper sequence.
     * The elements will be returned in order from first (head) to last (tail).
     *
     * @returns an iterator over the elements in this deque in proper sequence
     */
    public iterator(): JavaIterator<T> {
        return this.#backend.iterator();
    }

    /**
     * Inserts the specified element at the front of this deque.
     * This method is equivalent to addFirst().
     *
     * @param e the element to add
     *
     * @returns true
     */
    public offer(e: T): boolean {
        this.addFirst(e);

        return true;
    }

    /**
     * Inserts the specified element at the front of this deque.
     * This method is equivalent to addFirst().
     *
     * @param e the element to add
     *
     * @returns true
     */
    public offerFirst(e: T): boolean {
        this.addFirst(e);

        return true;
    }

    /**
     * Inserts the specified element at the end of this deque.
     * This method is equivalent to addLast().
     *
     * @param e the element to add
     *
     * @returns true
     */
    public offerLast(e: T): boolean {
        this.addLast(e);

        return true;
    }

    /**
     * Retrieves, but does not remove, the first element of this deque, or returns null if this deque is empty.
     *
     * @returns the first element of this deque, or null if this deque is empty
     */
    public peek(): T | null {
        return this.peekFirst();
    }

    public peekFirst(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.#backend.get(0);
    }

    public peekLast(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.#backend.get(this.#backend.size() - 1);
    }

    /**
     * Retrieves and removes the head of the queue represented by this deque (in other words, the first element of
     * this deque), or returns null if this deque is empty.
     *
     * @returns the head of the queue represented by this deque, or null if this deque is empty
     */
    public poll(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.pop();
    }

    public pollFirst(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.pop();
    }

    public pollLast(): T | null {
        if (this.#backend.isEmpty()) {
            return null;
        }

        return this.#backend.remove(this.#backend.size() - 1);
    }

    /**
     * Pops an element from the stack represented by this deque. In other words, removes and returns the first
     * element of this deque.
     *
     * @returns the element at the front of this deque (which is the top of the stack represented by this deque)
     *
     * @throws NoSuchElementException if this deque is empty
     */
    public pop(): T {
        if (this.#backend.isEmpty()) {
            throw new NoSuchElementException();
        }

        const result = this.#backend.get(0);
        this.#backend.remove(0);

        return result;
    }

    /**
     * Pushes an element onto the stack represented by this deque (in other words, at the head of this deque)
     * This method is equivalent to addFirst(e).
     *
     * @param e the element to push
     */
    public push(e: T): void {
        this.#backend.add(0, e);
    }

    /**
     * Retrieves and removes the head of the queue represented by this deque.
     */
    public remove(): T;
    /**
     * Removes a single instance of the specified element from this deque.
     */
    public remove(o: T): boolean;
    public remove(o?: T): T | boolean {
        if (o === undefined) {
            return this.#backend.remove(0);
        } else {
            return this.#backend.remove(o);
        }
    }

    /**
     * Removes all of this deque's elements that are also contained in the specified collection.
     * After this call returns, this deque will contain no elements in common with the specified collection.
     *
     * @param c collection containing elements to be removed from this deque
     *
     * @returns true if this deque changed as a result of the call
     */
    public removeAll(c: Collection<T>): boolean {
        return this.#backend.removeAll(c);
    }

    /**
     * Retrieves and removes the first element of this deque, or returns null if this deque is empty.
     *
     * @returns the first element of this deque, or null if this deque is empty
     */
    public removeFirst(): T {
        return this.#backend.remove(0);
    }

    /**
     * Removes the first occurrence of the specified element in this deque (when traversing the deque from head to
     * tail). If the deque does not contain the element, it is unchanged.
     * More formally, removes the first element e such that (o === null ? e === null : o.equals(e)) (if such an
     * element exists).
     *
     * @param o element to be removed from this deque, if present
     *
     * @returns true if an element was removed as a result of this call
     */
    public removeFirstOccurrence(o: T): boolean {
        return this.#backend.remove(o);
    }

    /**
     * Removes all of the elements of this collection that satisfy the given predicate.
     * Errors or runtime exceptions thrown during iteration or by the predicate are relayed to the caller.
     *
     * @param filter a predicate which returns true for elements to be removed
     *
     * @returns true if any elements were removed
     */
    public removeIf(filter: Predicate<T>): boolean {
        return this.#backend.removeIf(filter);
    }

    /**
     * Retrieves and removes the last element of this deque, or returns null if this deque is empty.
     *
     * @returns the last element of this deque, or null if this deque is empty
     * @throws NoSuchElementException if this deque is empty
     */
    public removeLast(): T {
        if (this.#backend.isEmpty()) {
            throw new NoSuchElementException();
        }

        return this.#backend.remove(this.#backend.size() - 1);
    }

    /**
     * Removes the last occurrence of the specified element in this deque (when traversing the deque from head to
     * tail). If the deque does not contain the element, it is unchanged.
     * More formally, removes the last element e such that (o === null ? e === null : o.equals(e)) (if such an
     * element exists).
     *
     * @param o element to be removed from this deque, if present
     *
     * @returns true if an element was removed as a result of this call
     */
    public removeLastOccurrence(o: T): boolean {
        const index = this.#backend.lastIndexOf(o);
        if (index === -1) {
            return false;
        }

        this.#backend.remove(index);

        return true;
    }

    /**
     * Retains only the elements in this deque that are contained in the specified collection.
     * In other words, removes from this deque all of its elements that are not contained in the specified collection.
     * After this call returns, this deque will contain no elements in common with the specified collection.
     *
     * @param c collection containing elements to be retained in this deque
     *
     * @returns true if this deque changed as a result of the call
     */
    public retainAll(c: Collection<T>): boolean {
        return this.#backend.retainAll(c);
    }

    /**
     * Returns the number of elements in this deque.
     *
     * @returns the number of elements in this deque
     */
    public size(): number {
        return this.#backend.size();
    }

    /**
     * Creates a late-binding and fail-fast Spliterator over the elements in this deque.
     * The Spliterator reports Spliterator.ORDERED and Spliterator.SIZED.
     * The spliterator's comparator (see Spliterator.getComparator()) is null.
     * The spliterator is created from the front of the deque, which corresponds to the head of the queue.
     *
     * @returns a Spliterator over the elements in this deque
     */
    public spliterator(): Spliterator<T> {
        return this.#backend.spliterator();
    }

    /**
     * Returns an array containing all of the elements in this deque in proper sequence (from first to last element).
     *
     * @returns an array containing all of the elements in this deque in proper sequence
     */
    public toArray(): T[];
    /**
     * Returns an array containing all of the elements in this deque in proper sequence (from first to last element);
     * the runtime type of the returned array is that of the specified array.
     *
     * @param a the array into which the elements of this deque are to be stored, if it is big enough; otherwise, a new
     *         array of the same runtime type is allocated for this purpose.
     *
     * @returns an array containing the elements of this deque
     */
    public toArray(a: T[]): T[];
    public toArray(_a?: T[]): T[] {
        return this.#backend.toArray();
    }

    public override toString(): JavaString {
        return this.#backend.toString();
    }
}
