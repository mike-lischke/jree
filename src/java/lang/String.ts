/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import printf from "printf";

import { MurmurHash } from "../../MurmurHash";
import { NotImplementedError } from "../../NotImplementedError";
import {
    codePointFromUTF16, convertStringToUTF16, convertUTF32ToUTF16, convertUTF16ToString, indexOfSubArray,
    lastIndexOfSubArray,
} from "../../string-helpers";
import { char, int } from "../../types";

import { Serializable } from "../io/Serializable";
import { UnsupportedEncodingException } from "../io/UnsupportedEncodingException";
import { ByteBuffer } from "../nio/ByteBuffer";
import { Charset } from "../nio/charset/Charset";
import { Locale } from "../util/Locale";
import { IntStream } from "../util/stream/IntStream";
import { CharSequence } from "./CharSequence";
import { Comparable } from "./Comparable";
import { IllegalArgumentException } from "./IllegalArgumentException";
import { IndexOutOfBoundsException } from "./IndexOutOfBoundsException";

import { JavaObject } from "./Object";
import { StringBuffer } from "./StringBuffer";
import { StringBuilder } from "./StringBuilder";

export class JavaString extends JavaObject implements Serializable, CharSequence, Comparable<JavaString> {
    // A space in Java is defined as anything equal or below the space char.
    static #spaceRegExBegin = /^[\x00-\x20]+/;

    static #spaceRegExEnd = /[\x00-\x20]+$/;

    // A white space in Java is defined differently than a space char.
    static #whitespaceRegExBegin = /^[\p{Zs}\p{Zi}\p{Zp}\x09\x0A\x0B\x0C\x0D\x1C\x1D\x1E\x1F]+/;

    static #whitespaceRegExEnd = /[\p{Zs}\p{Zi}\p{Zp}\x09\x0A\x0B\x0C\x0D\x1C\x1D\x1E\x1F]+$/;

    #value: Uint16Array;

    /** Initializes a newly created String object so that it represents an empty character sequence. */
    public constructor();
    /** Constructs a new String by decoding the specified array of bytes using the platform's default charset. */
    public constructor(bytes: Int8Array);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Int8Array, charset: Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is via
     * the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the platform's default charset.
     */
    public constructor(bytes: Int8Array, offset: number, length: number);
    /** Constructs a new String by decoding the specified subarray of bytes using the specified charset. */
    public constructor(bytes: Int8Array, offset: number, length: number, charset: Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is
     * via the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the specified charset.
     */
    public constructor(bytes: Int8Array, offset: number, length: number, charsetName: JavaString);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Int8Array, charsetName: JavaString);
    /**
     * Allocates a new String so that it represents the sequence of characters currently contained in the character
     * array argument.
     */
    public constructor(value: Uint16Array);
    /** Allocates a new String that contains characters from a subarray of the character array argument. */
    public constructor(value: Uint16Array, offset: int, count: int);
    /** Allocates a new String that contains characters from a subarray of the Unicode code point array argument. */
    public constructor(codePoints: Int32Array, offset: int, count: int);
    /**
     * Initializes a newly created String object so that it represents the same sequence of characters as the argument;
     * in other words, the newly created string is a copy of the argument string.
     *
     * Note: this has been extended to also accept a TS string as input, for convenience.
     */
    public constructor(original: JavaString | string);
    /**
     * Allocates a new string that contains the sequence of characters currently contained in the string buffer
     * argument.
     */
    public constructor(buffer: StringBuffer);
    /**
     * Allocates a new string that contains the sequence of characters currently contained in the string builder
     * argument.
     */
    public constructor(builder: StringBuilder);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 0: {
                this.#value = new Uint16Array(0);

                break;
            }

            case 1: {
                const input = args[0] as
                    JavaString | string | Int8Array | Uint16Array | Int32Array | StringBuffer | StringBuilder;
                if (input instanceof Int8Array) {
                    const charset = Charset.defaultCharset();
                    this.#value = charset.decode(ByteBuffer.wrap(input)).array();
                } else if (input instanceof Uint16Array) {
                    this.#value = input;
                } else if (input instanceof Int32Array) {
                    this.#value = convertUTF32ToUTF16(input);
                } else {
                    this.#value = convertStringToUTF16(`${input}`);
                }

                break;
            }

            case 2: {
                if (args[1] instanceof Charset) {
                    const [input, charset] = args as [Int8Array, Charset];
                    this.#value = charset.decode(ByteBuffer.wrap(input)).array();
                } else {
                    const [input, charsetName] = args as [Int8Array, JavaString];
                    const charset = Charset.forName(charsetName);
                    if (charset === null) {
                        throw new UnsupportedEncodingException(charsetName);
                    }

                    this.#value = charset.decode(ByteBuffer.wrap(input)).array();
                }

                break;
            }

            case 3: {
                const [input, offset, length] = args as [Int8Array | Uint16Array | Int32Array, int, int];
                if (offset < 0 || length < 0 || offset + length > input.length) {
                    throw new IndexOutOfBoundsException();
                }

                if (input instanceof Int8Array) {
                    this.#value = Charset.defaultCharset().decode(ByteBuffer.wrap(input, offset, length)).array();
                } else if (input instanceof Uint16Array) {
                    this.#value = input.slice(offset, offset + length);
                } else {
                    this.#value = convertUTF32ToUTF16(input.slice(offset, length));
                }

                break;
            }

            case 4: {
                const [input, offset, length, cs] = args as [Int8Array, int, int, Charset | JavaString];
                if (offset < 0 || length < 0 || offset + length > input.length) {
                    throw new IndexOutOfBoundsException();
                }

                if (cs instanceof Charset) {
                    this.#value = cs.decode(ByteBuffer.wrap(input, offset, length)).array();
                } else {
                    const charset = Charset.forName(cs);
                    if (charset === null) {
                        throw new UnsupportedEncodingException(cs);
                    }

                    this.#value = Charset.defaultCharset().decode(ByteBuffer.wrap(input, offset, length)).array();
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }
    }

    /**
     * Not part of the Java API. Creates a Java string from a code point.
     *
     * @param codePoint the code point to convert to a string.
     *
     * @returns A Java string with a single letter (represented by the code point).
     */
    public static fromCodePoint(codePoint: number): JavaString {
        if (codePoint < 0 || codePoint > 0x10ffff) {
            throw new IllegalArgumentException(new JavaString(`Invalid code point: ${codePoint}`));
        }

        return new JavaString(String.fromCodePoint(codePoint));
    }

    /**
     * @param v the value to convert to a string.
     *
     * @returns the string representation of the argument.
     *
     */
    public static override valueOf(v: unknown): JavaString {
        if (v instanceof Uint16Array) {
            return new JavaString(v);
        }

        if (v === null) {
            return new JavaString("null");
        }

        if (v === undefined) {
            return new JavaString("undefined");
        }

        return new JavaString(`${v}`);
    }

    /** @returns a formatted string using the specified format string and arguments. */
    public static format(format: JavaString, ...args: unknown[]): JavaString;
    /** @returns a formatted string using the specified locale, format string, and arguments. */
    public static format(l: Locale, format: JavaString, ...args: unknown[]): JavaString;
    public static format(...args: unknown[]): JavaString {
        let index = 0;
        if (args[0] instanceof Locale) {
            ++index; // Ignore the local for now.
        }

        const text = printf(`${args[index]}`, args.slice(index + 1));

        return new JavaString(text);
    }

    public getBytes(): Int8Array;
    public getBytes(charset: Charset): Int8Array;
    public getBytes(charsetName: JavaString | string): Int8Array;
    public getBytes(...args: unknown[]): Int8Array {
        let charset: Charset | undefined;
        if (args.length === 0) {
            charset = Charset.defaultCharset();
        } else if (args[0] instanceof Charset) {
            charset = args[0];
        } else {
            charset = Charset.forName(args[0] as JavaString | string);
        }

        return charset.encode(this).array();
    }

    /**
     * Not part of the Java API. Returns the internal UTF-16 array.
     *
     * @returns the internal UTF-16 array.
     */
    public array(): Uint16Array {
        return this.#value;
    }

    /**
     * @param index the index of the char value.
     *
     * @returns the char value at the specified index
     */
    public charAt(index: int): char {
        if (index < 0 || index >= this.#value.length) {
            throw new IndexOutOfBoundsException();
        }

        return this.#value[index];
    }

    /**
     * Returns a stream of int zero-extending the char values from this sequence.
     */
    public chars(): IntStream {
        throw new NotImplementedError();
    }

    /**
     * @param index the index of the char value.
     *
     * @returns the character (Unicode code point) at the specified index.
     */
    public codePointAt(index: int): int {
        if (index < 0 || index >= this.#value.length) {
            throw new IndexOutOfBoundsException();
        }

        return codePointFromUTF16(this.#value, index);
    }

    /**
     * Compares two strings lexicographically.
     *
     * @param anotherString the string to be compared.
     *
     * @returns the value 0 if the argument string is equal to this string; a value less than 0 if this string is
     *          lexicographically less than the string argument; and a value greater than 0 if this string is
     *          lexicographically greater than the string argument.
     */
    public compareTo(anotherString: JavaString | string): int {
        const source = convertUTF16ToString(this.#value);
        const target = typeof anotherString === "string" ? anotherString : convertUTF16ToString(anotherString.#value);

        return source.localeCompare(target, undefined, { sensitivity: "accent" });
    }

    /**
     * Compares two strings lexicographically, ignoring case differences.
     *
     * @param anotherString the string to be compared.
     *
     * @returns a negative integer, zero, or a positive integer as the specified String is greater than, equal to, or
     *          less than this String, ignoring case considerations.
     */
    public compareToIgnoreCase(anotherString: JavaString): int {
        const source = convertUTF16ToString(this.#value);
        const target = convertUTF16ToString(anotherString.#value);

        return source.localeCompare(target, undefined, { sensitivity: "case" });
    }

    /**
     * Compares this string to the specified object.
     *
     * @param obj the object to compare this `String` against.
     *
     * @returns `true` if the given object represents a `String` equivalent to this string, `false` otherwise.
     */
    public override equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }

        if (typeof obj === "string") {
            return this.compareTo(obj) === 0;
        }

        if (!(obj instanceof JavaString)) {
            return false;
        }

        if (this.#value.length !== obj.#value.length) {
            return false;
        }

        return this.compareTo(obj) === 0;
    }

    /**
     * Copies characters from this string into the destination character array.
     *
     * @param srcBegin index of the first character in the string to copy.
     * @param srcEnd index after the last character in the string to copy.
     * @param dst the destination array.
     * @param dstBegin the start offset in the destination array.
     */
    public getChars(srcBegin: int, srcEnd: int, dst: Uint16Array, dstBegin: int): void {
        if (srcBegin < 0 || srcBegin > srcEnd || srcEnd > this.#value.length || dstBegin < 0
            || dstBegin + (srcEnd - srcBegin) > dst.length) {
            throw new IndexOutOfBoundsException();
        }

        for (let i = srcBegin; i < srcEnd; ++i) {
            dst[dstBegin++] = this.#value[i];
        }
    }

    /** @returns a hash code for this string. */
    public override hashCode(): int {
        return MurmurHash.hashCode(this.#value, 17);
    }

    /** Returns the index within this string of the first occurrence of the specified character. */
    public indexOf(ch: char): int;
    /**
     * Returns the index within this string of the first occurrence of the specified character, starting the search
     * at the specified index.
     */
    public indexOf(ch: char, fromIndex: int): int;
    /** Returns the index within this string of the first occurrence of the specified substring. */
    public indexOf(searchString: JavaString): int;
    /**
     * Returns the index within this string of the first occurrence of the specified substring, starting at the
     * specified index.
     */
    public indexOf(searchString: JavaString, fromIndex: int): int;
    public indexOf(chOrSearchString: char | JavaString, fromIndex?: int): int {
        if (typeof chOrSearchString === "number") {
            return this.#value.indexOf(chOrSearchString, fromIndex);
        }

        return indexOfSubArray(this.#value, chOrSearchString.#value, fromIndex);
    }

    /** @returns `true` if, and only if, length() is `0`. */
    public isEmpty(): boolean {
        return this.#value.length === 0;
    }

    /** Returns the index within this string of the last occurrence of the specified character. */
    public lastIndexOf(ch: char): int;
    /**
     * Returns the index within this string of the last occurrence of the specified character, searching backward
     * starting at the specified index.
     */
    public lastIndexOf(ch: char, fromIndex: int): int;
    /** Returns the index within this string of the last occurrence of the specified substring. */
    public lastIndexOf(searchString: JavaString): int;
    /**
     * Returns the index within this string of the last occurrence of the specified substring, searching backward
     * starting at the specified index.
     */
    public lastIndexOf(searchString: JavaString, fromIndex: int): int;
    public lastIndexOf(chOrSearchString: char | JavaString, fromIndex?: int): int {
        if (typeof chOrSearchString === "number") {
            if (fromIndex === undefined) {
                return this.#value.lastIndexOf(chOrSearchString);
            }

            return this.#value.lastIndexOf(chOrSearchString, fromIndex);
        }

        return lastIndexOfSubArray(this.#value, chOrSearchString.#value, fromIndex);
    }

    /** @returns the the length of this string. */
    public length(): int {
        return this.#value.length;
    }

    /**
     * Returns a string whose value is the concatenation of this string repeated count times.
     *
     * @param count the number of times to repeat the string.
     *
     * @returns a string whose value is the concatenation of this string repeated count times.
     */
    public repeat(count: int): JavaString {
        if (count < 0) {
            throw new IllegalArgumentException();
        }

        if (count === 0) {
            return new JavaString("");
        }

        if (count === 1) {
            return this;
        }

        const builder = new StringBuilder();
        for (let i = 0; i < count; i++) {
            builder.append(this);
        }

        return builder.toString();
    }

    /**
     * @param oldChar the old char.
     * @param newChar the new char.
     *
     * @returns a string resulting from replacing all occurrences of `oldChar` in this string with `newChar`.
     */
    public replace(oldChar: char, newChar: char): JavaString;
    /**
     * Replaces each substring of this string that matches the literal target sequence with the specified literal
     * replacement sequence.
     *
     * @param target the sequence of char values to be replaced.
     * @param replacement the replacement sequence of char values.
     *
     * @returns a string resulting from replacing all occurrences of `target` in this string with `replacement`.
     */
    public replace(target: CharSequence, replacement: CharSequence): JavaString;
    public replace(...args: unknown[]): JavaString {
        if (typeof args[0] === "number") {
            const [oldChar, newChar] = args as [char, char];

            const array = new Uint16Array(this.#value.length);
            this.#value.forEach((char, index) => {
                array[index] = char === oldChar ? newChar : char;
            });

            return new JavaString(array);
        }

        const [target, replacement] = args as [CharSequence, CharSequence];
        const oldValue = target.toString().#value;
        const newValue = replacement.toString().#value;

        // Determine all span lengths of unmatched characters.
        const spanLengths = new Array<number>();
        let index = 0;
        while (index < this.#value.length) {
            const spanLength = indexOfSubArray(this.#value, oldValue, index) - index;
            if (spanLength < 0) {
                break;
            }

            spanLengths.push(spanLength);
            index += spanLength + oldValue.length;
        }

        if (index < this.#value.length) {
            spanLengths.push(this.#value.length - index);
        }

        if (spanLengths.length === 1) {
            return this;
        }

        // Determine the length of the new string.
        const newLength = spanLengths.reduce((length, spanLength) => {
            return length + spanLength;
        }, 0) + (spanLengths.length - 1) * newValue.length;

        // Create the new string.
        const array = new Uint16Array(newLength);
        let sourceIndex = 0;
        let targetIndex = 0;
        for (let i = 0; i < spanLengths.length; i++) {
            const spanLength = spanLengths[i];
            if (spanLength > 0) {
                array.set(this.#value.subarray(sourceIndex, sourceIndex + spanLength), targetIndex);
                sourceIndex += spanLength + oldValue.length;
            }

            if (i < spanLengths.length - 1) {
                array.set(newValue, targetIndex);
                targetIndex += newValue.length;
            }
        }

        return new JavaString(array);
    }

    /**
     * Splits this string around matches of the given regular expression.
     *
     * @param regex the delimiting regular expression.
     * @param limit the result threshold, as described above.
     *
     * @returns the array of strings computed by splitting this string around matches of the given regular expression.
     */
    public split(regex: JavaString | string, limit?: int): JavaString[] {
        const source = convertUTF16ToString(this.#value);
        const re = typeof regex === "string" ? regex : convertUTF16ToString(regex.#value);

        const parts = source.split(re, limit);

        return parts.map((value) => {
            return new JavaString(value);
        });
    }

    /** Tests if this string starts with the specified prefix. */
    public startsWith(prefix: JavaString): boolean;
    /** Tests if the substring of this string beginning at the specified index starts with the specified prefix. */
    public startsWith(prefix: JavaString, offset: int): boolean;
    public startsWith(prefix: JavaString, offset?: int): boolean {
        return indexOfSubArray(prefix.#value, this.#value, offset) === 0;
    }

    /** @returns a string whose value is this string, with all leading and trailing white space removed. */
    public strip(): JavaString {
        return this.stripLeading().stripTrailing();
    }

    /** @returns a string whose value is this string, with all leading white space removed. */
    public stripLeading(): JavaString {
        const source = convertUTF16ToString(this.#value);
        const match = source.match(JavaString.#whitespaceRegExBegin);
        if (!match) {
            return this;
        }

        return new JavaString(source.substring(match[0].length));
    }

    /** @returns a string whose value is this string, with all trailing white space removed. */
    public stripTrailing(): JavaString {
        const source = convertUTF16ToString(this.#value);
        const match = source.match(JavaString.#whitespaceRegExEnd);
        if (!match) {
            return this;
        }

        return new JavaString(source.substring(0, source.length - match[0].length));
    }

    /**
     * @param start the beginning index, inclusive.
     * @param end the ending index, exclusive.
     *
     * @returns a character sequence that is a subsequence of this sequence.
     */
    public subSequence(start: int, end: int): CharSequence {
        return this.substring(start, end);
    }

    /**
     * Returns a string that is a substring of this string.
     *
     * @param beginIndex the beginning index, inclusive.
     * @param endIndex the ending index, exclusive.
     *
     * @returns the specified substring.
     */
    public substring(beginIndex: int, endIndex?: int): JavaString {
        return new JavaString(this.#value.subarray(beginIndex, endIndex));
    }

    /**
     * @returns a string whose value is this string, with all leading and trailing space removed, where space is defined
     *          as any character whose codepoint is less than or equal to 'U+0020'(the space character).
     */
    public trim(): JavaString {
        const source = convertUTF16ToString(this.#value);
        const startMatch = source.match(JavaString.#spaceRegExBegin);
        const endMatch = source.match(JavaString.#spaceRegExEnd);
        if (!startMatch && !endMatch) {
            return this;
        }

        const start = startMatch ? startMatch[0].length : 0;
        const end = this.#value.length - (endMatch ? endMatch[0].length : 0);

        return new JavaString(this.#value.subarray(start, end));
    }

    /**
     * Converts this string to a new character array.
     *
     * @returns a newly allocated character array whose length is the length of this string and whose contents are
     *          initialized to contain the character sequence represented by this string.
     */
    public toCharArray(): Uint16Array {
        const result = new Uint16Array(this.#value.length);
        result.set(this.#value);

        return result;
    }

    public override toString(): JavaString {
        return this;
    }

    /**
     * Not part of the Java API, but here to ease primitive value access.
     *
     * @returns the primitive string value of this instance.
     */
    public override valueOf(): string {
        return convertUTF16ToString(this.#value);
    }

    public [Symbol.toPrimitive](hint: string): string {
        return this.valueOf();
    }
}
