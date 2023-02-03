/* java2ts: keep */

/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/unified-signatures */

import { java } from "../..";

import { char } from "../lang";
import { BufferImpl } from "./BufferImpl";

export class CharBuffer extends BufferImpl<Uint16Array, CharBuffer>
    implements java.lang.Appendable, java.lang.CharSequence, java.lang.Readable {

    public constructor(capacity: number);
    public constructor(buffer: Uint16Array, offset?: number, length?: number);
    public constructor(csq: java.lang.CharSequence, offset?: number, length?: number);
    public constructor(s: java.lang.String, offset?: number, length?: number);
    public constructor(capacityOrBufferOrCsqOrS: number | Uint16Array | java.lang.String | java.lang.CharSequence,
        offset?: number, length?: number) {
        let backBuffer;
        if (typeof capacityOrBufferOrCsqOrS === "number") {
            backBuffer = new ArrayBuffer(2 * capacityOrBufferOrCsqOrS);
        } else if (capacityOrBufferOrCsqOrS instanceof Uint16Array) {
            backBuffer = capacityOrBufferOrCsqOrS.buffer;
        } else if (capacityOrBufferOrCsqOrS instanceof java.lang.String) {
            backBuffer = capacityOrBufferOrCsqOrS.toCharArray().buffer;
        } else {
            backBuffer = capacityOrBufferOrCsqOrS.toString().toCharArray().buffer;
        }

        super(backBuffer, Uint16Array, CharBuffer, offset, length);
    }

    /**
     * Allocates a new char buffer.
     *
     * @param capacity The new buffer capacity.
     *
     * @returns The allocated char buffer.
     */
    public static allocate(capacity: number): CharBuffer {
        return new CharBuffer(capacity);
    }

    /** Wraps a char array into a buffer. */
    public static wrap(s: java.lang.String): CharBuffer;
    /** Wraps a char array into a buffer. */
    public static wrap(s: java.lang.String, offset: number, length: number): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: java.lang.CharSequence): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: java.lang.CharSequence, start: number, end: number): CharBuffer;
    public static wrap(sOrCsq: java.lang.String | java.lang.CharSequence, offsetOrStart?: number,
        lengthOrEnd?: number): CharBuffer {
        if (sOrCsq instanceof java.lang.String) {
            if (offsetOrStart !== undefined && lengthOrEnd !== undefined) {
                if (offsetOrStart < 0 || offsetOrStart > sOrCsq.length() || lengthOrEnd < 0
                    || lengthOrEnd > sOrCsq.length() - offsetOrStart) {
                    throw new java.lang.IndexOutOfBoundsException();
                }
            }

            return new CharBuffer(sOrCsq, offsetOrStart, lengthOrEnd);
        } else {
            if (offsetOrStart !== undefined && lengthOrEnd !== undefined) {
                if (offsetOrStart < 0 || offsetOrStart > sOrCsq.length() || lengthOrEnd < offsetOrStart
                    || lengthOrEnd > sOrCsq.length()) {
                    throw new java.lang.IndexOutOfBoundsException();
                }
            }

            const buffer = new CharBuffer(sOrCsq, offsetOrStart, lengthOrEnd);
            buffer.currentPosition = offsetOrStart ?? 0;
            buffer.currentLimit = lengthOrEnd ?? sOrCsq.length();

            return buffer.asReadOnlyBuffer();
        }
    }

    /** Appends the specified char to this buffer(optional operation). */
    public append(c: char): this;
    /** Appends the specified character sequence to this buffer(optional operation). */
    public append(csq: java.lang.CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this buffer(optional operation). */
    public append(csq: java.lang.CharSequence, start: number, end: number): this;
    public append(cOrCsq: char | java.lang.CharSequence, start?: number, end?: number): this {
        if (this.isReadOnly()) {
            throw new java.nio.ReadOnlyBufferException();
        }

        if (typeof cOrCsq === "number") {
            if (this.position() === this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            this.array()[this.currentPosition++] = cOrCsq;
        } else {
            start ??= 0;
            end ??= cOrCsq.length();
            if (start < 0 || end < 0 || start > end || end > cOrCsq.length()) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (this.currentPosition + cOrCsq.length() >= this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            const array: char[] = [];
            for (let i = start; i < end; ++i) {
                array.push(cOrCsq.charAt(i)!);
            }

            this.array().set(array, this.currentPosition);
            this.currentPosition += end - start;
        }

        return this;
    }

    /**
     * Reads the character at the given index relative to the current position.
     *
     * @param index The char index.
     *
     * @returns The code point at this position.
     */
    public charAt(index: number): char | undefined {
        return this.array().at(index);
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns < 0 if this buffer is less than the given buffer, 0 for equality and > 0 if larger.
     */
    public compareTo(that: CharBuffer): number {
        return this.toString().compareTo(that.toString());
    }

    /** @returns the length of this character buffer. */
    public length(): number {
        return this.remaining();
    }

    public get(): char;
    public get(dst: char[]): this;
    public get(dst: char[], offset: number, length: number): this;
    public get(index: number): char;
    public get(dstOrIndex?: char[] | number, offset?: number, length?: number): char | this {
        if (dstOrIndex === undefined) {
            if (this.currentPosition >= this.currentLimit) {
                throw new java.nio.BufferUnderflowException();
            }

            return this.array()[this.currentPosition++];
        } else if (typeof dstOrIndex === "number") {
            if (dstOrIndex >= this.currentLimit) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            return this.array()[dstOrIndex];
        } else {
            offset ??= 0;
            length ??= dstOrIndex.length;

            if (offset + length >= this.currentLimit) {
                throw new java.nio.BufferUnderflowException();
            }

            dstOrIndex.splice(offset, length,
                ...this.array().slice(this.currentPosition, this.currentPosition + length));

            this.currentPosition += length;

            return this;
        }
    }

    /** Writes data to this buffer */
    public put(c: char): this;
    public put(src: Uint16Array): this;
    public put(src: Uint16Array, offset: number, length: number): this;
    public put(src: CharBuffer): this;
    public put(index: number, c: char): this;
    public put(src: string): this;
    public put(src: string, start: number, end: number): this;
    public put(cOrSrcOrIndex: char | Uint16Array | CharBuffer | number | string,
        offsetOrCOrStart?: number | char, lengthOrEnd?: number): this {

        if (this.isReadOnly()) {
            throw new java.nio.ReadOnlyBufferException();
        }

        if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart === undefined) {
            // A single code point, relative.
            if (this.currentPosition === this.limit) {
                throw new java.nio.BufferOverflowException();
            }

            this.array()[this.currentPosition++] = cOrSrcOrIndex;
        } else if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart !== undefined) {
            // A single code point absolute.
            if (cOrSrcOrIndex < 0 || cOrSrcOrIndex >= this.currentLimit) {
                throw new java.lang.IndexOutOfBoundsException();
            }
            this.array()[cOrSrcOrIndex] = offsetOrCOrStart;
        } else if (cOrSrcOrIndex instanceof Uint16Array) {
            // A code point sequence.
            const offset = offsetOrCOrStart ?? 0;
            const length = lengthOrEnd ?? cOrSrcOrIndex.length;

            if (offset < 0 || offset + length > cOrSrcOrIndex.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            if (length > this.remaining()) {
                throw new java.nio.BufferOverflowException();
            }

            this.array().set(cOrSrcOrIndex.subarray(offset, offset + length), this.currentPosition);
            this.currentPosition += length;
        } else if (cOrSrcOrIndex instanceof CharBuffer) {
            const length = cOrSrcOrIndex.remaining();
            if (this.currentPosition + length > this.currentLimit) {
                throw new java.nio.BufferOverflowException();
            }

            if (cOrSrcOrIndex === this) {
                throw new java.lang.IllegalArgumentException();
            }

            this.array().set(cOrSrcOrIndex.array().slice(cOrSrcOrIndex.currentPosition, cOrSrcOrIndex.currentLimit),
                this.currentPosition);

            this.currentPosition += length;
        } else {
            // A string.
            const src = cOrSrcOrIndex as string;
            const offset = offsetOrCOrStart ?? 0;
            const end = lengthOrEnd ?? src.length;
            if (this.currentPosition + end > this.currentLimit) {
                throw new java.nio.BufferOverflowException();
            }

            if (offset < 0 || offset > src.length) {
                throw new java.lang.IndexOutOfBoundsException();
            }

            for (let i = offset; i < end; ++i) {
                this.array()[this.currentPosition++] = src.charCodeAt(i);
            }
        }

        return this;
    }

    /**
     * Attempts to read characters into the specified character buffer.
     *
     * @param target The buffer to write the content to.
     *
     * @returns The number of characters added to the buffer, or -1 if this source of characters is at its end.
     */
    public read(target: CharBuffer): number {
        if (target.isReadOnly()) {
            throw new java.nio.ReadOnlyBufferException();
        }

        const length = Math.min(this.remaining(), target.remaining());
        const result = length === target.remaining() ? -1 : length;
        target.array().set(this.array().slice(this.currentPosition, this.currentPosition + length),
            target.currentPosition);
        target.currentPosition += length;

        return result;
    }

    /**
     * Creates a new character buffer that represents the specified subsequence of this buffer, relative to
     * the current position.
     *
     * @param start tbd
     * @param end tbd
     *
     * @returns The new char buffer.
     */
    public subSequence(start: number, end: number): CharBuffer {
        if (start < 0 || start > this.remaining() || end < start || end > this.remaining()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        const buffer = new CharBuffer(this.array(), this.currentPosition + start, this.currentPosition + end);

        return this.isReadOnly() ? buffer.asReadOnlyBuffer() : buffer;
    }

    /** @returns a string containing the characters in this buffer. */
    public toString(): java.lang.String {
        return new java.lang.String(
            String.fromCharCode(...this.array().subarray(this.currentPosition, this.currentLimit)));
    }

}
