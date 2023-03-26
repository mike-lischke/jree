/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { JavaObject } from "../lang/Object";

import { InvalidMarkException } from "./InvalidMarkException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaString } from "../lang/String";
import { int } from "../../types";

/**
 * A container for data of a specific primitive type.
 * A buffer is a linear, finite sequence of elements of a specific primitive type.
 */
export abstract class JavaBuffer<T> extends JavaObject {
    protected currentPosition = 0;
    protected currentLimit = 0;
    protected currentMark = -1;

    protected constructor(offset: int, end: int) {
        super();

        this.currentPosition = offset;
        this.currentLimit = end;
    }

    /**
     * Clears this buffer.
     * The position is set to zero, the limit is set to the capacity, and the mark is discarded.
     *
     * @returns this buffer.
     */
    public clear(): this {
        this.currentPosition = 0;
        this.currentLimit = this.capacity();
        this.currentMark = -1;

        return this;
    }

    /**
     * Flips this buffer.
     * The limit is set to the current position and then the position is set to zero.
     *
     * @returns this buffer.
     */
    public flip(): this {
        this.currentLimit = this.currentPosition;
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    /**
     * Tells whether there are any elements between the current position and the limit.
     *
     * @returns true if, and only if, there is at least one element remaining in this buffer.
     */
    public hasRemaining(): boolean {
        return this.currentLimit > this.currentPosition;
    }

    /** Returns this buffer's limit. */
    public limit(): int;
    /**
     * Sets this buffer's limit.
     *
     * @param newLimit The new limit.
     */
    public limit(newLimit: int): this;
    public limit(...args: unknown[]): int | this {
        if (args.length === 0) {
            return this.currentLimit;
        }

        const newLimit = args[0] as int;
        if (newLimit < 0 || newLimit > this.capacity()) {
            throw new IllegalArgumentException();
        }

        this.currentLimit = newLimit;
        if (this.currentPosition > newLimit) {
            this.currentPosition = newLimit;
        }

        if (this.currentMark > newLimit) {
            this.currentMark = -1;
        }

        return this;
    }

    /**
     * Sets this buffer's mark at its position.
     *
     * @returns this buffer.
     */
    public mark(): this {
        this.currentMark = this.currentPosition;

        return this;
    }

    /** Returns this buffer's position. */
    public position(): int;
    /**
     * Sets this buffer's position.
     *
     * @param newPosition The new position;
     */
    public position(newPosition: int): void;
    public position(newPosition?: int): int | void {
        if (newPosition === undefined) {
            return this.currentPosition;
        }

        if (newPosition > this.currentLimit || newPosition < 0) {
            throw new IllegalArgumentException();
        }

        if (this.currentMark > newPosition) {
            this.currentMark = -1;
        }
        this.currentPosition = newPosition;
    }

    /**
     * Returns the number of elements between the current position and the limit.
     *
     * @returns The number of elements remaining in this buffer.
     */
    public remaining(): int {
        const diff = this.currentLimit - this.currentPosition;

        return diff < 0 ? 0 : diff;
    }

    /**
     * Resets this buffer's position to the previously-marked position.
     *
     * @throws InvalidMarkException If the mark has not been set.
     * @returns this buffer.
     */
    public reset(): this {
        if (this.currentMark < 0) {
            throw new InvalidMarkException(new JavaString("No mark is set"));
        }
        this.currentPosition = this.currentMark;

        return this;
    }

    /**
     * Rewinds this buffer.
     * The position is set to zero and the mark is discarded.
     *
     * @returns this buffer.
     */
    public rewind(): this {
        this.currentPosition = 0;
        this.currentMark = -1;

        return this;
    }

    public override toString(): JavaString {
        return new JavaString(super.toString());
    }

    /** Returns the array that backs this buffer (optional operation). */
    public abstract array(): T;

    /**
     * Returns the offset within this buffer's backing array of the first element of the buffer (optional operation).
     */
    public abstract arrayOffset(): number;

    /** @returns this buffer's capacity. */
    public abstract capacity(): int;

    /** Creates a new buffer that shares this buffer's content. */
    public abstract duplicate(): this;

    /** Tells whether or not this buffer is backed by an accessible array. */
    public abstract hasArray(): boolean;

    /** Tells whether or not this buffer is direct. */
    public abstract isDirect(): boolean;

    /** Tells whether or not this buffer is read-only. */
    public abstract isReadOnly(): boolean;

    /** Creates a new buffer whose content is a shared subsequence of this buffer's content. */
    public abstract slice(): JavaBuffer<T>;
}
