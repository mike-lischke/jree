/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";

import { java, NotImplementedError } from "../..";

import { AbstractList } from "./AbstractList";

/**
 * Implementation of the List and Deque interfaces. Implements all optional list operations, and
 * permits all elements (including null).
 *
 * In Java this is a doubly-linked list, but this class uses immutable.js for the actual implementation.
 */
export class LinkedList<T> extends AbstractList<T> implements java.io.Serializable, java.lang.Cloneable<LinkedList<T>>,
    java.util.Deque<T>, java.util.List<T> {

    /** Constructs an empty list. */
    public constructor();
    /**
     * Constructs a list containing the elements of the specified collection, in the order they are returned by the
     * collection's iterator.
     *
     * @param c The collection whose elements are to be placed into this list.
     */
    public constructor(c: java.util.Collection<T>);
    public constructor(c?: java.util.Collection<T>) {
        super({
            list: List(c),
            start: 0,
            end: c?.size() ?? 0,
            updateEnd: (delta: number) => {
                // Nothing to do here.
            },
        });
    }

    /**
     * Inserts the specified element at the beginning of this list.
     *
     * @param e The element to add.
     */
    public addFirst(e: T): void {
        this.add(0, e);
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e The element to append.
     */
    public addLast(e: T): void {
        this.add(this.size(), e);
    }

    /** @returns a shallow copy of this LinkedList. */
    public clone(): LinkedList<T> {
        return this.createClone(LinkedList) as LinkedList<T>;
    }

    public descendingIterator(): java.util.Iterator<T> {
        throw new NotImplementedError();
    }

    public element(): T {
        return this.getFirst();
    }

    /** @returns the first element in this list. */
    public getFirst(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.get(0);
    }

    /** @returns the last element in this list. */
    public getLast(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.get(this.size() - 1);
    }

    public offer(e: T): boolean {
        this.add(e);

        return true;
    }

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

    /** @returns but does not remove, the head (first element) of this list. */
    public peek(): T {
        return this.element();
    }

    /** @returns but does not remove, the first element of this list, or returns null if this list is empty. */
    public peekFirst(): T | null {
        if (this.size() === 0) {
            return null;
        }

        return this.element();
    }

    /**
     * Retrieves, but does not remove, the last element of this list, or returns null if this list is empty.
     *
     * @returns the last element or null, if the list is empty.
     */
    public peekLast(): T | null {
        if (this.size() === 0) {
            return null;
        }

        return this.get(this.size() - 1);
    }

    /**
     * Retrieves and removes the head (first element) of this list.
     *
     * @returns The first element, extracted from the list.
     *
     * @throws java.util.NoSuchElementException if the list is empty.
     */
    public poll(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.remove(0);
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

        return this.remove(0);
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

        return this.remove(this.size() - 1);
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

    public remove(): T;
    public remove(index: number): T;
    public remove(element: T): boolean;
    public remove(...args: unknown[]): boolean | T {
        if (args.length === 0) {
            return super.remove(0);
        } else if (typeof args[0] === "number") {
            return super.remove(args[0]);
        } else {
            const index = this.indexOf(args[0] as T);
            if (index > -1) {
                super.remove(index);

                return true;
            }

            return false;
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
        return this.poll();
    }

    /**
     * Removes the first occurrence of the specified element in this list (when traversing the list from head to tail).
     *
     * @param o The element to remove.
     *
     * @returns true if the element was in the list.
     *
     * @throws java.util.NoSuchElementException if the list is empty.
     */
    public removeFirstOccurrence(o: T): boolean {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        const index = this.indexOf(o);
        if (index > -1) {
            this.remove(index);

            return true;
        }

        return false;
    }

    /**
     * Removes and returns the last element from this list.
     *
     * @returns the previously last element.
     *
     * @throws java.util.NoSuchElementException if the list is empty.
     */
    public removeLast(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.remove(this.size() - 1);
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

        const index = this.lastIndexOf(o);
        if (index > -1) {
            this.remove(index);

            return true;
        }

        return false;
    }
}
