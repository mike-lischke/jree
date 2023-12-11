/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { EmptyStackException } from "./EmptyStackException.js";
import { Vector } from "./Vector.js";

/**
 * The Stack class represents a last-in-first-out (LIFO) stack of objects.
 * It extends class Vector with five operations that allow a vector to be treated as a stack.
 * The usual push and pop operations are provided, as well as a method to peek at the top item on the stack, a method
 * to test for whether the stack is empty, and a method to search the stack for an item and discover how far it is
 * from the top. When a stack is first created, it contains no items.
 */
export class Stack<T> extends Vector<T> {
    /**
     * Creates an empty Stack.
     */
    public constructor() {
        super();
    }

    /**
     * Tests if this stack is empty.
     *
     * @returns true if and only if this stack contains no items; false otherwise.
     */
    public empty(): boolean {
        return this.size() === 0;
    }

    /**
     * Looks at the object at the top of this stack without removing it from the stack.
     *
     * @returns the object at the top of this stack.
     */
    public peek(): T {
        if (this.empty()) {
            throw new EmptyStackException();
        }

        return this.lastElement();
    }

    /**
     * Removes the object at the top of this stack and returns that object as the value of this function.
     *
     * @returns The object at the top of this stack.
     */
    public pop(): T {
        if (this.empty()) {
            throw new EmptyStackException();
        }

        return this.remove(this.size() - 1);
    }

    /**
     * Pushes an item onto the top of this stack.
     *
     * @param item - the item to be pushed onto this stack.
     *
     * @returns the item argument.
     */
    public push(item: T): T {
        this.addElement(item);

        return item;
    }

    /**
     * Returns the 1-based position where an object is on this stack.
     * If the object o occurs as an item in this stack, this method returns the distance from the top of the stack of
     * the occurrence nearest the top of the stack; the topmost item on the stack is considered to be at distance 1.
     * The equals method is used to compare o to the items in this stack.
     * If the object o is not on the stack, -1 is returned.
     *
     * @param o - the desired object.
     *
     * @returns the 1-based position from the top of the stack where the object is located; the return value -1
     * indicates that the object is not on the stack.
     */
    public search(o: T): number {
        const index = this.lastIndexOf(o);

        if (index >= 0) {
            return this.size() - index;
        }

        return -1;
    }

}
