/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { isEquatable } from "../../type-guards";
import { MurmurHash } from "../../MurmurHash";
import { int } from "../../types";

import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Comparator } from "./Comparator";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { List } from "./List";
import { ArrayList } from "./ArrayList";
import { ArrayIndexOutOfBoundsException, NullPointerException } from "../lang";

export type ComparableValueType = number | bigint | string;
export type TypedArray =
    Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Uint8ClampedArray | Float32Array
    | Float64Array;

export type TypedArrayConstructor =
    Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor |
    Int32ArrayConstructor | Uint32ArrayConstructor | Uint8ClampedArrayConstructor | Float32ArrayConstructor
    | Float64ArrayConstructor;

/**
 * This class contains static methods that operate on or return arrays.
 * It contains methods to search, sort and manipulate arrays (such as
 * insertion and deletion). This class also contains a static factory
 * that allows arrays to be viewed as lists.
 *
 * In addition to the methods that mirror the Java implementation there are some helpers to convert between
 * Java arrays and Typescript arrays.
 */
export class Arrays extends JavaObject {
    private constructor() {
        super();
    }

    /**
     * @param a the array by which the list will be backed or a list of values to initialize the array with.
     *
     * @returns a fixed-size list backed by the specified array.
     */
    public static asList<T>(this: void, a: T[]): List<T>;
    public static asList<T>(this: void, ...a: T[]): List<T>;
    public static asList<T>(this: void, a: T[]): List<T> {
        return new ArrayList<T>(a);
    }

    /**
     * Returns true if the two specified arrays are equal to one another. Two arrays are considered equal if both
     * arrays contain the same number of elements, and all corresponding pairs of elements in the two arrays are equal.
     * In other words, two arrays are equal if they contain the same elements in the same order.
     * Also, two array references are considered equal if both are null/undefined.
     *
     * @param a The array to compare against another array.
     * @param a2 The other array to compare to.
     *
     * @returns True if both arrays are equal, false otherwise.
     */
    public static equals(a?: ArrayLike<unknown>, a2?: ArrayLike<unknown>): boolean {
        if (a === a2) {
            return true; // Same object or both null/undefined.
        }

        if (!a || !a2) {
            return false;
        }

        if (a.length !== a2.length) {
            return false;
        }

        for (let i = 0; i < a.length; ++i) {
            const t = a[i];
            if (isEquatable(t)) {
                if (!t.equals(a2[i])) {
                    return false;
                }
            } else if (t !== a2[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Returns true if the two specified arrays are deeply equal to one another. Unlike the `equals()` method, this
     * method is appropriate for use with nested arrays of arbitrary depth.
     *
     * @param a The array to compare against another array.
     * @param a2 The other array to compare to.
     *
     * @returns True if both arrays are equal, false otherwise.
     */
    public static deepEquals(a?: ArrayLike<unknown>, a2?: ArrayLike<unknown>): boolean {
        if (a === a2) {
            return true; // Same object or both null/undefined.
        }

        if (!a || !a2) {
            return false;
        }

        if (a.length !== a2.length) {
            return false;
        }

        // XXX: use `equals()` for each element instead of hash codes.
        const hash1 = this.deepHashCode(a);
        const hash2 = this.deepHashCode(a2);

        return hash1 === hash2;
    }

    public static binarySearch<T extends ComparableValueType>(list: ArrayLike<T>, value: T): number;
    public static binarySearch<T extends ComparableValueType>(list: ArrayLike<T>, start: number, end: number,
        value: T): number;
    public static binarySearch<T extends ComparableValueType>(list: ArrayLike<T>, startOrValue: number | T,
        end?: number, value?: T): number {

        let theValue: T;
        let start = 0;
        let stop = list.length;
        if (typeof startOrValue === "number") {
            start = startOrValue;
            stop = end ?? list.length;
            theValue = value!;
        } else {
            theValue = startOrValue;
        }

        if (end !== undefined) {
            start = startOrValue as number;
            stop = end;
        }

        while (start < stop) {
            const mid = (stop + start) >> 1;
            if (theValue > list[mid]) {
                start = mid + 1;
            } else if (theValue < list[mid]) {
                stop = mid;
            } else {
                return mid;
            }
        }

        return -start - 1;
    }

    public static copyOf<T extends TypedArray>(original: T, newLength: number): T;
    /**
     * Copies the specified array, truncating or padding with null (if necessary) so the copy has the specified length.
     * For all indices that are valid in both the original array and the copy, the two arrays will contain identical
     * values. For any indices that are valid in the copy but not the original, the copy will be undefined.
     * Such indices will exist if and only if the specified length is greater than that of the original array.
     *
     * @param original The array to be copied.
     * @param newLength The length of the copy to be returned.
     *
     * @returns A copy of the original array, truncated or padded with null to obtain the specified length.
     */
    public static copyOf<T>(original: T[], newLength: number): T[];
    public static copyOf<T>(original: T[] | TypedArray, newLength: number): T[] | TypedArray {
        if (newLength < original.length) {
            return original.slice(0, newLength);
        }

        if (newLength === original.length) {
            return original.slice();
        }

        if (!Array.isArray(original)) {
            const result = new (original.constructor as new (arg: number) => TypedArray)(newLength);
            result.set(original);
            if (newLength > original.length) {
                result.fill(0, original.length);
            }

            return result;
        } else {
            const result = original.slice();
            result.length = newLength;
            if (newLength > original.length) {
                result.fill(null as T, original.length);
            }

            return result;
        }
    }

    public static copyOfRange<T extends TypedArray>(original: T, from: int, to: int): T;
    /**
     * Copies the specified array, truncating or padding with null (if necessary) so the copy has the specified length.
     * For all indices that are valid in both the original array and the copy, the two arrays will contain identical
     * values. For any indices that are valid in the copy but not the original, the copy will be undefined.
     * Such indices will exist if and only if the specified length is greater than that of the original array.
     *
     * @param original The array to be copied.
     * @param newLength The length of the copy to be returned.
     *
     * @returns A copy of the original array, truncated or padded with null to obtain the specified length.
     */
    public static copyOfRange<T>(original: T[], from: int, to: int): T[];
    public static copyOfRange<T>(original: T[] | TypedArray, from: int, to: int): T[] | TypedArray {
        if (from < 0 || to > original.length) {
            throw new ArrayIndexOutOfBoundsException();
        }

        if (from > to) {
            throw new IllegalArgumentException();
        }

        if (original === null) {
            throw new NullPointerException();
        }

        const newLength = to - from;
        if (to < original.length) {
            return original.slice(from, to);
        }

        // "to" is >= than original.length, so we copy everything from "from" to the end of the array.
        if (!Array.isArray(original)) {
            const result = new (original.constructor as new (arg: number) => TypedArray)(newLength);
            result.set(original.slice(from));
            result.fill(0, original.length - from);

            return result;
        } else {
            const result = original.slice(from);
            result.length = newLength;
            result.fill(null as T, original.length - from);

            return result;
        }
    }

    public static hashCode(a: ArrayLike<unknown>): int {
        let hash = MurmurHash.initialize(17);
        hash = MurmurHash.updateFromArray(hash, a, false);

        return MurmurHash.finish(hash, 1);
    }

    /**
     * @returns A hash code based on the "deep contents" of the specified array.
     *
     * @param a The array to hash.
     */
    public static deepHashCode(a: ArrayLike<unknown>): number {
        let hash = MurmurHash.initialize(17);
        hash = MurmurHash.updateFromArray(hash, a, true);

        return MurmurHash.finish(hash, 1);
    }

    /**
     * Finds and returns the index of the first mismatch between two arrays, otherwise return -1 if no mismatch is
     * found.
     */
    public static mismatch<T>(a: ArrayLike<T>, b: ArrayLike<T>): int;
    /**
     * Finds and returns the relative index of the first mismatch between two int arrays over the specified ranges,
     * otherwise return -1 if no mismatch is found.
     */
    public static mismatch<T>(a: ArrayLike<T>, aFromIndex: int, aToIndex: int, b: ArrayLike<T>,
        bFromIndex: int, bToIndex: int): int;
    /**
     * Finds and returns the index of the first mismatch between two Object arrays, otherwise return -1 if no mismatch
     * is found.
     */
    public static mismatch<T>(a: ArrayLike<T>, b: ArrayLike<T>, cmp: Comparator<T>): int;
    /**
     * Finds and returns the relative index of the first mismatch between two Object arrays over the specified ranges,
     * otherwise return -1 if no mismatch is found.
     */
    public static mismatch<T>(a: ArrayLike<T>, aFromIndex: int, aToIndex: int, b: ArrayLike<T>,
        bFromIndex: int, bToIndex: int, cmp: Comparator<T>): int;
    public static mismatch<T>(...args: unknown[]): int {
        if (args.length === 7) {
            const [a, aFromIndex, aToIndex, b, bFromIndex, bToIndex, cmp] =
                args as [ArrayLike<T>, int, int, ArrayLike<T>, int, int, Comparator<T>];
            if (aFromIndex < 0 || aToIndex > a.length || aFromIndex > aToIndex) {
                throw new IndexOutOfBoundsException();
            }

            if (bFromIndex < 0 || bToIndex > b.length || bFromIndex > bToIndex) {
                throw new IndexOutOfBoundsException();
            }

            const length = Math.max(a.length, b.length);
            for (let i = 0; i < length; i++) {
                if (i === a.length || i === b.length) {
                    return i;
                }

                if (cmp(a[i], b[i]) !== 0) {
                    return i;
                }
            }

            return -1;
        }

        switch (args.length) {
            case 2: {
                const [a, b] = args as [ArrayLike<unknown>, ArrayLike<unknown>];
                if (a.length === 0 && b.length === 0) {
                    return -1;
                }

                if (a[0] instanceof JavaObject) {
                    const length = Math.max(a.length, b.length);
                    for (let i = 0; i < length; i++) {
                        if (i === a.length || i === b.length) {
                            return i;
                        }

                        if (!(a[i] as JavaObject).equals(b[i])) {
                            return i;
                        }
                    }
                } else {
                    const length = Math.max(a.length, b.length);
                    for (let i = 0; i < length; i++) {
                        if (i === a.length || i === b.length) {
                            return i;
                        }

                        if (a[i] !== b[i]) {
                            return i;
                        }
                    }
                }

                return -1;
            }

            case 6: {
                const [a, aFromIndex, aToIndex, b, bFromIndex, bToIndex] =
                    args as [ArrayLike<unknown>, int, int, ArrayLike<unknown>, int, int];

                const aLength = aToIndex - aFromIndex;
                const bLength = bToIndex - bFromIndex;
                if (aLength === 0 && bLength === 0) {
                    return -1;
                }

                if (a[aFromIndex] instanceof JavaObject) {
                    const length = Math.max(aLength, bLength);
                    for (let i = 0; i < length; i++) {
                        if (i === aLength || i === bLength) {
                            return i;
                        }

                        if (!(a[aFromIndex + i] as JavaObject).equals(b[bFromIndex + i])) {
                            return i;
                        }
                    }
                } else {
                    const length = Math.max(a.length, b.length);
                    for (let i = 0; i < length; i++) {
                        if (i === a.length || i === b.length) {
                            return i;
                        }

                        if (a[aFromIndex + i] !== b[bFromIndex + i]) {
                            return i;
                        }
                    }
                }

                return -1;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }
    }

    /**
     * Sorts the specified array into ascending order.
     *
     * @param list The array to sort.
     */
    public static sort<T>(list: T[]): void {
        list.sort((a, b) => {
            if (a < b) {
                return -1;
            }

            if (a > b) {
                return 1;
            }

            return 0;
        });
    }

    public static override toString(value: TypedArray | null): JavaString;
    public static override toString<T>(value: T[] | null): JavaString;
    public static override toString<T>(value: T[] | TypedArray | null): JavaString {
        return new JavaString(`${JSON.stringify(value)}`);
    }
}
