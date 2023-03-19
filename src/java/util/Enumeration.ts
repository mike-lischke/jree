/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "../lang/Object";
import { JavaIterator } from "./Iterator";

/**
 * An object that implements the Enumeration interface generates a series of elements, one at a time.
 * Successive calls to the nextElement method return successive elements of the series.
 */
export interface Enumeration<T> extends IReflection {
    /**
     * Returns an Iterator that traverses the remaining elements covered by this enumeration.
     * Note: this is actually a default method in Java, but we cannot use that here.
     */
    asIterator(): JavaIterator<T>;

    /**
     * Tests if this enumeration contains more elements.
     *
     * @returns true if and only if this enumeration object contains at least one more element to provide; false
     * otherwise.
     */
    hasMoreElements(): boolean;

    /**
     * Returns the next element of this enumeration if this enumeration object has at least one more element to provide.
     *
     * @returns the next element of this enumeration.
     */
    nextElement(): T;
}
