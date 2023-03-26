/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaIterator } from "./Iterator";
import { Queue } from "./Queue";

/**
 * A linear collection that supports element insertion and removal at both ends. The name deque is short for
 * "double-ended queue" and is usually pronounced "deck". Most Deque implementations place no fixed limits on
 * the number of elements they may contain, but this interface supports capacity-restricted deques as well as
 * those with no fixed size limit.
 *
 * This interface defines methods to access the elements at both ends of the deque. Methods are provided to
 * insert, remove, and examine the element. Each of these methods exists in two forms: one throws an exception
 * if the operation fails, the other returns a special value (either null or false, depending on the operation).
 * The latter form of the insert operation is designed specifically for use with capacity-restricted Deque
 * implementations; in most implementations, insert operations cannot fail.
 */
export interface Deque<T> extends Queue<T> {
    /**
     * Inserts the specified element into the queue represented by this deque(in other words, at the tail of this
     * deque) if it is possible to do so immediately without violating capacity restrictions, returning true upon
     * success and throwing an IllegalStateException if no space is currently available.;
     */
    add(e: T): boolean;

    /**
     * Inserts the specified element at the front of this deque if it is possible to do so immediately without
     * violating capacity restrictions.
     */
    addFirst(e: T): void;

    /**
     * Inserts the specified element at the: Tnd of this deque if it is possible to do so immediately without
     * violating capacity restrictions.
     */
    addLast(e: T): void;

    /** Returns true if this deque contains the specified element. */
    contains(o: T): boolean;

    /** Returns an iterator over the elements in this deque in reverse sequential order. */
    descendingIterator(): JavaIterator<T>;

    /**
     *  Retrieves, but does not remove, the head of the queue represented by this deque(in other words, the first
     * element of this deque).
     */
    element(): T | null;

    /** Retrieves, but does not remove, the first element of this deque. */
    getFirst(): T;

    /** Retrieves, but does not remove, the last element of this deque. */
    getLast(): T;

    /**
     * Inserts the specified element into the queue represented by this deque(in other words, at the tail of this
     * deque) if it is possible to do so immediately without violating capacity restrictions, returning true upon
     * success and false if no space is currently available.
     */
    offer(e: T): boolean;

    /** Inserts the specified element at the front of this deque unless it would violate capacity restrictions. */
    offerFirst(e: T): boolean;

    /** Inserts the specified element at the: Tnd of this deque unless it would violate capacity restrictions. */
    offerLast(e: T): boolean;

    /**
     * Retrieves, but does not remove, the head of the queue represented by this deque (in other words, the first
     * element of this deque), or returns null if this deque is empty.
     */
    peek(): T | null;

    /** Retrieves, but does not remove, the first element of this deque, or returns null if this deque is empty. */
    peekFirst(): T | null;

    /** Retrieves, but does not remove, the last element of this deque, or returns null if this deque is empty. */
    peekLast(): T | null;

    /**
     * Retrieves and removes the head of the queue represented by this deque(in other words, the first element of
     * this deque), or returns null if this deque is empty.
     */
    poll(): T | null;

    /** Retrieves and removes the first element of this deque, or returns null if this deque is empty.; */
    pollFirst(): T | null;

    /** Retrieves and removes the last element of this deque, or returns null if this deque is empty. */
    pollLast(): T | null;

    /** Pops an element from the stack represented by this deque.; */
    pop(): T;

    /**
     * Pushes an element onto the stack represented by this deque(in other words, at the head of this deque) if it is
     * possible to do so immediately without violating capacity restrictions, returning true upon success and throwing
     * an IllegalStateException if no space is currently available.
     */
    push(e: T): void;

    /**
     * Retrieves and removes the head of the queue represented by this deque(in other words, the first element of
     * this deque).
     */
    remove(): T;

    /** Removes the first occurrence of the specified element from this deque. */
    remove(o: T): boolean;

    /** Retrieves and removes the first element of this deque. */
    removeFirst(o: T): void;

    /** Removes the first occurrence of the specified element from this deque. */
    removeFirstOccurrence(o: T): boolean;

    /** Retrieves and removes the last element of this deque. */
    removeLast(): T;

    /** Removes the last occurrence of the specified element from this deque. */
    removeLastOccurrence(o: T): boolean;

    /** Returns the number of elements in this deque.; */
    size(): number;
}
