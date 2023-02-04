/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

export class Stack<T> extends Array<T> {
    /**
     * @returns The Top Of Stack element (the last one pushed to it) without removing it.
     */
    public get tos(): T | undefined {
        return this.length === 0 ? undefined : this[this.length - 1];
    }
}
