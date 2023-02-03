/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { java } from "../..";
import { BufferImpl } from "./BufferImpl";

export class IntBuffer extends BufferImpl<Int32Array, IntBuffer> {
    /** @deprecated Use {@link ByteBuffer.allocate} */
    public constructor(capacity: number);
    /** @deprecated Use {@link ByteBuffer.wrap} */
    public constructor(buffer: Int32Array, offset?: number, length?: number);
    public constructor(capacityOrBuffer: number | Int32Array, offset?: number, length?: number) {
        let backBuffer;

        if (typeof capacityOrBuffer === "number") {
            backBuffer = new ArrayBuffer(capacityOrBuffer);
        } else {
            backBuffer = capacityOrBuffer.buffer;
        }

        super(backBuffer, Int32Array, IntBuffer, offset, length);
    }

    /**
     * Allocates a new int buffer.
     *
     * @param capacity tbd
     *
     * @returns tbd
     */
    public static allocate(capacity: number): IntBuffer {
        return new IntBuffer(capacity);
    }

    public static wrap(array: Int32Array, offset?: number, length?: number): IntBuffer {
        if (offset !== undefined && length !== undefined) {
            return new IntBuffer(array, offset, offset + length);
        }

        return new IntBuffer(array);
    }

    public get(index?: number): number;
    public get(dst: Int32Array): this;
    public get(dst: Int32Array, offset: number, length: number): this;
    public get(indexOrDst?: number | Int32Array, offset?: number, length?: number): number | this {
        if (indexOrDst === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new java.nio.BufferUnderflowException();
            }

            return this.array()[this.currentPosition++];
        } else if (typeof indexOrDst === "number") {
            if (indexOrDst < 0 || indexOrDst >= this.currentLimit) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            return this.array()[indexOrDst];
        } else {
            offset ??= 0;
            length ??= indexOrDst.length;

            if (length > this.remaining()) {
                throw new java.nio.BufferUnderflowException();
            }

            if (offset < 0 || length < 0 || offset + length >= indexOrDst.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            indexOrDst.set(this.array().slice(this.currentPosition, this.currentPosition + length), offset);

            this.currentPosition += length;

            return this;
        }
    }

    public put(value: number): this;
    public put(src: Int32Array | IntBuffer): this;
    public put(index: number, value: number): this;
    public put(src: Int32Array, offset: number, length: number): this;
    public put(valueOrSrcOrIndex: number | Int32Array | IntBuffer, valueOrOffset?: number, length?: number): this {
        if (this.isReadOnly()) {
            throw new java.nio.ReadOnlyBufferException();
        }

        if (typeof valueOrSrcOrIndex === "number") {
            if (valueOrOffset === undefined) {
                if (this.remaining() === 0) {
                    throw new java.nio.BufferOverflowException();
                }

                this.array()[this.currentPosition++] = valueOrSrcOrIndex;
            } else {
                if (valueOrOffset < 0 || valueOrOffset >= this.currentLimit) {
                    throw new java.lang.IndexOutOfBoundsException();
                }

                this.array()[valueOrSrcOrIndex] = valueOrOffset;
            }
        } else if (valueOrSrcOrIndex instanceof IntBuffer) {
            if (valueOrSrcOrIndex === this) {
                throw new java.lang.IllegalArgumentException();
            }

            const count = valueOrSrcOrIndex.remaining();
            if (this.remaining() < count) {
                throw new java.nio.BufferOverflowException();
            }

            this.array().set(valueOrSrcOrIndex.array().subarray(valueOrSrcOrIndex.currentPosition,
                valueOrSrcOrIndex.currentLimit), this.currentPosition);

            this.currentPosition += count;
            valueOrSrcOrIndex.currentPosition += count;
        } else {
            const offset = valueOrOffset ?? 0;
            const count = length ?? valueOrSrcOrIndex.length;

            if (offset < 0 || count < 0 || offset + count >= valueOrSrcOrIndex.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (count > this.remaining()) {
                throw new java.nio.BufferOverflowException();
            }

            this.array().set(valueOrSrcOrIndex.subarray(offset, offset + count), this.currentPosition);
            this.currentPosition += count;
        }

        return this;
    }
}
