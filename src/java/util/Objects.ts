/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../lang/Object";

import { isArrayLike, isEquatable } from "../../type-guards";
import { MurmurHash } from "../../MurmurHash";
import { Arrays } from "./Arrays";
import { JavaString } from "../lang/String";
import { IndexOutOfBoundsException } from "../lang/IndexOutOfBoundsException";
import { Comparator } from "./Comparator";
import { Supplier } from "./function/Supplier";
import { NullPointerException } from "../lang/NullPointerException";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

export class Objects extends JavaObject {
    /**
     * Checks if the sub-range from fromIndex (inclusive) to fromIndex + size (exclusive) is within the bounds of
     * range from 0 (inclusive) to length (exclusive).
     *
     * @param fromIndex the lower bound of the sub-range.
     * @param toIndex the upper bound of the sub-range.
     * @param length the length of the range.
     */
    public static checkFromToIndex(fromIndex: number, toIndex: number, length: number): void {
        if (fromIndex < 0 || fromIndex > toIndex || toIndex > length || length < 0) {
            throw new IndexOutOfBoundsException();
        }
    }

    /**
     * Checks if the sub-range from fromIndex (inclusive) to toIndex (exclusive) is within the bounds of range
     * from 0 (inclusive) to length (exclusive).
     *
     * @param fromIndex the lower bound of the sub-range.
     * @param size the size of the sub-range.
     * @param length the length of the range.
     */
    public static checkFromIndex(fromIndex: number, size: number, length: number): void {
        if (fromIndex < 0 || fromIndex > length || length < 0 || length - fromIndex < size) {
            throw new IndexOutOfBoundsException();
        }
    }

    /**
     * Checks if the index is within the bounds of the range from 0 (inclusive) to length (exclusive).
     *
     * @param index the index to check.
     * @param length the length of the range.
     */
    public static checkIndex(index: number, length: number): void {
        if (index < 0 || index >= length) {
            throw new IndexOutOfBoundsException();
        }
    }

    /**
     * Returns 0 if the arguments are identical and c.compare(a, b) otherwise.
     * Consequently, if both arguments are null 0 is returned.
     *
     * @param a an object.
     * @param b an object to be compared with a for order.
     * @param c the comparator to compare the first two arguments.
     *
     * @returns 0 if the arguments are identical and c.compare(a, b) otherwise.
     */
    public static compare<T>(a: T, b: T, c: Comparator<T>): number {
        if (a === b) {
            return 0;
        }

        return c.compare!(a, b);
    }

    /**
     * Returns true if the arguments are deeply equal to each other and false otherwise.
     *
     * @param a an object.
     * @param b an object to be compared with a for equality.
     *
     * @returns true if the arguments are deeply equal to each other and false otherwise.
     */
    public static deepEquals(a: unknown, b: unknown): boolean {
        if (a === b) {
            return true;
        }

        if (a === undefined || b === undefined) {
            return false;
        }

        if (isArrayLike(a)) {
            if (isArrayLike(b)) {
                return Arrays.deepEquals(a, b);
            }

            return false;
        }

        if (isArrayLike(b)) {
            return false;
        }

        if (isEquatable(a)) {
            return a.equals(b);
        }

        return false;
    }

    /**
     * Returns true if the arguments are equal to each other and false otherwise.
     * Consequently, if both arguments are null true is returned and if exactly one argument is null false is
     * returned. Otherwise, equality is determined by using the equals method of the first argument.
     *
     * @param a an object.
     * @param b an object to be compared with a for equality.
     *
     * @returns true if the arguments are equal to each other and false otherwise.
     */
    public static equals(a: unknown, b: unknown): boolean {
        if (a === b) {
            true;
        }

        if (a === undefined || b === undefined) {
            return false;
        }

        if (isEquatable(a)) {
            return a.equals(b);
        }

        return false;
    }

    /**
     * Generates a hash code for a sequence of input values.
     *
     * @param values the values to be hashed.
     *
     * @returns a hash value of the sequence of input values.
     */
    public static hash(...values: unknown[]): number {
        return MurmurHash.hashCode(values, 37);
    }

    /**
     * @returns the hash code of a non - null argument and 0 for a null argument.
     *
     * @param o tbd
     */
    public static hashCode(o: unknown): number {
        return MurmurHash.hashCode(o, 37);
    }

    /**
     * Returns true if the provided reference is null otherwise returns false.
     *
     * @param obj the reference to check against null.
     *
     * @returns true if the provided reference is null otherwise returns false.
     */
    public static isNull(obj: unknown): boolean {
        return obj === null;
    }

    /**
     * Returns true if the provided reference is non-null otherwise returns false.
     *
     * @param obj the reference to check against null.
     *
     * @returns true if the provided reference is non-null otherwise returns false.
     */
    public static nonNull(obj: unknown): boolean {
        return obj !== null;
    }

    /**
     * Checks that the specified object reference is not null.
     * This method is designed primarily for doing parameter validation in methods and constructors with
     * multiple parameters, as demonstrated below:
     * <pre>
     * public Foo(Bar bar, Baz baz) {
     *    this.bar = Objects.requireNonNull(bar, "bar must not be null");
     *   this.baz = Objects.requireNonNull(baz, "baz must not be null");
     * }
     * </pre>
     *
     * @param obj the object reference to check for nullity.
     *
     * @throws NullPointerException if {@code obj} is {@code null}.
     *
     * @returns the non-null reference that was validated.
     */
    public static requireNonNull<T>(obj: T | null): T;
    /**
     * Checks that the specified object reference is not null and throws a customized NullPointerException if it is.
     * This method is designed primarily for doing parameter validation in methods and constructors with
     * multiple parameters, as demonstrated below:
     * <pre>
     * public Foo(Bar bar, Baz baz) {
     *   this.bar = Objects.requireNonNull(bar, "bar must not be null");
     *  this.baz = Objects.requireNonNull(baz, "baz must not be null");
     * }
     * </pre>
     *
     * @param obj the object reference to check for nullity.
     * @param message the detail message to be used in the event that a {@code NullPointerException} is thrown.
     *
     * @throws NullPointerException if {@code obj} is {@code null}.
     *
     * @returns the non-null reference that was validated.
     */
    public static requireNonNull<T>(obj: T | null, message: JavaString): T;
    /**
     * Checks that the specified object reference is not null and throws a customized NullPointerException if it is.
     * Unlike the method requireNonNull(Object, String), this method accepts a Supplier<String> instead of a String.
     * This allows the message to be lazily evaluated, which can be useful in situations where the message is
     * expensive to compute.
     */
    public static requireNonNull<T>(obj: T | null, messageSupplier: Supplier<JavaString>): T;
    public static requireNonNull<T>(...args: unknown[]): T {
        switch (args.length) {
            case 1: {
                if (args[0] === null) {
                    throw new NullPointerException();
                }

                return args[0] as T;
            }

            case 2: {
                if (args[0] === null) {
                    if (args[1] instanceof JavaString) {
                        throw new NullPointerException(args[1]);
                    }

                    const supplier = args[1] as Supplier<JavaString>;
                    throw new NullPointerException(supplier.get());
                }

                return args[0] as T;
            }

            default: {
                throw new IllegalArgumentException();
            }
        }
    }

    /**
     * Returns the result of calling toString for a non- null argument and "null" for a null argument.
     *
     * @param o the object to be converted to a string.
     *
     * @returns the result of calling toString() on the first argument if it is not null; "null" otherwise.
     */
    public static override toString(o: unknown): JavaString;
    /**
     * Returns the result of calling toString() on the first argument if the first argument is not null and returns
     * the second argument otherwise.
     * If the first argument is null and the second argument is null, then "null" is returned.
     * If the first argument is null and the second argument is not null, then the second argument is returned.
     * If the first argument is not null and the second argument is null, then the result of calling toString() on
     * the first argument is returned.
     *
     * @param o the object to be converted to a string.
     * @param nullDefault the default value to be returned if the first argument is null.
     *
     * @returns the result of calling toString() on the first argument if it is not null; the second argument otherwise.
     */
    public static override toString(o: unknown, nullDefault: JavaString): JavaString;
    public static override toString(o: unknown, nullDefault?: JavaString): JavaString {
        if (o == null) {
            return nullDefault ?? new JavaString("null");
        }

        return JavaString.valueOf(o);
    }
}
