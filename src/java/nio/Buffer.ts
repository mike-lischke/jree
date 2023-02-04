/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { JavaObject } from "../lang/Object";

import { InvalidMarkException } from "./InvalidMarkException";
import { S } from "../../templates";

/* eslint-disable jsdoc/require-returns */

export abstract class Buffer<T> extends JavaObject {
    // This is the raw memory storage for the buffer. Only a part might actually be used.
    protected backBuffer: ArrayBuffer;

    // All the indexes are rather virtual values and not to be taken as index into the back buffer,
    // as their real position depends on the element size of the used array views.

    protected currentPosition = 0;
    protected currentLimit = 0;
    protected currentMark = -1;

    #capacity: number;

    public constructor(buffer: ArrayBuffer, elementSize: number) {
        super();

        this.backBuffer = buffer;
        this.#capacity = buffer.byteLength / elementSize;
    }

    /** @returns this buffer's capacity. */
    public capacity(): number {
        return this.#capacity;
    }

    /** Clears this buffer. */
    public clear(): this {
        this.currentPosition = 0;
        this.currentLimit = this.capacity();
        this.currentMark = -1;

        return this;
    }

    /** Flips this buffer. */
    public flip(): this {
        this.currentLimit = this.currentPosition;
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    /** Tells whether there are any elements between the current position and the limit. */
    public hasRemaining(): boolean {
        return this.currentLimit > this.currentPosition;
    }

    /** Returns this buffer's limit. */
    public get limit(): number {
        return this.currentLimit;
    }

    /**
     * Sets this buffer's limit.
     *
     * @param newLimit The new limit.
     */
    public set limit(newLimit: number) {
        if (newLimit < 0 || newLimit > this.capacity()) {
            throw new java.lang.IllegalArgumentException();
        }

        this.currentLimit = newLimit;
        if (this.currentPosition > newLimit) {
            this.currentPosition = newLimit;
        }

        if (this.currentMark > newLimit) {
            this.currentMark = -1;
        }
    }

    /** Sets this buffer's mark at its position. */
    public mark(): this {
        this.currentMark = this.currentPosition;

        return this;
    }

    /** Returns this buffer's position. */
    public position(): number;
    /**
     * Sets this buffer's position.
     *
     * @param newPosition The new position;
     */
    public position(newPosition: number): void;
    public position(newPosition?: number): number | void {
        if (newPosition === undefined) {
            return this.currentPosition;
        }

        if (newPosition > this.currentLimit || newPosition < 0) {
            throw new java.lang.IllegalArgumentException();
        }

        if (this.currentMark > newPosition) {
            this.currentMark = -1;
        }
        this.currentPosition = newPosition;
    }

    /** Returns the number of elements between the current position and the limit. */
    public remaining(): number {
        const diff = this.currentLimit - this.currentPosition;

        return diff < 0 ? 0 : diff;
    }

    /** Resets this buffer's position to the previously-marked position. */
    public reset(): this {
        if (this.currentMark < 0) {
            throw new InvalidMarkException(S`No mark is set`);
        }
        this.currentPosition = this.currentMark;

        return this;
    }

    /** Rewinds this buffer. */
    public rewind(): this {
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    /** Returns the array that backs this buffer (optional operation). */
    public abstract array(): T;

    /**
     * Returns the offset within this buffer's backing array of the first element of the buffer (optional operation).
     */
    public abstract arrayOffset(): number;

    /** Tells whether or not this buffer is backed by an accessible array. */
    public abstract hasArray(): boolean;

    /** Tells whether or not this buffer is direct. */
    public abstract isDirect(): boolean;

    /** Tells whether or not this buffer is read-only. */
    public abstract isReadOnly(): boolean;
}
