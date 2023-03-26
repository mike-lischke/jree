/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../types";

import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";

import { BufferImpl } from "./BufferImpl";
import { BufferOverflowException } from "./BufferOverflowException";
import { BufferUnderflowException } from "./BufferUnderflowException";
import { ReadOnlyBufferException } from "./ReadOnlyBufferException";

export class IntBuffer extends BufferImpl<Int32Array> {
    protected constructor(capacity: number);
    protected constructor(buffer: Int32Array);
    protected constructor(buffer: Int32Array, offset: int, length: int);
    protected constructor(...args: unknown[]) {
        let array: Int32Array;
        let offset = 0;
        let length = 0;

        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    array = new Int32Array(args[0]);
                } else {
                    array = args[0] as Int32Array;
                }

                length = array.length;

                break;
            }

            case 3: {
                [array, offset, length] = args as [Int32Array, int, int];

                break;
            }

            default: {
                throw new IllegalArgumentException("Wrong number of arguments");
            }
        }

        super(array, offset, length);
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

    public override duplicate(): this {
        const buffer = new IntBuffer(this.array());
        buffer.readOnly = this.readOnly;
        buffer.currentPosition = this.currentPosition;
        buffer.currentLimit = this.currentLimit;
        buffer.currentMark = this.currentMark;

        return buffer as this;
    }

    public get(index?: number): number;
    public get(dst: Int32Array): this;
    public get(dst: Int32Array, offset: number, length: number): this;
    public get(indexOrDst?: number | Int32Array, offset?: number, length?: number): number | this {
        if (indexOrDst === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new BufferUnderflowException();
            }

            return this.array()[this.currentPosition++];
        } else if (typeof indexOrDst === "number") {
            if (indexOrDst < 0 || indexOrDst >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }

            return this.array()[indexOrDst];
        } else {
            offset ??= 0;
            length ??= indexOrDst.length;

            if (length > this.remaining()) {
                throw new BufferUnderflowException();
            }

            if (offset < 0 || length < 0 || offset + length >= indexOrDst.length) {
                throw new IndexOutOfBoundsException();
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
            throw new ReadOnlyBufferException();
        }

        if (typeof valueOrSrcOrIndex === "number") {
            if (valueOrOffset === undefined) {
                if (this.remaining() === 0) {
                    throw new BufferOverflowException();
                }

                this.array()[this.currentPosition++] = valueOrSrcOrIndex;
            } else {
                if (valueOrOffset < 0 || valueOrOffset >= this.currentLimit) {
                    throw new IndexOutOfBoundsException();
                }

                this.array()[valueOrSrcOrIndex] = valueOrOffset;
            }
        } else if (valueOrSrcOrIndex instanceof IntBuffer) {
            if (valueOrSrcOrIndex === this) {
                throw new IllegalArgumentException();
            }

            const count = valueOrSrcOrIndex.remaining();
            if (this.remaining() < count) {
                throw new BufferOverflowException();
            }

            this.array().set(valueOrSrcOrIndex.array().subarray(valueOrSrcOrIndex.currentPosition,
                valueOrSrcOrIndex.currentLimit), this.currentPosition);

            this.currentPosition += count;
            valueOrSrcOrIndex.currentPosition += count;
        } else {
            const offset = valueOrOffset ?? 0;
            const count = length ?? valueOrSrcOrIndex.length;

            if (offset < 0 || count < 0 || offset + count >= valueOrSrcOrIndex.length) {
                throw new IndexOutOfBoundsException();
            }

            if (count > this.remaining()) {
                throw new BufferOverflowException();
            }

            this.array().set(valueOrSrcOrIndex.subarray(offset, offset + count), this.currentPosition);
            this.currentPosition += count;
        }

        return this;
    }

    public slice(): IntBuffer {
        return new IntBuffer(this.array());
    }
}
