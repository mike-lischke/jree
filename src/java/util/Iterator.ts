/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../lang/Object";
import { Consumer } from "./function/Consumer";

/** An iterator over a collection.  */
export interface JavaIterator<T> extends IReflection {
    /**
     * Performs the given action for each remaining element until all elements have been processed or the action
     * throws an exception.
     */
    forEachRemaining(action: Consumer<T>): void;

    /** Returns true if the iteration has more elements. */
    hasNext(): boolean;

    /** Returns the next element in the iteration. */
    next(): T;

    /** Removes from the underlying collection the last element returned by this iterator (optional operation). */
    remove(): void;
}
