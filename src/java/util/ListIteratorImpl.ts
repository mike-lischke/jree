/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IllegalStateException } from "../lang/IllegalStateException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

import { JavaObject } from "../lang/Object";
import { AbstractList } from "./AbstractList";
import { ListIterator } from "./ListIterator";
import { NoSuchElementException } from "./NoSuchElementException";

/**
 * This interface provides shared access to the backend of a list class.
 * It is usually not shared itself, but holds the shared list.
 */
export interface ISubList<T> {
    /** The underlying data. */
    data: T[];

    /**
     * The list from which this sub list was created. If undefined then this sub list represents the original
     * list and index values are relative to the start of the data array.
     */
    parentList?: AbstractList<T>;

    /** The start index of the sub list relative to the parent list (inclusive). */
    start: number;

    /** The end index of the sub list relative to the parent list (exclusive). */
    end: number;
}

/** An implementation of the ListIterator interface. */
export class ListIteratorImpl<T> extends JavaObject implements ListIterator<T> {

    // Holds the direction we navigated last (either by calling next() or previous()).
    #movedForward: boolean | undefined;

    // The current index in the iteration.
    #index: number;

    #backend: ISubList<T>;

    public constructor(backend: ISubList<T>, index: number) {
        super();

        this.#backend = backend;

        if (backend.start < 0
            || backend.end < 0
            || backend.start > backend.data.length
            || backend.end > backend.data.length
            || backend.start > backend.end
            || index < backend.start
            || index > backend.end) {
            throw new IndexOutOfBoundsException();
        }

        this.#index = index;
    }

    public add(element: T): void {
        this.#movedForward = undefined;
        this.#backend.parentList!.add(this.#index, element);
    }

    public hasNext(): boolean {
        return this.#index < this.#backend.end;
    }

    public hasPrevious(): boolean {
        return this.#index > this.#backend.start;
    }

    public next(): T {
        if (this.#index >= this.#backend.end) {
            throw new NoSuchElementException();
        }

        this.#movedForward = true;

        return this.#backend.parentList!.get(this.#index++);
    }

    public nextIndex(): number {
        return this.#index;
    }

    public previous(): T {
        if (this.#index <= this.#backend.start) {
            throw new NoSuchElementException();
        }

        this.#movedForward = false;

        return this.#backend.parentList!.get(--this.#index);
    }

    public previousIndex(): number {
        return this.#index - this.#backend.start - 1;
    }

    public remove(): void {
        if (this.#movedForward === undefined) {
            throw new IllegalStateException();
        }

        // Manipulate the data via the parent list, to update mod counts etc.
        if (this.#movedForward) {
            // Index was moved to next element.
            this.#backend.parentList!.remove(this.#index - 1);
        } else {
            // Index at last returned element.
            this.#backend.parentList!.remove(this.#index);
        }

        this.#movedForward = undefined;
    }

    public set(element: T): void {
        if (this.#movedForward) {
            // Index was moved to next element.
            this.#backend.parentList!.set(this.#index - 1, element);
        } else {
            // Index at last returned element.
            this.#backend.parentList!.set(this.#index, element);
        }
    }

}
