/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Collection } from "./Collection";

/**
 * A collection designed for holding elements prior to processing.
 * Besides basic Collection operations, queues provide additional insertion, extraction, and inspection operations.
 * Each of these methods exists in two forms: one throws an exception if the operation fails, the other returns a
 * special value (either null or false, depending on the operation). The latter form of the insert operation is
 * designed specifically for use with capacity-restricted Queue implementations; in most implementations, insert
 * operations cannot fail.
 */
export interface Queue<T> extends Omit<Collection<T>, "remove"> {
    /**
     * Inserts the specified element into this queue if it is possible to do so immediately without violating
     * capacity restrictions, returning true upon success and throwing an IllegalStateException if no space is
     * currently available.
     */
    add(e: T): boolean;

    /** Retrieves, but does not remove, the head of this queue. */
    element(): T | null;

    /**
     * Inserts the specified element into this queue if it is possible to do so immediately without violating
     * capacity restrictions.
     */
    offer(e: T): boolean;

    /** Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty. */
    peek(): T | null;

    /** Retrieves and removes the head of this queue, or returns null if this queue is empty. */
    poll(): T | null;

    /** Retrieves and removes the head of this queue. */
    remove(): T;

}
