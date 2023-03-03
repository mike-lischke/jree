/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import printf from "printf";

import { char } from ".";

import { MurmurHash } from "../../MurmurHash";
import { charCodesToString, codePointsToString } from "../../utilities";
import { Serializable } from "../io/Serializable";
import { UnsupportedEncodingException } from "../io/UnsupportedEncodingException";
import { ByteBuffer } from "../nio/ByteBuffer";
import { Charset } from "../nio/charset/Charset";
import { Locale } from "../util/Locale";
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

    #value: string;

    /** Initializes a newly created String object so that it represents an empty character sequence. */
    public constructor();
    /** Constructs a new String by decoding the specified array of bytes using the platform's default charset. */
    public constructor(bytes: Uint8Array);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, charset: Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is via
     * the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the platform's default charset.
     */
    public constructor(bytes: Uint8Array, offset: number, length: number);
    /** Constructs a new String by decoding the specified subarray of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, offset: number, length: number, charset: Charset);
    /**
     * This method does not properly convert bytes into characters. As of JDK 1.1, the preferred way to do this is
     * via the String constructors that take a Charset, charset name, or that use the platform's default charset.
     * Constructs a new String by decoding the specified subarray of bytes using the specified charset.
     */
    public constructor(bytes: Uint8Array, offset: number, length: number, charsetName: JavaString);
    /** Constructs a new String by decoding the specified array of bytes using the specified charset. */
    public constructor(bytes: Uint8Array, charsetName: JavaString);
    /**
     * Allocates a new String so that it represents the sequence of characters currently contained in the character
     * array argument.
     */
    public constructor(value: Uint16Array);
    /** Allocates a new String that contains characters from a subarray of the character array argument. */
    public constructor(value: Uint16Array, offset: number, count: number);
    /** Allocates a new String that contains characters from a subarray of the Unicode code point array argument. */
    public constructor(codePoints: Uint32Array, offset: number, count: number);
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
                this.#value = "";

                break;
            }

            case 1: {
                const input = args[0];
                if (input instanceof Uint8Array) {
                    const charset = Charset.defaultCharset();
                    this.#value = `${charset.decode(ByteBuffer.wrap(input))}`;
                } else if (input instanceof Uint16Array) {
                    this.#value = charCodesToString(input);
                } else if (input instanceof Uint32Array) {
                    this.#value = codePointsToString(input);
                } else {
                    this.#value = `${input}`;
                }

                break;
            }

            case 2: {
                if (args[1] instanceof Charset) {
                    const [input, charset] = args as [Uint8Array, Charset];
                    this.#value = `${charset.decode(ByteBuffer.wrap(input))}`;
                } else {
                    const [input, charsetName] = args as [Uint8Array, JavaString];
                    const charset = Charset.forName(charsetName);
                    if (charset === null) {
                        throw new UnsupportedEncodingException(charsetName);
                    }

                    this.#value = `${charset.decode(ByteBuffer.wrap(input))}`;
                }

                break;
            }

            case 3: {
                const [input, offset, length] = args[0] as [Uint8Array | Uint16Array | Uint32Array, number, number];
                if (offset < 0 || length < 0 || offset + length > input.length) {
                    throw new IndexOutOfBoundsException();
                }

                if (input instanceof Uint8Array) {
                    this.#value = `${Charset.defaultCharset().decode(ByteBuffer.wrap(input, offset, length))}`;
                } else if (input instanceof Uint16Array) {
                    this.#value = charCodesToString(input.slice(offset, length));
                } else {
                    this.#value = codePointsToString(input.slice(offset, length));
                }

                break;
            }

            case 4: {
                const [input, offset, length, cs] = args as [Uint8Array, number, number, Charset | JavaString];
                if (offset < 0 || length < 0 || offset + length > input.length) {
                    throw new IndexOutOfBoundsException();
                }

                if (cs instanceof Charset) {
                    this.#value = `${cs.decode(ByteBuffer.wrap(input, offset, length))}`;
                } else {
                    const charset = Charset.forName(cs);
                    if (charset === null) {
                        throw new UnsupportedEncodingException(cs);
                    }

                    this.#value = `${Charset.defaultCharset().decode(ByteBuffer.wrap(input, offset, length))}`;
                }

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString(`Invalid number of arguments: ${args.length}`));
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

    public [Symbol.toPrimitive](hint: string): string {
        return this.#value;
    }

    /**
     * @param index the index of the char value.
     *
     * @returns the char value at the specified index
     */
    public charAt(index: number): char {
        if (index < 0 || index >= this.#value.length) {
            throw new IndexOutOfBoundsException();
        }

        return this.#value.charCodeAt(index);
    }

    /**
     * @param index the index of the char value.
     *
     * @returns the character (Unicode code point) at the specified index.
     */
    public codePointAt(index: number): number {
        if (index < 0 || index >= this.#value.length) {
            throw new IndexOutOfBoundsException();
        }

        return this.#value.codePointAt(index)!;
    }

    /**
     * Compares two strings lexicographically.
     *
     * @param anotherString the string to be compared.
     *
     * @returns the value `0` if the argument string is equal to this string; a value less than `0` if this string
     */
    public compareTo(anotherString: JavaString): number {
        return this.#value.localeCompare(anotherString.#value, undefined, { sensitivity: "accent" });
    }

    /**
     * Compares two strings lexicographically, ignoring case differences.
     *
     * @param anotherString the string to be compared.
     *
     * @returns the value `0` if the argument string is equal to this string; a value less than `0` if this string
     */
    public compareToIgnoreCase(anotherString: JavaString): number {
        return this.#value.localeCompare(anotherString.#value, undefined, { sensitivity: "case" });
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

        if (!(obj instanceof JavaString)) {
            return false;
        }

        return this.#value === obj.#value;
    }

    /** @returns a hash code for this string. */
    public override hashCode(): number {
        return MurmurHash.hashCode(this.#value, 17);
    }

    /** Returns the index within this string of the first occurrence of the specified character. */
    public indexOf(ch: char): number;
    /**
     * Returns the index within this string of the first occurrence of the specified character, starting the search
     * at the specified index.
     */
    public indexOf(ch: char, fromIndex: number): number;
    /** Returns the index within this string of the first occurrence of the specified substring. */
    public indexOf(searchString: JavaString): number;
    /**
     * Returns the index within this string of the first occurrence of the specified substring, starting at the
     * specified index.
     */
    public indexOf(searchString: JavaString, fromIndex: number): number;
    public indexOf(chOrSearchString: char | JavaString, fromIndex?: number): number {
        if (typeof chOrSearchString === "number") {
            return this.#value.indexOf(window.String.fromCharCode(chOrSearchString), fromIndex);
        }

        return this.#value.indexOf(chOrSearchString.#value, fromIndex);
    }

    /** @returns `true` if, and only if, length() is `0`. */
    public isEmpty(): boolean {
        return this.#value.length === 0;
    }

    /** Returns the index within this string of the last occurrence of the specified character. */
    public lastIndexOf(ch: char): number;
    /**
     * Returns the index within this string of the last occurrence of the specified character, searching backward
     * starting at the specified index.
     */
    public lastIndexOf(ch: char, fromIndex: number): number;
    /** Returns the index within this string of the last occurrence of the specified substring. */
    public lastIndexOf(searchString: JavaString): number;
    /**
     * Returns the index within this string of the last occurrence of the specified substring, searching backward
     * starting at the specified index.
     */
    public lastIndexOf(searchString: JavaString, fromIndex: number): number;
    public lastIndexOf(chOrSearchString: char | JavaString, fromIndex?: number): number {
        if (typeof chOrSearchString === "number") {
            if (fromIndex === undefined) {
                return this.#value.lastIndexOf(window.String.fromCharCode(chOrSearchString));
            }

            return this.#value.lastIndexOf(window.String.fromCharCode(chOrSearchString), fromIndex);
        }

        if (fromIndex === undefined) {
            return this.#value.lastIndexOf(chOrSearchString.#value);
        }

        return this.#value.lastIndexOf(chOrSearchString.#value, fromIndex);
    }

    /** @returns the the length of this string. */
    public length(): number {
        return this.#value.length;
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
     * @returns a string resulting from replacing all occurrences of `oldChar` in this string with `newChar`.
     */
    public replace(target: CharSequence, replacement: CharSequence): JavaString;
    public replace(targetOrOldChar: CharSequence | char,
        replacementOrNewChar: CharSequence | char): JavaString {
        let searchValue;
        let replacement;
        if (typeof targetOrOldChar === "number") {
            searchValue = window.String.fromCharCode(targetOrOldChar);
            replacement = window.String.fromCharCode(replacementOrNewChar as number);
        } else {
            searchValue = targetOrOldChar.toString().valueOf();
            replacement = replacementOrNewChar.toString().valueOf();
        }

        if (this.#value.includes(searchValue)) {
            const s = this.#value.replaceAll(searchValue, replacement);

            return new JavaString(s);
        }

        return this;
    }

    /**
     * Splits this string around matches of the given regular expression.
     *
     * @param regex the delimiting regular expression.
     * @param limit the result threshold, as described above.
     *
     * @returns the array of strings computed by splitting this string around matches of the given regular expression.
     */
    public split(regex: JavaString | string, limit?: number): JavaString[] {
        const parts = this.#value.split(`${regex}`, limit);

        return parts.map((value) => {
            return new JavaString(value);
        });
    }

    /** @returns a string whose value is this string, with all leading and trailing white space removed. */
    public strip(): JavaString {
        return this.stripLeading().stripTrailing();
    }

    /** @returns a string whose value is this string, with all leading white space removed. */
    public stripLeading(): JavaString {
        const match = this.#value.match(JavaString.#whitespaceRegExBegin);
        if (!match) {
            return this;
        }

        return new JavaString(this.#value.substring(match[0].length));
    }

    /** @returns a string whose value is this string, with all trailing white space removed. */
    public stripTrailing(): JavaString {
        const match = this.#value.match(JavaString.#whitespaceRegExEnd);
        if (!match) {
            return this;
        }

        return new JavaString(this.#value.substring(0, this.#value.length - match[0].length));
    }

    /**
     * @param start the beginning index, inclusive.
     * @param end the ending index, exclusive.
     *
     * @returns a character sequence that is a subsequence of this sequence.
     */
    public subSequence(start: number, end: number): CharSequence {
        return this.substring(start, end);
    }

    /**Returns a string that is a substring of this string.*/
    public substring(beginIndex: number, endIndex?: number): JavaString {
        return new JavaString(this.#value.substring(beginIndex, endIndex));
    }

    /**
     * Converts this string to a new character array.
     *
     * @returns a newly allocated character array whose length is the length of this string and whose contents are
     */
    public toCharArray(): Uint16Array {
        const result = new Uint16Array(this.#value.length);
        for (let i = 0; i < this.#value.length; ++i) {
            result[i] = this.#value.charCodeAt(i);
        }

        return result;
    }

    /**
     * @returns a string whose value is this string, with all leading and trailing space removed, where space is defined
     *          as any character whose codepoint is less than or equal to 'U+0020'(the space character).
     */
    public trim(): JavaString {
        const startMatch = this.#value.match(JavaString.#spaceRegExBegin);
        const endMatch = this.#value.match(JavaString.#spaceRegExEnd);
        if (!startMatch && !endMatch) {
            return this;
        }

        const start = startMatch ? startMatch[0].length : 0;
        const end = this.#value.length - (endMatch ? endMatch[0].length : 0);

        return new JavaString(this.#value.substring(start, end));
    }

    /**
     * Not part of the Java API, but here to ease primitive value access.
     *
     * @returns the primitive string value of this instance.
     */
    public override valueOf(): string {
        return this.#value;
    }

    public override toString(): JavaString {
        return this;
    }
}
