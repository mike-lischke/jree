/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { MurmurHash } from "../../MurmurHash";
import { int } from "../../types";

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
        super(offset, offset + length);
        this.#array = array;
        this.#byteOrder = ByteOrder.BIG_ENDIAN;
    }

    /** @returns the byte array that backs this buffer (optional operation). */
    public array(): T {
        return this.#array;
    }

    /**
     * @returns the offset within this buffer's backing array of the first element of the buffer  (optional operation).
     */
    public arrayOffset(): number {
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
    public override capacity(): number {
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
     * @param that tbd
     *
     * @returns tbd
     */
    public compareTo(that: JavaBuffer<T>): number {
        const other = that.array().subarray(that.position(), that.limit());
        const me = this.array().subarray(this.currentPosition, this.currentLimit);

        const count = Math.max(other.length, me.length);
        for (let i = 0; i < count; ++i) {
            if (i === me.length) {
                return -1;
            }

            if (i === other.length) {
                return 1;
            }

            if (other[i] < me[i]) {
                return -1;
            }

            if (other[i] > me[i]) {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Tells whether or not this buffer is equal to another object.
     *
     * @param ob tbd
     *
     * @returns tbd
     */
    public override equals(ob: unknown): boolean {
        if (this === ob) {
            return true;
        }

        if (!(ob instanceof JavaBuffer)) {
            return false;
        }

        const array = ob.array() as T;
        const other = array.subarray(ob.position(), ob.limit());
        const me = this.array().subarray(this.currentPosition, this.currentLimit);

        if (other.length !== me.length) {
            return false;
        }

        for (let i = 0; i < other.length; ++i) {
            if (other[i] !== me[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Tells whether or not this buffer is backed by an accessible byte array.
     *
     * @returns True.
     */
    public hasArray(): boolean {
        return true;
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
     * @param that tbd
     *
     * @returns tbd
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
