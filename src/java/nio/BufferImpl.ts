/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";

import { MurmurHash } from "../../MurmurHash";
import { S } from "../../templates";
import { TypedArray, TypedArrayConstructor } from "../util";
import { Buffer } from "./Buffer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BufferConstructor<B> = new (...args: any[]) => B;

/** Implements common functionality of the various Java buffers. */
export class BufferImpl<T extends TypedArray, C extends BufferImpl<T, C>>
    extends Buffer<T>
    implements java.lang.Comparable<C> {
    #array: T;
    #readOnly = false;
    #byteOrder: java.nio.ByteOrder;

    protected constructor(buffer: ArrayBuffer,
        private arrayConstructor: TypedArrayConstructor,
        private bufferConstructor: BufferConstructor<C>,
        offset?: number, length?: number) {
        super(buffer, arrayConstructor.BYTES_PER_ELEMENT);
        this.#array = new this.arrayConstructor(buffer, offset, length) as T;
        this.#byteOrder = java.nio.ByteOrder.BIG_ENDIAN;
        this.limit = this.#array.length;
        this.position(0);

        if (offset !== undefined && length !== undefined) {
            this.limit = offset + length;
        } else {
            this.limit = this.#array.length;
        }
        this.position(offset ?? 0);
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

    public isDirect(): boolean {
        return false;
    }

    public isReadOnly(): boolean {
        return this.#readOnly;
    }

    public get littleEndian(): boolean {
        return this.#byteOrder === java.nio.ByteOrder.LITTLE_ENDIAN;
    }

    /**
     * Creates a new, read-only byte buffer that shares this buffer's content.
     *
     * @returns A read-only copy of this buffer.
     */
    public asReadOnlyBuffer(): C {
        const result = this.duplicate();
        result.#readOnly = true;

        return result;
    }

    /** Creates a view of this byte buffer as a short buffer. */
    // public asShortBuffer(): ShortBuffer

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
    public compareTo(that: C): number {
        const other = that.array().subarray(that.currentPosition, that.currentLimit);
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
     * Creates a new byte buffer that shares this buffer's content.
     *
     * @returns tbd
     */
    public duplicate(): C {
        const buffer = new this.bufferConstructor(this.#array);
        buffer.#readOnly = this.#readOnly;
        buffer.currentPosition = this.currentPosition;
        buffer.currentLimit = this.currentLimit;
        buffer.currentMark = this.currentMark;

        return buffer;
    }

    /**
     * Tells whether or not this buffer is equal to another object.
     *
     * @param ob tbd
     *
     * @returns tbd
     */
    public equals(ob: unknown): boolean {
        if (this === ob) {
            return true;
        }

        if (ob instanceof this.bufferConstructor) {
            const other = ob.array().subarray(ob.currentPosition, ob.currentLimit);
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

        return false;
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
    public hashCode(): number {
        let hash = MurmurHash.initialize();
        hash = MurmurHash.update(hash, this.#array.subarray(this.currentPosition, this.currentLimit));
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }

    /**
     * Finds and returns the relative index of the first mismatch between this buffer and a given buffer.
     *
     * @param that tbd
     *
     * @returns tbd
     */
    public mismatch(that: C): number {
        const left = this.#array.slice(this.currentPosition, this.currentLimit);
        const right = that.#array.slice(that.currentPosition, that.currentLimit);
        for (let i = 0; i < Math.min(left.length, right.length); ++i) {
            if (left[i] !== right[i]) {
                return i;
            }
        }

        if (left.length !== right.length) {
            return Math.min(left.length, right.length);
        }

        return -1;
    }

    /** @returns this buffer's byte order. */
    public get order(): java.nio.ByteOrder {
        return this.#byteOrder;
    }

    /** Modifies this buffer's byte order. */
    public set order(bo: java.nio.ByteOrder) {
        this.#byteOrder = bo;
    }

    /** Creates a new byte buffer whose content is a shared subsequence of this buffer's content. */
    public slice(): C;
    public slice(index: number, length: number): C;
    public slice(index?: number, length?: number): C {
        if (index !== undefined && length !== undefined) {
            return new this.bufferConstructor(this.#array.slice(index, index + length));
        }

        return new this.bufferConstructor(this.#array);
    }

    /** @returns a string summarizing the state of this buffer. */
    public toString(): java.lang.String {
        return S`${this.constructor.name}[pos=${this.position()} lim=${this.limit} cap=${this.capacity()}]`;
    }

}
