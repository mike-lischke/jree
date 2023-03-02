/* java2ts: keep */

/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../..";
import { char } from "../lang";

import { Appendable } from "../lang/Appendable";
import { CharSequence } from "../lang/CharSequence";
import { Readable } from "../lang/Readable";

import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { ReadOnlyBufferException } from "./ReadOnlyBufferException";
import { BufferOverflowException } from "./BufferOverflowException";
import { BufferUnderflowException } from "./BufferUnderflowException";

import { BufferImpl } from "./BufferImpl";

export class CharBuffer extends BufferImpl<Uint16Array, CharBuffer> implements Appendable, CharSequence, Readable {
    public constructor(capacity: number);
    public constructor(buffer: Uint16Array);
    public constructor(buffer: Uint16Array, offset: number, length: number);
    public constructor(csq: CharSequence);
    public constructor(csq: CharSequence, offset: number, length: number);
    public constructor(...args: unknown[]) {
        let backBuffer;
        let offset: number | undefined;
        let length: number | undefined;

        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    backBuffer = new ArrayBuffer(2 * args[0]);
                } else if (args[0] instanceof Uint16Array) {
                    backBuffer = args[0].buffer;
                } else {
                    const s = (args[0] as CharSequence).toString();
                    backBuffer = new Uint16Array(s.length);
                    for (let i = 0; i < s.length; ++i) {
                        backBuffer[i] = s.charCodeAt(i);
                    }
                }
                break;
            }

            case 3: {
                const [input, o, l] = args as [Uint16Array | CharSequence, number, number];
                if (input instanceof Uint16Array) {
                    backBuffer = input.buffer;
                } else {
                    const s = (args[0] as CharSequence).toString();
                    backBuffer = new Uint16Array(s.length);
                    for (let i = 0; i < s.length; ++i) {
                        backBuffer[i] = s.charCodeAt(i);
                    }
                }

                offset = o;
                length = l;
                break;
            }

            default: {
                throw new IllegalArgumentException(S`Invalid arguments`);
            }
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
    public static wrap(array: Uint16Array): CharBuffer;
    /** Wraps a char array into a buffer. */
    public static wrap(array: Uint16Array, offset: number, length: number): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: CharSequence): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: CharSequence, start: number, end: number): CharBuffer;
    public static wrap(...args: unknown[]): CharBuffer {
        switch (args.length) {
            case 1: {
                const input = args[0] as Uint16Array | CharSequence;
                if (input instanceof Uint16Array) {
                    return new CharBuffer(input);
                } else {
                    return new CharBuffer(input);
                }
            }

            case 3: {
                const input = args[0] as Uint16Array | CharSequence;
                if (input instanceof Uint16Array) {
                    const [offset, length] = args as [number, number];
                    if (offset < 0 || length < 0 || offset + length > input.length) {
                        throw new IndexOutOfBoundsException();
                    }

                    return new CharBuffer(input, offset, length);
                } else {
                    const [start, end] = args as [number, number];
                    if (start < 0 || end < 0 || start > end || end > input.length()) {
                        throw new IndexOutOfBoundsException();
                    }

                    return new CharBuffer(input, start, end - start);
                }
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public [Symbol.toPrimitive](): string {
        return this.toString().valueOf();
    }

    /** Appends the specified char to this buffer(optional operation). */
    public append(c: char): this;
    /** Appends the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence): this;
    /** Appends a subsequence of the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence, start: number, end: number): this;
    public append(cOrCsq: char | CharSequence, start?: number, end?: number): this {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        if (typeof cOrCsq === "number") {
            if (this.position() === this.limit()) {
                throw new BufferOverflowException();
            }

            this.array()[this.currentPosition++] = cOrCsq;
        } else {
            start ??= 0;
            end ??= cOrCsq.length();
            if (start < 0 || end < 0 || start > end || end > cOrCsq.length()) {
                throw new IndexOutOfBoundsException();
            }

            if (this.currentPosition + cOrCsq.length() >= this.limit()) {
                throw new BufferOverflowException();
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
    public charAt(index: number): char | null {
        return this.array().at(index) ?? null;
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns < 0 if this buffer is less than the given buffer, 0 for equality and > 0 if larger.
     */
    public compareTo(that: CharBuffer): number {
        return this.toString().localeCompare(that.toString());
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
                throw new BufferUnderflowException();
            }

            return this.array()[this.currentPosition++];
        } else if (typeof dstOrIndex === "number") {
            if (dstOrIndex >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }

            return this.array()[dstOrIndex];
        } else {
            offset ??= 0;
            length ??= dstOrIndex.length;

            if (offset + length >= this.currentLimit) {
                throw new BufferUnderflowException();
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
            throw new ReadOnlyBufferException();
        }

        if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart === undefined) {
            // A single code point, relative.
            if (this.currentPosition === this.limit()) {
                throw new BufferOverflowException();
            }

            this.array()[this.currentPosition++] = cOrSrcOrIndex;
        } else if (typeof cOrSrcOrIndex === "number" && offsetOrCOrStart !== undefined) {
            // A single code point absolute.
            if (cOrSrcOrIndex < 0 || cOrSrcOrIndex >= this.currentLimit) {
                throw new IndexOutOfBoundsException();
            }
            this.array()[cOrSrcOrIndex] = offsetOrCOrStart;
        } else if (cOrSrcOrIndex instanceof Uint16Array) {
            // A code point sequence.
            const offset = offsetOrCOrStart ?? 0;
            const length = lengthOrEnd ?? cOrSrcOrIndex.length;

            if (offset < 0 || offset + length > cOrSrcOrIndex.length) {
                throw new IndexOutOfBoundsException();
            }

            if (length > this.remaining()) {
                throw new BufferOverflowException();
            }

            this.array().set(cOrSrcOrIndex.subarray(offset, offset + length), this.currentPosition);
            this.currentPosition += length;
        } else if (cOrSrcOrIndex instanceof CharBuffer) {
            const length = cOrSrcOrIndex.remaining();
            if (this.currentPosition + length > this.currentLimit) {
                throw new BufferOverflowException();
            }

            if (cOrSrcOrIndex === this) {
                throw new IllegalArgumentException();
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
                throw new BufferOverflowException();
            }

            if (offset < 0 || offset > src.length) {
                throw new IndexOutOfBoundsException();
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
            throw new ReadOnlyBufferException();
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
            throw new IndexOutOfBoundsException();
        }

        const buffer = new CharBuffer(this.array(), this.currentPosition + start, this.currentPosition + end);

        return this.isReadOnly() ? buffer.asReadOnlyBuffer() : buffer;
    }

    /** @returns a string containing the characters in this buffer. */
    public toString(): string {
        return String.fromCharCode(...this.array().subarray(this.currentPosition, this.currentLimit));
    }

}
