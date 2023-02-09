/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, S } from "../..";
import { JavaObject } from "./Object";

export class Boolean extends JavaObject implements java.io.Serializable, java.lang.Comparable<Boolean> {
    public static readonly TRUE: Boolean;
    public static readonly FALSE: Boolean;
    public static readonly TYPE: java.lang.Class<Boolean>;

    private value = false;

    public constructor(value?: boolean | string) {
        super();

        if (value !== undefined) {
            if (typeof value === "boolean") {
                this.value = value;
            } else {
                this.value = value.toLowerCase() === "true";
            }
        }
    }

    /**
     * Returns a Boolean instance representing the specified string.
     * The argument is interpreted as representing a boolean value as if by the valueOf method.
     * The result is a Boolean that represents the boolean value specified by the string.
     * If the string argument is null, then the result is null.
     * If the string argument is not "true" or "false", ignoring case, then the result is null.
     * If the string argument is "true", ignoring case, then the result is Boolean.TRUE.
     * If the string argument is "false", ignoring case, then the result is Boolean.FALSE.
     *
     * @param s The string to be parsed.
     * @returns a Boolean instance representing the specified string.
     */
    public static parseBoolean(s: java.lang.String | null): Boolean | null {
        if (s === null) {
            return null;
        }

        if (s.compareToIgnoreCase(S`true`)) {
            return Boolean.TRUE;
        }

        if (s.compareToIgnoreCase(S`false`)) {
            return Boolean.FALSE;
        }

        return null;
    }

    /**
     * Returns a String object representing the specified boolean.
     * If the specified boolean is true, then the string "true" is returned, otherwise the string "false" is returned.
     *
     * @param b The boolean to be converted.
     * @returns a string representation of the specified boolean.
     */
    public static toString(b: boolean): java.lang.String {
        return b ? S`true` : S`false`;
    }

    /**
     * Returns a Boolean with a value represented by the specified string or boolean value.
     *
     * @param value tbd
     *
     * @returns tbd
     */
    public static valueOf(value?: boolean | string): java.lang.Boolean {
        return new java.lang.Boolean(value);
    }

    /**
     * Compares two boolean values.
     * The value returned is identical to what would be returned by:
     * ```
     * Boolean.valueOf(x).compareTo(Boolean.valueOf(y))
     * ```
     *
     * @param x the first boolean to compare
     * @param y the second boolean to compare
     * @returns the value 0 if x == y; a value less than 0 if !x && y; and a value greater than 0 if x && !y
     */
    public static compare(x: boolean, y: boolean): number {
        if (x === y) {
            return 0;
        }

        if (!x && y) {
            return -1;
        }

        return 1;
    }

    /**
     * Returns the value of the system property with the specified name.
     * The first argument is treated as the name of a system property.
     * The string value of this property is then interpreted as a boolean value, as per the Boolean.valueOf method,
     * and the result is returned.
     * If there is no property with the specified name, or if the specified name is empty or null, then false is
     * returned.
     *
     * @param name the name of the system property.
     *
     * @returns the boolean value of the system property.
     */
    public static getBoolean(name: java.lang.String): boolean {
        const value = java.lang.System.getProperty(name);

        const bool = Boolean.parseBoolean(value);

        return bool !== null ? bool.value : false;
    }

    /** @returns the value of this Boolean object as a boolean primitive. */
    public booleanValue(): boolean {
        return this.value;
    }

    /**
     * Compares this Boolean instance with another.
     * The result is true if and only if the argument is not null and is a Boolean object that represents the same
     * boolean value as this object.
     *
     * @param b the object to compare with.
     *
     * @returns true if the Boolean objects represent the same value; false otherwise.
     */
    public compareTo(b: Boolean): number {
        return Boolean.compare(this.value, b.value);
    }

    /**
     * Returns true if and only if the argument is not null and is a Boolean object that represents the same boolean
     * value as this object.
     *
     * @param obj the object to compare with.
     *
     * @returns true if the Boolean objects represent the same value; false otherwise.
     */
    public equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }

        if (obj instanceof Boolean) {
            return this.value === obj.value;
        }

        return false;
    }

    /** @returns a hash code for this Boolean object. */
    public hashCode(): number {
        return 0;
    }

    /** @returns a string representing this Boolean's value. */
    public toString(): java.lang.String {
        return this.value ? new java.lang.String("true") : new java.lang.String("false");
    }

    /**
     * @param hint A string representing the type of the expected primitive value.
     *
     * @returns a string representing this Boolean's value.
     */
    protected [Symbol.toPrimitive](hint: string): number | string | null {
        if (hint === "number") {
            return this.value ? 1 : 0;
        }

        return this.value ? "true" : "false";
    }

    static {
        // Defer initializing the TYPE field, to ensure the Class class is loaded before using it.
        setTimeout(() => {
            /* @ts-expect-error */
            Boolean.TRUE = new java.lang.Boolean(true);

            /* @ts-expect-error */
            Boolean.FALSE = new java.lang.Boolean(false);

            /* @ts-expect-error */
            Boolean.TYPE = java.lang.Class.fromConstructor(Boolean);
            Object.freeze(Boolean);
        }, 0);
    }

}
