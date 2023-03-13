/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { char } from "../../types";

import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { BufferImpl } from "./BufferImpl";
import { BufferOverflowException } from "./BufferOverflowException";
import { BufferUnderflowException } from "./BufferUnderflowException";
import { CharBuffer } from "./CharBuffer";
import { IntBuffer } from "./IntBuffer";
import { ReadOnlyBufferException } from "./ReadOnlyBufferException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

/**
 * A byte buffer.
 *
 * This class defines six categories of operations upon byte buffers:
 * - Absolute and relative get and put methods that read and write single bytes;
 * - Absolute and relative bulk get methods that transfer contiguous sequences of bytes from this buffer into an array;
 * - Absolute and relative bulk put methods that transfer contiguous sequences of bytes from a byte array or some other
 * byte buffer into this buffer;
 * - Absolute and relative get and put methods that read and write values of other primitive types, translating them to
 * and from sequences of bytes in a particular byte order;
 * - Methods for creating view buffers, which allow a byte buffer to be viewed as a buffer containing values of some
 * other primitive type; and
 * - A method for compacting a byte buffer.
 *
 * Byte buffers can be created either by allocation, which allocates space for the buffer's content, or by wrapping an
 * existing byte array into a buffer.
 */
export class ByteBuffer extends BufferImpl<Int8Array, ByteBuffer> {
    // Another view on the raw data for primitive value manipulation.
    #buffer: DataView;

    /** @deprecated Use {@link ByteBuffer.allocate} */
    public constructor(capacity: number);
    /** @deprecated Use {@link ByteBuffer.wrap} */
    public constructor(buffer: Int8Array, offset?: number, length?: number);
    public constructor(capacityOrBuffer: number | Int8Array, offset?: number, length?: number) {
        let backBuffer;
        if (typeof capacityOrBuffer === "number") {
            backBuffer = new ArrayBuffer(capacityOrBuffer);
        } else {
            backBuffer = capacityOrBuffer.buffer;
        }

        super(backBuffer, Int8Array, ByteBuffer, offset, length);
        this.#buffer = new DataView(backBuffer, offset, length);
    }

    /**
     * Allocates a new char buffer.
     *
     * @param capacity The new buffer capacity.
     *
     * @returns The allocated char buffer.
     */
    public static allocate(capacity: number): ByteBuffer {
        return new ByteBuffer(capacity);
    }

    public static wrap(array: Int8Array, offset?: number, length?: number): ByteBuffer {
        if (offset !== undefined && length !== undefined) {
            return new ByteBuffer(array, offset, offset + length);
        }

        return new ByteBuffer(array);
    }

    /**
     * Creates a view of this byte buffer as a char buffer.
     *
     * @returns A new char buffer.
     */
    public asCharBuffer(): CharBuffer {
        return CharBuffer.wrap(new Uint16Array(this.backBuffer, this.#buffer.byteOffset, this.#buffer.byteLength));
    }

    /** Creates a view of this byte buffer as a double buffer. */
    // public asDoubleBuffer(): DoubleBuffer;

    /** Creates a view of this byte buffer as a float buffer. */
    // public FloatBuffer asFloatBuffer(): FloatBuffer;

    /**
     * Creates a view of this byte buffer as an int buffer.
     *
     * @returns A new int buffer.
     */
    public asIntBuffer(): IntBuffer {
        return new IntBuffer(new Int32Array(this.backBuffer, this.#buffer.byteOffset,
            this.#buffer.byteLength));
    }

    /** Creates a view of this byte buffer as a long buffer. */
    // public asLongBuffer(): LongBuffer

    public get(): number;
    public get(dst: Int8Array): this;
    public get(dst: Int8Array, offset: number, length: number): this;
    public get(index: number): number;
    public get(index: number, dst: Int8Array): this;
    public get(index: number, dst: Int8Array, offset: number, length: number): this;
    public get(indexOrDst?: number | Int8Array, offsetOrDst?: number | Int8Array,
        lengthOrOffset?: number, length?: number): this | number {
        if (indexOrDst === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new BufferUnderflowException();
            }

            return this.#buffer.getUint8(this.currentPosition++);
        } else if (typeof indexOrDst === "number") {
            if (indexOrDst < 0 || indexOrDst >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }

            if (offsetOrDst === undefined) {
                return this.#buffer.getUint8(indexOrDst);
            }

            const dst = offsetOrDst as Int8Array;
            if (this.currentLimit - indexOrDst < dst.length) {
                throw new IndexOutOfBoundsException();
            }

            dst.set(this.array().subarray(lengthOrOffset ?? 0, length ?? dst.length));

            return this;
        } else {
            const offset = (offsetOrDst as number) ?? 0;
            const length = lengthOrOffset ?? indexOrDst.length;

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

    /** Relative get method for reading a char value. */
    public getChar(): char;
    /** Absolute get method for reading a char value. */
    public getChar(index: number): char;
    public getChar(index?: number): char {
        if (index === undefined) {
            return this.#buffer.getUint16(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getUint16(index, this.littleEndian);
    }

    /** Relative get method for reading a double value. */
    public getDouble(): number;
    /** Absolute get method for reading a double value. */
    public getDouble(index: number): number;
    public getDouble(index?: number): number {
        if (index === undefined) {
            return this.#buffer.getFloat64(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getFloat64(index, this.littleEndian);
    }

    /** Relative get method for reading a float value. */
    public getFloat(): number;
    /** Absolute get method for reading a float value. */
    public getFloat(index: number): number;
    public getFloat(index?: number): number {
        if (index === undefined) {
            return this.#buffer.getFloat32(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getFloat32(index, this.littleEndian);
    }

    /** Relative get method for reading an int value. */
    public getInt(): number;
    /** Absolute get method for reading an int value. */
    public getInt(index: number): number;
    public getInt(index?: number): number {
        if (index === undefined) {
            return this.#buffer.getInt32(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getInt32(index, this.littleEndian);
    }

    /** Relative get method for reading a long value. */
    public getLong(): bigint;
    /** Absolute get method for reading a long value. */
    public getLong(index: number): bigint;
    public getLong(index?: number): bigint {
        if (index === undefined) {
            return this.#buffer.getBigInt64(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getBigInt64(index, this.littleEndian);
    }

    /** Relative get method for reading a short value. */
    public getShort(): number;
    /** Absolute get method for reading a short value. */
    public getShort(index: number): number;
    public getShort(index?: number): number {
        if (index === undefined) {
            return this.#buffer.getInt16(this.currentPosition++, this.littleEndian);
        }

        if (index < 0 || index >= this.limit() - 1) {
            throw new IndexOutOfBoundsException();
        }

        return this.#buffer.getInt16(index, this.littleEndian);
    }

    public put(b: number): this;
    public put(src: Int8Array): this;
    public put(src: Int8Array, offset: number, length: number): this;
    public put(index: number, b: number): this;
    public put(index: number, src: Int8Array): this;
    public put(index: number, src: Int8Array, offset: number, length: number): this;
    public put(index: number, src: ByteBuffer, offset: number, length: number): this;
    public put(src: ByteBuffer): this;
    public put(bOrSrcOrIndex: number | Int8Array | ByteBuffer, offsetOrBOrSrc?: Int8Array | ByteBuffer | number,
        lengthOrOffset?: number, length?: number): this {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        if (typeof bOrSrcOrIndex === "number") {
            if (offsetOrBOrSrc === undefined) {
                if (this.remaining() === 0) {
                    throw new BufferOverflowException();
                }

                this.#buffer.setUint8(this.currentPosition++, bOrSrcOrIndex);
            } else if (typeof offsetOrBOrSrc === "number") {
                if (bOrSrcOrIndex < 0 || bOrSrcOrIndex >= this.currentLimit) {
                    throw new IndexOutOfBoundsException();
                }

                this.#buffer.setUint8(bOrSrcOrIndex, offsetOrBOrSrc);
            } else {
                if (offsetOrBOrSrc === this) {
                    throw new IllegalArgumentException();
                }

                const source = offsetOrBOrSrc instanceof Int8Array ? offsetOrBOrSrc : offsetOrBOrSrc.array();
                if (lengthOrOffset !== undefined && length !== undefined) {
                    this.array().set(source.subarray(lengthOrOffset, lengthOrOffset + length), bOrSrcOrIndex);
                } else {
                    this.array().set(source, bOrSrcOrIndex);
                }
            }
        } else if (bOrSrcOrIndex instanceof ByteBuffer) {
            if (bOrSrcOrIndex === this) {
                throw new IllegalArgumentException();
            }

            const count = bOrSrcOrIndex.remaining();
            if (this.remaining() < count) {
                throw new BufferOverflowException();
            }

            this.array().set(bOrSrcOrIndex.array().subarray(bOrSrcOrIndex.currentPosition, bOrSrcOrIndex.currentLimit),
                this.currentPosition);

            this.currentPosition += count;
            bOrSrcOrIndex.currentPosition += count;
        } else {
            const offset = (offsetOrBOrSrc as number) ?? 0;
            const count = (lengthOrOffset as number) ?? bOrSrcOrIndex.length;

            if (offset < 0 || count < 0 || offset + count >= bOrSrcOrIndex.length) {
                throw new IndexOutOfBoundsException();
            }

            if (count > this.remaining()) {
                throw new BufferOverflowException();
            }

            this.array().set(bOrSrcOrIndex.subarray(offset, offset + count), this.currentPosition);
            this.currentPosition += count;
        }

        return this;
    }

    /** Relative put method for writing a char value(optional operation). */
    public putChar(value: char): ByteBuffer;
    /** Absolute put method for writing a char value(optional operation). */
    public putChar(index: number, value: char): ByteBuffer;
    public putChar(valueOrIndex: number, value?: char): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 2; // UTF-16.
        if (typeof valueOrIndex === "number") {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setUint16(valueOrIndex, value ?? 0, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setUint16(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }

    /**
     * Relative put method for writing a double value(optional operation).
     *
     * @param value
     */
    public putDouble(value: number): ByteBuffer;
    /**
     * Absolute put method for writing a double value(optional operation).
     *
     * @param index
     * @param value
     */
    public putDouble(index: number, value: number): ByteBuffer;
    public putDouble(valueOrIndex: number, value?: number): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 8;
        if (value !== undefined) {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setFloat64(valueOrIndex, value, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setFloat64(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }

    /**
     * Relative put method for writing a float value(optional operation).
     *
     * @param value
     */
    public putFloat(value: number): ByteBuffer;
    /**
     * Absolute put method for writing a float value(optional operation).
     *
     * @param index
     * @param value
     */
    public putFloat(index: number, value: number): ByteBuffer;
    public putFloat(valueOrIndex: number, value?: number): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 4;
        if (value !== undefined) {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setFloat32(valueOrIndex, value, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setFloat32(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }

    /**
     * Relative put method for writing an int value(optional operation).
     *
     * @param value
     */
    public putInt(value: number): ByteBuffer;
    /**
     * Absolute put method for writing an int value(optional operation).
     *
     * @param index
     * @param value
     */
    public putInt(index: number, value: number): ByteBuffer;
    public putInt(valueOrIndex: number, value?: number): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 4;
        if (value !== undefined) {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setInt32(valueOrIndex, value, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setInt32(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }

    /**
     * Relative put method for writing a long value(optional operation).
     *
     * @param value
     */
    public putLong(value: bigint): ByteBuffer;
    /**
     * Absolute put method for writing a long value(optional operation).
     *
     * @param index
     * @param value
     */
    public putLong(index: number, value: bigint): ByteBuffer;
    public putLong(valueOrIndex: bigint | number, value?: bigint): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 8;
        if (typeof valueOrIndex === "number") {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setBigInt64(valueOrIndex, value!, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setBigInt64(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }

    /**
     * Relative put method for writing a short value(optional operation).
     *
     * @param value
     */
    public putShort(value: number): ByteBuffer;
    /**
     * Absolute put method for writing a short value(optional operation).
     *
     * @param index
     * @param value
     */
    public putShort(index: number, value: number): ByteBuffer;
    public putShort(valueOrIndex: number, value?: number): ByteBuffer {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        const dataSize = 2;
        if (value !== undefined) {
            if (valueOrIndex < 0 || valueOrIndex > this.limit() - dataSize) {
                throw new BufferOverflowException();
            }

            this.#buffer.setInt16(valueOrIndex, value, this.littleEndian);
        } else {
            if (this.remaining() < dataSize) {
                throw new BufferUnderflowException();
            }

            this.#buffer.setInt16(this.currentPosition, valueOrIndex,
                this.littleEndian);
            this.currentPosition += dataSize;
        }

        return this;
    }
}
