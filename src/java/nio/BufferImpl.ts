/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { MurmurHash } from "../../MurmurHash";
import { int } from "../../types";
import { IndexOutOfBoundsException } from "../lang";

import type { Comparable } from "../lang/Comparable";
import { JavaString } from "../lang/String";
import { Arrays, type TypedArray } from "../util/Arrays";
import { JavaBuffer } from "./Buffer";
import { ByteOrder } from "./ByteOrder";

/** Implements common functionality of the various typed Java buffers. */
export abstract class BufferImpl<T extends TypedArray> extends JavaBuffer<T> implements Comparable<BufferImpl<T>> {
    protected readOnly = false;

    #array: T;
    #byteOrder: ByteOrder;

    protected constructor(array: T, offset: int, length: int) {
        if (offset < 0 || length < 0 || offset + length > array.length) {
            throw new IndexOutOfBoundsException("Invalid offset or length");
        }

        super(offset, offset + length);
        this.#array = array;
        this.#byteOrder = ByteOrder.BIG_ENDIAN;
    }

    /** @returns the byte array that backs this buffer (optional operation). */
    public array(): T {
        return this.#array.subarray(this.currentPosition, this.currentLimit) as T;
    }

    /**
     * @returns the offset within this buffer's backing array of the first element of the buffer (optional operation).
     */
    public arrayOffset(): int {
        return this.#array.byteOffset;
    }

    /**
     * Creates a new, read-only byte buffer that shares this buffer's content.
     *
     * @returns A read-only copy of this buffer.
     */
    public asReadOnlyBuffer(): this {
        const result = this.duplicate();
        result.readOnly = true;

        return result;
    }

    /** Creates a view of this byte buffer as a short buffer. */
    // public asShortBuffer(): ShortBuffer

    /** @returns this buffer's capacity. */
    public override capacity(): int {
        return this.#array.length;
    }

    /**
     * Compacts this buffer (optional operation).
     *
     * @returns This buffer.
     */
    public compact(): this {
        if (this.position() > 0) {
            this.#array.copyWithin(0, this.currentPosition, this.currentLimit);
            this.currentPosition = this.currentLimit - this.currentPosition;
            this.currentLimit = this.capacity();
            this.currentMark = -1;
        }

        return this;
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns A negative integer, zero, or a positive integer as this buffer is less than, equal to, or greater than
     *          the specified buffer.
     */
    public compareTo(that: BufferImpl<T>): int {
        const index = this.mismatch(that);

        if (index === -1) {
            return 0;
        }

        return this.array()[index] - that.array()[index];
    }

    /**
     * Tells whether or not this buffer is equal to another object.
     *
     * @param ob The other object.
     *
     * @returns True if the other object is also a buffer, its content is the same as this buffer's, and both buffers
     *          have the same position, limit, capacity, and mark.
     */
    public override equals(ob: unknown): boolean {
        if (this === ob) {
            return true;
        }

        if (!(ob instanceof JavaBuffer<T>)) {
            return false;
        }

        return this.mismatch(ob as JavaBuffer<T>) === -1;
    }

    /**
     * Tells whether or not this buffer is backed by an accessible byte array.
     *
     * @returns True.
     */
    public hasArray(): boolean {
        return true;
    }

    /**
     * Tells whether or not there are any elements between the current position and the limit.
     *
     * @returns True if there are any elements remaining in this buffer, false otherwise.
     */
    public override hasRemaining(): boolean {
        return this.currentPosition < this.currentLimit;
    }

    /** @returns the current hash code of this buffer. */
    public override hashCode(): number {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.#array.subarray(this.currentPosition, this.currentLimit));
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }

    /** @returns false */
    public isDirect(): boolean {
        return false;
    }

    public isReadOnly(): boolean {
        return this.readOnly;
    }

    public get littleEndian(): boolean {
        return this.#byteOrder === ByteOrder.LITTLE_ENDIAN;
    }

    /**
     * Finds and returns the relative index of the first mismatch between this buffer and a given buffer.
     *
     * @param that The other buffer.
     *
     * @returns The relative index of the first mismatch, or -1 if there is no mismatch.
     */
    public mismatch(that: JavaBuffer<T>): number {
        return Arrays.mismatch(this.#array, this.currentPosition, this.currentLimit, that.array(),
            that.position(), that.limit());
    }

    /** @returns this buffer's byte order. */
    public get order(): ByteOrder {
        return this.#byteOrder;
    }

    /** Modifies this buffer's byte order. */
    public set order(bo: ByteOrder) {
        this.#byteOrder = bo;
    }

    /** @returns a string summarizing the state of this buffer. */
    public override toString(): JavaString {
        return new JavaString(
            `${this.constructor.name}[pos=${this.position()} lim=${this.limit()} cap=${this.capacity()}]`);
    }

}
