/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { List } from "immutable";
import { IllegalStateException } from "../lang/IllegalStateException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

import { JavaObject } from "../lang/Object";
import { ListIterator } from "./ListIterator";
import { NoSuchElementException } from "./NoSuchElementException";

/**
 * This interface provides shared access to the backend of a list class.
 * It is usually not shared itself, but holds the shared list.
 */
export interface IListBackend<T> {
    /**
     * The list shared between the owning list and all its sub (sub-sub) views.
     */
    list: List<T>;

    /** The start index of the list (inclusive). Default is 0, set in the origin. */
    start: number;

    /** The end index the list (exclusive). Default ist the list size, set in the origin. */
    end: number;

    /** A callback to the owner to notify it about changes in the list size, as elements are added or removed. */
    updateEnd(delta: number): void;
}

/** An implementation of the ListIterator interface. */
export class ListIteratorImpl<T> extends JavaObject implements ListIterator<T> {

    // Holds the direction we navigated last (either by calling next() or previous()).
    private movedForward: boolean | undefined;

    // The current index in the iteration.
    private index: number;

    #backend: IListBackend<T>;

    public constructor(backend: IListBackend<T>, index?: number) {
        super();

        this.#backend = backend;

        if (backend.start < 0
            || backend.end < 0
            || backend.start > backend.list.size
            || backend.end > backend.list.size
            || backend.start > backend.end) {
            throw new IndexOutOfBoundsException();
        }

        this.index = backend.start + (index ?? 0);
    }

    public add(element: T): void {
        this.movedForward = undefined;
        this.#backend.list = this.#backend.list.push(element);
    }

    public hasNext(): boolean {
        return this.index < this.#backend.end;
    }

    public hasPrevious(): boolean {
        return this.index > this.#backend.start;
    }

    public next(): T {
        if (this.index >= this.#backend.end) {
            throw new NoSuchElementException();
        }

        this.movedForward = true;

        return this.#backend.list.get(this.index++)!;
    }

    public nextIndex(): number {
        return this.index;
    }

    public previous(): T {
        if (this.index <= this.#backend.start) {
            throw new NoSuchElementException();
        }

        this.movedForward = false;

        return this.#backend.list.get(--this.index)!;
    }

    public previousIndex(): number {
        return this.index - this.#backend.start - 1;
    }

    public remove(): void {
        if (this.movedForward === undefined) {
            throw new IllegalStateException();
        }

        if (this.movedForward) {
            // Index was moved to next element.
            this.#backend.list = this.#backend.list.splice(this.index - 1, 1);
        } else {
            // Index at last returned element.
            this.#backend.list = this.#backend.list.splice(this.index, 1);
        }

        this.movedForward = undefined;
    }

    public set(element: T): void {
        if (this.movedForward) {
            // Index was moved to next element.
            this.#backend.list = this.#backend.list.set(this.index - 1, element);
        } else {
            // Index at last returned element.
            this.#backend.list = this.#backend.list.set(this.index, element);
        }
    }

}
