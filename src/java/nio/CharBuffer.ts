/* java2ts: keep */

/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import type { char, int } from "../../types";
import { convertStringToUTF16, convertUTF16ToString } from "../../string-helpers";

import { JavaString } from "../lang/String";

import type { Appendable } from "../lang/Appendable";
import type { CharSequence } from "../lang/CharSequence";
import type { Readable } from "../lang/Readable";

import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { ReadOnlyBufferException } from "./ReadOnlyBufferException";
import { BufferOverflowException } from "./BufferOverflowException";
import { BufferUnderflowException } from "./BufferUnderflowException";

import { BufferImpl } from "./BufferImpl";

export class CharBuffer extends BufferImpl<Uint16Array> implements Appendable, CharSequence, Readable {
    public constructor(capacity: int);
    public constructor(buffer: Uint16Array);
    public constructor(buffer: Uint16Array, offset: int, length: int);
    public constructor(csq: CharSequence);
    public constructor(csq: CharSequence, offset: int, length: int);
    public constructor(...args: unknown[]) {
        let array: Uint16Array;
        let offset: int | undefined;
        let length: int | undefined;

        switch (args.length) {
            case 1: {
                if (typeof args[0] === "number") {
                    array = new Uint16Array(args[0]);
                } else if (args[0] instanceof Uint16Array) {
                    array = args[0];
                } else {
                    const s = (args[0] as CharSequence).toString();
                    array = convertStringToUTF16(s.valueOf());
                }
                break;
            }

            case 3: {
                const [input, o, l] = args as [Uint16Array | CharSequence, int, int];
                if (input instanceof Uint16Array) {
                    array = input;
                } else {
                    const s = input.toString();
                    array = convertStringToUTF16(s.valueOf());
                }

                offset = o;
                length = l;
                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid arguments"));
            }
        }

        super(array, offset ?? 0, length ?? array.length);
    }

    /**
     * Allocates a new char buffer.
     *
     * @param capacity The new buffer capacity.
     *
     * @returns The allocated char buffer.
     */
    public static allocate(capacity: int): CharBuffer {
        return new CharBuffer(capacity);
    }

    /** Wraps a char array into a buffer. */
    public static wrap(array: Uint16Array): CharBuffer;
    /** Wraps a char array into a buffer. */
    public static wrap(array: Uint16Array, offset: int, length: int): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: CharSequence): CharBuffer;
    /** Wraps a character sequence into a buffer. */
    public static wrap(csq: CharSequence, start: int, end: int): CharBuffer;
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
                const [input, offset, endOrLength] = args as [Uint16Array | CharSequence, int, int];
                if (input instanceof Uint16Array) {
                    if (offset < 0 || endOrLength < 0 || offset + endOrLength > input.length) {
                        throw new IndexOutOfBoundsException();
                    }

                    return new CharBuffer(input, offset, endOrLength);
                } else {
                    if (offset < 0 || endOrLength < 0 || offset > endOrLength || endOrLength > input.length()) {
                        throw new IndexOutOfBoundsException();
                    }

                    return new CharBuffer(input, offset, endOrLength - offset);
                }
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid int of arguments"));
            }
        }
    }

    public override duplicate(): this {
        const buffer = new CharBuffer(this.array());
        buffer.readOnly = this.readOnly;
        buffer.currentPosition = this.currentPosition;
        buffer.currentLimit = this.currentLimit;
        buffer.currentMark = this.currentMark;

        return buffer as this;
    }

    /** Appends the specified char to this buffer(optional operation). */
    public append(c: char): this;
    /** Appends the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence | null): this;
    /** Appends a subsequence of the specified character sequence to this buffer(optional operation). */
    public append(csq: CharSequence | null, start: int, end: int): this;
    public append(...args: unknown[]): this {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        switch (args.length) {
            case 1: {
                const c = args[0] as char | CharSequence | null;
                if (typeof c === "number") {
                    if (this.position() === this.limit()) {
                        throw new BufferOverflowException();
                    }

                    this.array()[this.currentPosition++] = c;
                } else {
                    const s = c ?? new JavaString("null");
                    if (this.currentPosition + s.length() >= this.limit()) {
                        throw new BufferOverflowException();
                    }

                    const value = convertStringToUTF16(s.toString().valueOf());
                    this.array().set(value, this.currentPosition);
                    this.currentPosition += value.length;
                }

                break;
            }

            case 3: {
                const [csq, start, end] = args as [CharSequence | null, int, int];
                const s = csq ?? new JavaString("null");
                if (start < 0 || end < 0 || start > end || end > s.length()) {
                    throw new IndexOutOfBoundsException();
                }

                if (this.currentPosition + end - start >= this.limit()) {
                    throw new BufferOverflowException();
                }

                const value = convertStringToUTF16(s.toString().valueOf());
                this.array().set(value.subarray(start, end), this.currentPosition);
                this.currentPosition += end - start;
                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid int of arguments");
            }
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
    public charAt(index: int): char | null {
        return this.array().at(index) ?? null;
    }

    /**
     * Compares this buffer to another.
     *
     * @param that The other buffer.
     *
     * @returns < 0 if this buffer is less than the given buffer, 0 for equality and > 0 if larger.
     */
    public override compareTo(that: CharBuffer): int {
        return this.toString().valueOf().localeCompare(that.toString().valueOf());
    }

    /** @returns the length of this character buffer. */
    public length(): int {
        return this.remaining();
    }

    public get(): char;
    public get(dst: char[]): this;
    public get(dst: char[], offset: int, length: int): this;
    public get(index: int): char;
    public get(dstOrIndex?: char[] | int, offset?: int, length?: int): char | this {
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

    /** Relative put method  (optional operation). */
    public put(c: char): this;
    /** Relative bulk put method  (optional operation). */
    public put(src: Uint16Array): this;
    /** Relative bulk put method  (optional operation). */
    public put(src: Uint16Array, offset: int, length: int): this;
    /** Absolute put method  (optional operation). */
    public put(index: int, c: char): this;
    /** Relative bulk put method  (optional operation). */
    public put(src: JavaString | string): this;
    /** Relative bulk put method  (optional operation). */
    public put(src: JavaString | string, start: int, end: int): this;
    /** Relative bulk put method  (optional operation). */
    public put(src: CharBuffer): this;
    public put(...args: unknown[]): this {
        if (this.isReadOnly()) {
            throw new ReadOnlyBufferException();
        }

        switch (args.length) {
            case 1: {
                const cOrSrc = args[0] as char | Uint16Array | CharBuffer | JavaString | string;
                if (typeof cOrSrc === "number") {
                    if (this.currentPosition === this.limit()) {
                        throw new BufferOverflowException();
                    }

                    this.array()[this.currentPosition++] = cOrSrc;
                } else if (cOrSrc instanceof Uint16Array) {
                    if (this.currentPosition + cOrSrc.length >= this.limit()) {
                        throw new BufferOverflowException();
                    }

                    this.array().set(cOrSrc, this.currentPosition);
                    this.currentPosition += cOrSrc.length;
                } else if (cOrSrc instanceof CharBuffer) {
                    if (this.currentPosition + cOrSrc.remaining() >= this.limit()) {
                        throw new BufferOverflowException();
                    }

                    this.array().set(cOrSrc.array(), this.currentPosition);
                    this.currentPosition += cOrSrc.remaining();
                } else {
                    const s = cOrSrc.toString().valueOf();
                    if (this.currentPosition + s.length >= this.limit()) {
                        throw new BufferOverflowException();
                    }

                    const value = convertStringToUTF16(s);
                    this.array().set(value, this.currentPosition);
                    this.currentPosition += value.length;
                }

                break;
            }

            case 2: {
                const [index, c] = args as [int, char];
                if (index < 0 || index >= this.currentLimit) {
                    throw new IndexOutOfBoundsException();
                }

                this.array()[index] = c;

                break;
            }

            case 3: {
                const [src, offset, lengthOrEnd] = args as [Uint16Array | JavaString | string, int, int];
                const length = src instanceof Uint16Array ? lengthOrEnd : lengthOrEnd - offset;
                if (length > 0) {
                    const end = src instanceof Uint16Array ? offset + lengthOrEnd : lengthOrEnd;
                    if (offset < 0 || end < 0 || end > src.length) {
                        throw new IndexOutOfBoundsException();
                    }

                    if (this.currentPosition + length > this.limit()) {
                        throw new BufferOverflowException();
                    }

                    if (src instanceof Uint16Array) {
                        this.array().set(src.subarray(offset, end), this.currentPosition);
                    } else {
                        const value = convertStringToUTF16(src.toString().valueOf());
                        this.array().set(value.subarray(offset, end), this.currentPosition);
                    }

                    this.currentPosition += length;
                }

                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid int of arguments");
            }
        }

        return this;
    }

    /**
     * Attempts to read characters into the specified character buffer.
     *
     * @param target The buffer to write the content to.
     *
     * @returns The int of characters added to the buffer, or -1 if this source of characters is at its end.
     */
    public read(target: CharBuffer): int {
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

    public slice(): CharBuffer {
        return new CharBuffer(this.array());
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
    public subSequence(start: int, end: int): CharBuffer {
        if (start < 0 || start > this.remaining() || end < start || end > this.remaining()) {
            throw new IndexOutOfBoundsException();
        }

        const buffer = new CharBuffer(this.array(), this.currentPosition + start, this.currentPosition + end);

        return this.isReadOnly() ? buffer.asReadOnlyBuffer() : buffer;
    }

    /** @returns a string containing the characters in this buffer. */
    public override toString(): JavaString {
        return new JavaString(convertUTF16ToString(this.array().subarray(this.currentPosition, this.currentLimit)));
    }

    /*protected [Symbol.toPrimitive](hint: string): string {
        return this.toString().valueOf();
    }*/

}
