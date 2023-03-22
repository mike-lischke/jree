/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "./String";
import { JavaObject } from "./Object";
import { IndexOutOfBoundsException } from "./IndexOutOfBoundsException";
import { CharSequence } from "./CharSequence";
import { NegativeArraySizeException } from "./NegativeArraySizeException";
import { Appendable } from "./Appendable";
import { char, double, float, int, long } from "../../types";
import {
    codePointBeforeFromUTF16, codePointFromUTF16, convertStringToUTF16, convertUTF16ToString, indexOfSubArray,
    lastIndexOfSubArray,
} from "../../string-helpers";
import { StringBuffer } from "./StringBuffer";
import { IntStream } from "../util/stream/IntStream";
import { NotImplementedError } from "../../NotImplementedError";
import { Arrays } from "../util/Arrays";

type SimpleDataType = null | undefined | boolean | number | string | bigint | JavaObject;

export class StringBuilder extends JavaObject implements CharSequence, Appendable {
    #data: Uint16Array;

    // The used length in data (which might be larger, due to removed parts).
    #currentLength = 0;

    public constructor();
    public constructor(capacity: int);
    public constructor(seq: CharSequence);
    public constructor(str: JavaString | string);
    public constructor(...args: unknown[]) {
        super();

        if (args.length > 0) {
            const arg = args[0] as int | CharSequence | JavaString | string;
            if (typeof arg === "number") {
                if (arg < 0) {
                    throw new NegativeArraySizeException();
                }

                this.#data = new Uint16Array(arg || 10);
            } else {
                this.#data = new Uint16Array(10);
                if (typeof arg === "string") {
                    this.append(arg);
                } else {
                    this.append(arg);
                }
            }
        } else {
            this.#data = new Uint16Array(10);
        }
    }

    /** Appends the string representation of the boolean argument to the sequence. */
    public append(b: boolean): this;
    /** Appends the string representation of the char argument to the sequence. */
    public append(c: char): this;
    /** Appends the string representation of the char array argument to this sequence. */
    public append(str: Uint16Array): this;
    /** Appends the string representation of a subarray of the char array argument to this sequence. */
    public append(str: Uint16Array, offset: int, length: int): this;
    /** Appends the string representation of the double argument to this sequence. */
    public append(d: double): this;
    /** Appends the string representation of the float argument to this sequence. */
    public append(f: float): this;
    /** Appends the string representation of the int argument to this sequence. */
    public append(i: int): this;
    /** Appends the string representation of the long argument to this sequence. */
    public append(l: long): this;
    /** Appends the specified CharSequence to this sequence. */
    public append(s: CharSequence | null): this;
    /** Appends a subsequence of the specified CharSequence to this sequence. */
    public append(s: CharSequence | null, start: int, end: int): this;
    /** Appends the string representation of the Object argument. */
    public append(obj: JavaObject): this;
    /** Appends the specified string to this character sequence. */
    public append(str: JavaString | string): this;
    /** Appends the specified StringBuffer to this sequence. */
    public append(sb: StringBuffer): this;
    public append(...args: unknown[]): this {
        const source = args[0] ?? new JavaString("null");
        const isCharSequence = this.isCharSequence(source);
        if (source instanceof Uint16Array || isCharSequence) {
            let start = 0;
            let end = source instanceof Uint16Array ? source.length : source.length();
            if (args.length === 3) {
                start = args[1] as int;
                end = args[2] as int;

                if (!isCharSequence) {
                    end += start;
                }

                const length = source instanceof Uint16Array ? source.length : source.length();
                if (start < 0 || start > end || end > length) {
                    throw new IndexOutOfBoundsException();
                }
            }

            this.insertListData(this.#currentLength, source, start, end);
        } else {
            this.insertData(this.#currentLength, args[0] as SimpleDataType);
        }

        return this;
    }

    /**
     * Appends the string representation of the codePoint argument to this sequence.
     *
     * @param c The character to add.
     *
     * @returns this.
     */
    public appendCodePoint(c: int): this {
        this.append(String.fromCodePoint(c));

        return this;
    }

    /** @returns the current capacity. */
    public capacity(): int {
        return this.#currentLength;
    }

    /**
     * @returns the char value in this sequence at the specified index.
     *
     * @param index The index of the value to be returned.
     */
    public charAt(index: int): char {
        if (index < 0 || index >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        return this.#data.at(index)!;
    }

    /** Returns a stream of int zero-extending the char values from this sequence. */
    public chars(): IntStream {
        throw new NotImplementedError();
    }

    /**
     * Not part of the official Java API for `StringBuffer` but something that should exist.
     * Resets the content of this buffer to empty.
     *
     * @returns this
     */
    public clear(): this {
        this.#data = new Uint16Array();
        this.#currentLength = 0;

        return this;
    }

    /**
     * @returns the 21 bit Unicode code point at the specified index.
     *
     * @param index The position of the requested code point.
     */
    public codePointAt(index: int): int {
        if (index < 0 || index >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        return codePointFromUTF16(this.#data, index);
    }

    /**
     * @returns the 21 bit Unicode code point before the specified index.
     *
     * @param index The position of the requested code point.
     */
    public codePointBefore(index: int): int {
        if (index < 1 || index >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        return codePointBeforeFromUTF16(this.#data, index);
    }

    /**
     * @returns the number of Unicode code points in the specified text range of this sequence.
     *
     * @param beginIndex the index to the first char of the text range.
     * @param endIndex the index after the last char of the text range.
     */
    public codePointCount(beginIndex: int, endIndex: int): int {
        if (beginIndex < 0 || beginIndex >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (endIndex < 0 || endIndex >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (beginIndex > endIndex) {
            throw new IndexOutOfBoundsException();
        }

        let count = 0;
        let index = beginIndex;
        while (index < endIndex) {
            let code = this.#data.at(index++)!;
            ++count;

            if (code >= 0xD800 && code <= 0xDBFF && index < endIndex) {
                code = this.#data.at(index)!;
                if (code >= 0xDC00 && code <= 0xDFFF) {
                    // Full surrogate pair, jump over the low surrogate.
                    ++index;
                }
            }
        }

        return count;
    }

    /** Returns a stream of code point values from this sequence. */
    public codePoints(): IntStream {
        throw new NotImplementedError();
    }

    public compareTo(another: StringBuffer): int {
        const index = Arrays.mismatch(this.#data, another.#data);
        if (index === -1) {
            if (this.#currentLength === another.#currentLength) {
                return 0;
            }

            return this.#currentLength - another.#currentLength;
        }

        return this.#data[index] - another.#data[index];
    }

    /**
     * Removes the characters in a substring of this sequence.
     *
     * @param start The beginning index, inclusive.
     * @param end The ending index, exclusive.
     *
     * @returns this.
     */
    public delete(start: int, end: int): this {
        if (start < 0 || start >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (end < 0 || end > this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (start > end) {
            throw new IndexOutOfBoundsException();
        }

        this.#data.copyWithin(start, end);
        this.#currentLength -= end - start;

        return this;
    }

    /**
     * Removes the char at the specified position in this sequence.
     *
     * @param index tbd
     *
     * @returns this
     */
    public deleteCharAt(index: int): this {
        this.delete(index, index + 1);

        return this;
    }

    /**
     * Ensures that the capacity is at least equal to the specified minimum.
     *
     * @param minimumCapacity The required capacity.
     */
    public ensureCapacity(minimumCapacity: int): void {
        if (minimumCapacity > this.#data.length) {
            const newData = new Uint16Array(minimumCapacity);
            newData.set(this.#data);
            this.#data = newData;

            // The current length doesn't change.
        }
    }

    /**
     * Characters are copied from this sequence into the destination character array dst.
     *
     * @param srcBegin tbd
     * @param srcEnd tbd
     * @param dst tbd
     * @param dstBegin tbd
     */
    public getChars(srcBegin: int, srcEnd: int, dst: Uint16Array, dstBegin: int): void {
        if (srcBegin < 0 || dstBegin < 0) {
            throw new IndexOutOfBoundsException();
        }

        if (srcBegin > srcEnd || srcEnd > this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (dstBegin + srcEnd - srcBegin > dst.length) {
            throw new IndexOutOfBoundsException();
        }

        dst.set(this.#data.subarray(srcBegin, srcEnd), dstBegin);
    }

    /** Returns the index within this string of the first occurrence of the specified substring. */
    public indexOf(str: JavaString | string): int;
    /**
     * Returns the index within this string of the first occurrence of the specified substring, starting at the
     * specified index.
     */
    public indexOf(str: JavaString | string, fromIndex: int): int;
    public indexOf(...args: unknown[]): int {
        let fromIndex = 0;
        if (args.length === 2) {
            fromIndex = args[1] as int;
        }

        let str: Uint16Array;
        if (args[0] instanceof JavaString) {
            str = args[0].array();
        } else {
            str = convertStringToUTF16(args[0] as string);
        }

        return indexOfSubArray(this.#data, str, fromIndex);
    }

    /** Inserts the string representation of the boolean argument into this sequence. */
    public insert(offset: int, b: boolean): this;
    /** Inserts the string representation of the char argument into this sequence. */
    public insert(offset: int, c: char): this;
    /** Inserts the string representation of the char array argument into this sequence. */
    public insert(offset: int, str: Uint16Array): this;
    /** Inserts the string representation of a subarray of the char array argument into this sequence. */
    public insert(index: int, str: Uint16Array, offset: int, length: int): this;
    /** Inserts the string representation of the double argument into this sequence. */
    public insert(offset: int, d: double): this;
    /** Inserts the string representation of the float argument into this sequence. */
    public insert(offset: int, f: float): this;
    /** Inserts the string representation of the int argument into this sequence. */
    public insert(offset: int, i: int): this;
    /** Inserts the string representation of the long argument into this sequence. */
    public insert(offset: int, l: long): this;
    /** Inserts the string representation of the Object argument into this sequence. */
    public insert(offset: int, s: CharSequence): this;
    /** Inserts the string representation of a subsequence of the specified CharSequence into this sequence. */
    public insert(offset: int, s: CharSequence, start: int, end: int): this;
    /** Inserts the string representation of the Object argument into this sequence. */
    public insert(offset: int, obj: JavaObject): this;
    /** Inserts the string into this character sequence. */
    public insert(offset: int, str: JavaString | string): this;
    /** Inserts the string representation of the StringBuffer argument into this sequence. */
    public insert(offset: int, sb: StringBuffer): this;
    public insert(...args: unknown[]): this {
        const offset = args[0] as int;
        const source = args[1];
        if (source instanceof Uint16Array || this.isCharSequence(source)) {
            let start = 0;
            let end = source instanceof Uint16Array ? source.length : source.length();
            if (args.length === 4) {
                start = args[2] as int;
                end = args[3] as int;
            }

            this.insertListData(offset, source, start, end);
        } else {
            this.insertData(offset, source as SimpleDataType);
        }

        return this;
    }

    /** Returns the index within this string of the last occurrence of the specified substring. */
    public lastIndexOf(str: JavaString | string): int;
    /**
     * Returns the index within this string of the last occurrence of the specified substring, searching backward
     * starting at the specified index.
     */
    public lastIndexOf(str: JavaString | string, fromIndex: int): int;
    public lastIndexOf(...args: unknown[]): int {
        let fromIndex = this.#currentLength;
        if (args.length === 2) {
            fromIndex = args[1] as int;
        }

        const str = args[0] instanceof JavaString ? args[0].array() : convertStringToUTF16(args[0] as string);

        return lastIndexOfSubArray(this.#data, str, fromIndex);
    }

    /** @returns the length (character count). */
    public length(): int {
        return this.#currentLength;
    }

    /**
     * @returns the index within this sequence that is offset from the given index by codePointOffset code points.
     *
     * @param index the index to be offset.
     * @param codePointOffset the offset in code points
     */
    public offsetByCodePoints(index: int, codePointOffset: int): int {
        if (index < 0 || index >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        if (codePointOffset >= 0) {
            let offset: int;
            for (offset = 0; index < this.#currentLength && offset < codePointOffset; ++offset) {
                if (this.isHighSurrogate(this.#data.at(index++)) && index < this.#currentLength &&
                    this.isLowSurrogate(this.#data.at(index))) {
                    ++index;
                }
            }

            if (offset < codePointOffset) {
                throw new IndexOutOfBoundsException();
            }
        } else {
            let offset: int;
            for (offset = codePointOffset; index > 0 && offset < 0; ++offset) {
                if (this.isLowSurrogate(this.#data.at(--index)) && index > 0 &&
                    this.isHighSurrogate(this.#data.at(index - 1))) {
                    --index;
                }
            }
            if (offset < 0) {
                throw new IndexOutOfBoundsException();
            }
        }

        return index;
    }

    /**
     * Replaces the characters in a substring of this sequence with characters in the specified String.
     *
     * @param start the beginning index, inclusive.
     * @param end the ending index, exclusive.
     * @param str String that will replace previous contents.
     *
     * @returns this
     */
    public replace(start: int, end: int, str: JavaString | string): this {
        this.delete(start, end);
        this.insertData(start, str);

        return this;
    }

    /**
     * Causes this character sequence to be replaced by the reverse of the sequence.
     *
     * @returns this
     */
    public reverse(): this {
        this.#data.subarray(0, this.#currentLength).reverse();

        return this;
    }

    /**
     * The character at the specified index is set to ch.
     *
     * @param index the index of the character to modify.
     * @param ch the new character.
     */
    public setCharAt(index: int, ch: char): void {
        if (index < 0 || index >= this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        this.#data.set([ch & 0xFFFF], index);
    }

    /**
     * Sets the length of the character sequence.
     *
     * @param newLength The new length.
     */
    public setLength(newLength: int): void {
        if (newLength === this.#currentLength) {
            return;
        }

        if (newLength < this.#currentLength) {
            this.#currentLength = newLength;
        } else if (newLength > this.#currentLength && newLength < this.#data.length) {
            // No need to copy anything if we still have enough room.
            this.#currentLength = newLength;
        } else {
            // New length is larger than the current data size. Create a new array and copy the existing content.
            // Any further entry is initialized to zero.
            const newData = new Uint16Array(newLength).fill(0);
            this.#currentLength = newLength;
            newData.set(this.#data, 0);

            this.#data = newData;
        }
    }

    /**
     * @returns a new character sequence that is a subsequence of this sequence.
     *
     * @param start the start index, inclusive.
     * @param end the end index, exclusive.
     */
    public subSequence(start: int, end: int): CharSequence {
        return this.substring(start, end);
    }

    /**
     * Returns a new String that contains a subsequence of characters currently contained in this character
     * sequence.
     */
    public substring(start: int): JavaString;
    /**
     * Returns a new String that contains a subsequence of characters currently contained in this character
     * sequence.
     */
    public substring(start: int, end: int): JavaString;
    public substring(...args: unknown[]): JavaString {
        const start = args[0] as int;

        if (args.length === 1) {
            if (start < 0 || start > this.#currentLength) {
                throw new IndexOutOfBoundsException();
            }

            return new JavaString(this.#data, start, this.#currentLength - start);
        }

        const end = args[1] as int;
        if (start < 0 || end < 0 || end > this.#currentLength) {
            throw new IndexOutOfBoundsException();
        }

        return new JavaString(this.#data, start, end - start);
    }

    /** @returns a string representing of the data in this sequence. */
    public override toString(): JavaString {
        return new JavaString(convertUTF16ToString(this.#data.subarray(0, this.#currentLength)));
    }

    /**
     * Not part of the Java API.
     *
     * @returns a view of the underlying data.
     */
    public array(): Uint16Array {
        return this.#data.subarray(0, this.#currentLength);
    }

    /** Attempts to reduce storage used for the character sequence. */
    public trimToSize(): void {
        if (this.#currentLength < this.#data.length) {
            const newData = new Uint16Array(this.#currentLength);
            newData.set(this.#data.subarray(0, this.#currentLength), 0);

            this.#data = newData;
        }
    }

    protected [Symbol.toPrimitive](_hint: string): string {
        return convertUTF16ToString(this.#data.subarray(0, this.#currentLength));
    }

    /**
     * Inserts the specified data at the specified position.
     *
     * @param position the position to insert the data.
     * @param newContent the data to insert.
     */
    private insertData(position: int, newContent: SimpleDataType): void {
        let data: Uint16Array | undefined;
        if (typeof newContent === "string") {
            if (newContent.length > 0) {
                const array = convertStringToUTF16(newContent);
                data = array;
            }
        } else {
            const text = JavaString.valueOf(newContent);
            if (text.length() > 0) {
                const array = convertStringToUTF16(text.valueOf());
                data = array;
            }
        }

        if (!data) {
            return;
        }

        const requiredSize = this.#currentLength + data.length;
        if (requiredSize <= this.#data.length) {
            // No need to re-allocate. There's still room for the new data.
            if (position < this.#currentLength) {
                this.#data.copyWithin(position + data.length, position, this.#currentLength);
            }

            this.#data.set(data, position);
            position += data.length;

            this.#currentLength = requiredSize;
        } else {
            // Reallocate at least by half of the current buffer size.
            const newData = new Uint16Array(Math.max(requiredSize, this.#data.length * 1.5));
            if (position > 0) {
                // Copy what's before the target position.
                newData.set(this.#data.subarray(0, position), 0);
            }

            // Add the new data.
            newData.set(data, position);

            if (position < this.#currentLength) {
                // Copy the rest from the original data.
                newData.set(this.#data.subarray(position, this.#currentLength), position + data.length);
            }

            this.#data = newData;
            this.#currentLength = requiredSize;
        }
    }

    /**
     * A special version of the insertData method, which deals specifically with char arrays and sequences.
     *
     * @param position The position where to add the new content.
     * @param data The content to add.
     * @param start Optional start position in the source list.
     * @param end Optional end position in the source list.
     */
    private insertListData(position: int, data: Uint16Array | CharSequence, start?: int,
        end?: int): void {
        let array: Uint16Array;
        let additionalSize: int;

        if (data instanceof Uint16Array) {
            array = start === undefined ? data : data.slice(start, end);
            additionalSize = data.length;
        } else {
            start ??= 0;
            end ??= data.length();

            additionalSize = end - start;

            if (data instanceof StringBuilder) {
                array = data.#data.subarray(start, end);
            } else if (data instanceof JavaString) {
                array = data.array().subarray(start, end);
            } else {
                array = data.subSequence(start, end).toString().array();
            }
        }

        const requiredSize = this.#currentLength + additionalSize;
        if (requiredSize > 0) {
            if (requiredSize <= this.#data.length) {
                // No need to re-allocate. There's still room for the new data.
                if (position < this.#currentLength) {
                    this.#data.copyWithin(additionalSize, position, this.#currentLength);
                }

                this.#data.set(array, position);
                this.#currentLength = requiredSize;
            } else {
                const newData = new Uint16Array(Math.max(requiredSize, this.#data.length * 1.5));
                if (position > 0) {
                    // Copy what's before the target position.
                    newData.set(this.#data.subarray(0, position), 0);
                }

                // Add the new data.
                newData.set(array.subarray(start, end), position);

                if (position < this.#currentLength) {
                    // Copy the rest from the original data.
                    newData.set(this.#data.subarray(position, this.#currentLength), position + additionalSize);
                }

                this.#data = newData;
                this.#currentLength = requiredSize;
            }
        }
    }

    private isCharSequence(candidate: unknown): candidate is CharSequence {
        return (candidate as CharSequence).subSequence !== undefined;
    }

    private isHighSurrogate(code?: int): boolean {
        return code !== undefined && code >= 0xD800 && code <= 0xDBFF;
    }

    private isLowSurrogate(code?: int): boolean {
        return code !== undefined && code >= 0xDC00 && code <= 0xDFFF;
    }
}
