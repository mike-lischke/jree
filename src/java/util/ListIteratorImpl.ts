/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";

import { java } from "../..";
import { JavaObject } from "../lang/Object";

/**
 * This interface provides shared access to the backend of a list class.
 */
export interface IListIteratorBackend<T> {
    list: List<T>;
    start: number;

    /**
     * The end index (non-inclusive) of the list.
     * If undefined, the list's count is used.
     */
    end?: number;
}

/** An implementation of the ListIterator interface. */
export class ListIteratorImpl<T> extends JavaObject implements java.util.ListIterator<T> {

    // Holds the direction we navigated last (either by calling next() or previous()).
    private movedForward: boolean | undefined;

    // The current index in the iteration.
    private index: number;

    private end: number;

    #backend: IListIteratorBackend<T>;

    public constructor(backend: IListIteratorBackend<T>, index?: number) {
        super();

        this.#backend = backend;

        this.end = backend.end ?? backend.list.count();
        if (backend.start < 0 || this.end < 0 || backend.start > this.end || this.end > backend.list.count()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        this.index = backend.start + (index ?? 0);
    }

    public add(element: T): void {
        this.movedForward = undefined;
        this.#backend.list = this.#backend.list.push(element);
    }

    public hasNext(): boolean {
        return this.index < this.end;
    }

    public hasPrevious(): boolean {
        return this.index > this.#backend.start;
    }

    public next(): T {
        if (this.index === this.end) {
            throw new java.lang.NoSuchElementException();
        }

        this.movedForward = true;

        return this.#backend.list.get(this.index++)!;
    }

    public nextIndex(): number {
        return this.index;
    }

    public previous(): T {
        if (this.index === this.#backend.start) {
            throw new java.lang.NoSuchElementException();
        }

        this.movedForward = false;

        return this.#backend.list.get(--this.index)!;
    }

    public previousIndex(): number {
        return this.index - this.#backend.start - 1;
    }

    public remove(): void {
        if (this.movedForward === undefined) {
            throw new java.lang.IllegalStateException();
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
