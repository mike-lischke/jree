/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { MurmurHash } from "../../MurmurHash";

import { java } from "../..";
import { JavaObject } from "./Object";

export class Integer extends JavaObject implements java.io.Serializable, java.lang.Comparable<Integer>  {
    public static readonly MAX_VALUE = 2147483647;
    public static readonly MIN_VALUE = -2147483648;
    public static readonly SIZE = 32;
    public static readonly TYPE: java.lang.Class<Integer>;

    // All number types are signed in Java.
    private static byte = new Int8Array(1);
    private static short = new Int16Array(1);

    private value: number; // Can use number here, as it uses 52 bit for the mantissa, while we only need 32 bit.

    /**
     * Constructs a newly allocated Integer object that represents the specified int or string value.
     *
     * @param value A primitive type to wrap in this instance.
     */
    public constructor(value: number | string | java.lang.String) {
        super();

        if (typeof value === "string") {
            this.value = parseInt(value, 10);
        } else if (value instanceof java.lang.String) {
            this.value = parseInt(`${value}`, 10);
        } else if (Number.isInteger(value)) {
            this.value = value;
        } else {
            throw new java.lang.IllegalArgumentException();
        }
    }

    /**
     * @returns The number of one-bits in the two's complement binary representation of the specified int value.
     *
     * @param i The value to examine.
     */
    public static bitCount(i: number): number {
        if (Number.isInteger(i)) {
            i = i - ((i >> 1) & 0x55555555);
            i = (i & 0x33333333) + ((i >> 2) & 0x33333333);

            return ((i + (i >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
        }

        throw new java.lang.IllegalArgumentException();
    }

    /**
     * Compares two int values numerically.
     *
     * @param x The first value to compare.
     * @param y The second value to compare.
     *
     * @returns A value < 0 if x is less than y, > 0 if x is larger than y, otherwise 0.
     */
    public static compare(x: number, y: number): number {
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            throw new java.lang.IllegalArgumentException();
        }

        return x - y;
    }

    /**
     * Decodes a String into an Integer.
     *
     * @param nm The number as string.
     *
     * @returns A new Integer with the converted value.
     */
    public static decode(nm: string): Integer {
        const n = nm.trim().toLowerCase();
        if (n.length === 0) {
            throw new java.lang.NumberFormatException();
        }

        try {
            // The function parseInt does not support octal numbers, so we have to handle that case manually.
            let sign = "";
            let start = 0;
            if (n[0] === "+" || n[0] === "-") {
                sign = n[0];
                ++start;
            }

            let radix = 10;
            if (n.length - start > 1) {
                if (n[start] === "#") {
                    ++start;
                    radix = 16;
                } else if (n[start] === "0") {
                    ++start;
                    if (n[start] === "x") {
                        radix = 16;
                        ++start;
                    } else {
                        radix = 8;
                    }
                }
            }

            return new java.lang.Integer(parseInt(sign + n.substring(start), radix));
        } catch (reason) {
            throw new java.lang.NumberFormatException(java.lang.Throwable.fromError(reason));
        }
    }

    /**
     * Determines the integer value of the system property with the specified name.
     *
     * @param nm The name of the system property to read.
     * @param val A value to be used if the property wasn't found.
     *
     * @returns The system property as Integer or the default value as Integer.
     */
    public static getInteger(nm?: java.lang.String, val?: number): Integer | null {
        const p = nm && nm.length() > 0 ? java.lang.System.getProperty(nm) : undefined;
        if (!p) {
            if (val === undefined) {
                return null;
            }

            return new Integer(val);
        }

        try {
            return new Integer(p);
        } catch (reason) {
            return null;
        }
    }

    /**
     * @returns an int value with at most a single one-bit, in the position of the highest-order ("leftmost") one-bit
     * in the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static highestOneBit(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i & (Integer.MIN_VALUE >>> this.numberOfLeadingZeros(i));
    }

    /**
     * @returns an int value with at most a single one-bit, in the position of the lowest-order ("rightmost") one-bit
     * in the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static lowestOneBit(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return i & -i;
    }

    /**
     * @returns the number of zero bits preceding the highest-order ("leftmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfLeadingZeros(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        if (i <= 0) {
            return i === 0 ? 32 : 0;
        }

        let n = 31;
        if (i >= 1 << 16) {
            n -= 16;
            i >>>= 16;
        }

        if (i >= 1 << 8) {
            n -= 8;
            i >>>= 8;
        }

        if (i >= 1 << 4) {
            n -= 4;
            i >>>= 4;
        }

        if (i >= 1 << 2) {
            n -= 2;
            i >>>= 2;
        }

        return n - (i >>> 1);
    }

    /**
     * @returns the number of zero bits following the lowest-order ("rightmost") one-bit in the two's complement binary
     * representation of the specified int value.
     *
     * @param i The value for which the result must be determined.
     */
    public static numberOfTrailingZeros(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        i = ~i & (i - 1);
        if (i <= 0) {
            return i & 32;
        }

        let n = 1;

        if (i > 1 << 16) {
            n += 16;
            i >>>= 16;
        }

        if (i > 1 << 8) {
            n += 8;
            i >>>= 8;
        }

        if (i > 1 << 4) {
            n += 4;
            i >>>= 4;
        }

        if (i > 1 << 2) {
            n += 2;
            i >>>= 2;
        }

        return n + (i >>> 1);
    }

    /**
     * @returns the value obtained by reversing the order of the bits in the two's complement binary representation of
     * the specified int value.
     *
     * @param i The value to reverse.
     */
    public static reverse(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        i = ((i & 0x55555555) << 1) | ((i >>> 1) & 0x55555555);
        i = ((i & 0x33333333) << 2) | ((i >>> 2) & 0x33333333);
        i = ((i & 0x0F0F0F0F) << 4) | ((i >>> 4) & 0x0F0F0F0F);
        i = (i << 24) | ((i & 0xFF00) << 8) | ((i >>> 8) & 0xFF00) | (i >>> 24);

        return i;
    }

    /**
     * @returns the value obtained by reversing the order of the bytes in the two's complement representation of the
     * specified int value.
     *
     * @param i The number to reverse.
     */
    public static reverseBytes(i: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i << 24) | ((i & 0xFF00) << 8) | ((i >>> 8) & 0xFF00) | (i >>> 24);
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified int value
     * left by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateLeft(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i << distance) | (i >>> -distance);
    }

    /**
     * @returns the value obtained by rotating the two's complement binary representation of the specified int value
     * right by the specified number of bits.
     *
     * @param i The number with the bits to rotate.
     * @param distance Determines how far to rotate.
     */
    public static rotateRight(i: number, distance: number): number {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return (i >>> distance) | (i << -distance);
    }

    /**
     * @returns the signum function of the specified int value.
     *
     * @param i The value from which to get the signum.
     */
    public static signum(i: number): number {
        return i < 0 ? -1 : (i > 0) ? 1 : 0;
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 2.
     *
     * @param i The number to convert.
     */
    public static toBinaryString(i: number): java.lang.String {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return S`${i.toString(2)}`;
    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 16.
     *
     * @param i The number to convert.
     */
    public static toHexString(i: number): java.lang.String {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return S`${i.toString(16)}`;

    }

    /**
     * @returns a string representation of the integer argument as an unsigned integer in base 8.
     *
     * @param i The number to convert.
     */
    public static toOctalString(i: number): java.lang.String {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return S`${i.toString(8)}`;

    }

    /**
     * @returns a string representation of the first argument in the radix specified by the second argument.
     *
     * @param i The number to convert.
     * @param radix The radix of the result string.
     */
    public static toString(i: number, radix?: number): java.lang.String {
        if (!Number.isInteger(i)) {
            throw new java.lang.IllegalArgumentException();
        }

        return S`${i.toString(radix)}`;

    }

    /**
     * Returns an Integer object holding the value given or extracted from the specified String when parsed with the
     * radix given by the second argument.
     */
    public static valueOf(i: number): Integer;
    public static valueOf(s: string, radix?: number): Integer;
    public static valueOf(value: number | string, radix?: number): Integer {
        if (!radix || typeof value === "number") {
            return new Integer(value);
        }

        return new Integer(parseInt(value, radix));
    }

    public static parseInt(s: string | java.lang.String, radix = 10): number {
        const result = parseInt(`${s}`, radix);
        if (isNaN(result) || result > Integer.MAX_VALUE || result < Integer.MIN_VALUE) {
            throw new java.lang.NumberFormatException();
        }

        return result;
    }

    /** @returns the value of this Integer as a byte. */
    public byteValue(): number {
        Integer.byte[0] = this.value; // Signed integer "casting".

        return Integer.byte[0];
    }

    /**
     * Compares two Integer objects numerically.
     *
     * @param anotherInteger The value to compare this instance to.
     *
     * @returns A value < 0 if this instance is smaller than the other one, > 0 if larger, and 0 if they are equal.
     */
    public compareTo(anotherInteger: Integer): number {
        return this.value - anotherInteger.value;
    }

    /** @returns the value of this Integer as a double. */
    public doubleValue(): number {
        return this.value;
    }

    /**
     * Compares this object to the specified object.
     *
     * @param obj The object to compare this instance to.
     *
     * @returns True if obj is an instance of java.lang.Integer and both represent the same numerical value,
     *          otherwise false.
     */
    public equals(obj?: java.lang.Object): boolean {
        if (obj instanceof Integer) {
            return this.value === obj.value;
        }

        return false;
    }

    /** @returns the value of this Integer as a float. */
    public floatValue(): number {
        return this.value;
    }

    /** @returns a hash code for this Integer. */
    public hashCode(): number {
        let hash = MurmurHash.initialize(11);
        hash = MurmurHash.update(hash, this.value);
        hash = MurmurHash.finish(hash, 1);

        return hash;
    }

    /** @returns the value of this Integer as an int. */
    public intValue(): number {
        return this.value;
    }

    /** @returns the value of this Integer as a long. */
    public longValue(): number {
        return this.value;
    }

    /** @returns the value of this Integer as a short. */
    public shortValue(): number {
        Integer.short[0] = this.value;

        return Integer.short[0];
    }

    // Returns a String object representing this Integer's value.
    public toString(): java.lang.String {
        return S`${this.value}`;
    }

    public valueOf(): number {
        return this.value;
    }

    protected [Symbol.toPrimitive](hint: string): number | string | null {
        if (hint === "string") {
            return this.value.toString();
        }

        return this.value;
    }

    static {
        // Defer initializing the TYPE field, to ensure the Class class is loaded before using it.
        setTimeout(() => {
            /* @ts-expect-error */
            Integer.TYPE = java.lang.Class.fromConstructor(Integer);
            Object.freeze(Integer);
        }, 0);
    }

}
