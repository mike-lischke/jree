/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "./String";
import { Serializable } from "../io/Serializable";
import { Comparable } from "./Comparable";
import { JavaObject, Class } from "./Object";
import { System } from "./System";

export class JavaBoolean extends JavaObject implements Serializable, Comparable<JavaBoolean> {
    public static readonly TRUE = new JavaBoolean(true);
    public static readonly FALSE = new JavaBoolean(false);
    public static readonly TYPE: Class<JavaBoolean> = Class.fromConstructor(JavaBoolean);

    private value = false;

    /**
     * @deprecated It is rarely appropriate to use this constructor.
     *
     * @param value The value of the Boolean.
     *
     * Note: the parameter is only optional because otherwise we cannot create a Class<> instance.
     */
    public constructor(value?: boolean | JavaString | string) {
        super();

        if (typeof value === "boolean") {
            this.value = value;
        } else {
            this.value = `${value}`.toLowerCase() === "true";
        }
    }

    /**
     * Compares two boolean values.
     *
     * @param x the first boolean to compare
     * @param y the second boolean to compare
     *
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
     * @returns true if and only if the system property named by the argument exists and is equal to, ignoring case,
     * the string "true".
     *
     * @param name the name of the system property.
     */
    public static getBoolean(name: JavaString): boolean {
        const value = System.getProperty(name);

        return JavaBoolean.parseBoolean(value);
    }

    /**
     * @param value The value to hash.
     *
     * @returns a hash code for a boolean value; compatible with Boolean.hashCode().
     */
    public static hashCode(value: boolean): number {
        return value ? 1231 : 1237;
    }

    /**
     * @returns the result of applying the logical AND operator to the specified boolean operands.
     *
     * @param a The first operand.
     * @param b The second operand.
     */
    public static logicalAnd(a: boolean, b: boolean): boolean {
        return a && b;
    }

    /**
     * @returns the result of applying the logical OR operator to the specified boolean operands.
     *
     * @param a The first operand.
     * @param b The second operand.
     */
    public static logicalOr(a: boolean, b: boolean): boolean {
        return a || b;
    }

    /**
     * @returns the result of applying the logical XOR operator to the specified boolean operands.
     *
     * @param a The first operand.
     * @param b The second operand.
     */
    public static logicalXor(a: boolean, b: boolean): boolean {
        return a !== b;
    }

    /**
     * @returns the boolean represented by the string argument
     *
     * @param s the String containing the boolean representation to be parsed
     */
    public static parseBoolean(s: JavaString | null): boolean {
        if (s === null) {
            return false;
        }

        return s[Symbol.toPrimitive]("string").toLowerCase() === "true";
    }

    /**
     * Returns a String object representing the specified boolean.
     * If the specified boolean is true, then the string "true" is returned, otherwise the string "false" is returned.
     *
     * @param b The boolean to be converted.
     *
     * @returns a string representation of the specified boolean.
     */
    public static override toString(b: boolean): JavaString {
        return b ? new JavaString("true") : new JavaString("false");
    }

    /**
     * Returns a Boolean with a value represented by the specified string or boolean value.
     *
     * @param value tbd
     *
     * @returns tbd
     */
    public static override valueOf(value: boolean | JavaString | string): JavaBoolean {
        return new JavaBoolean(value);
    }

    /** @returns the value of this Boolean object as a boolean primitive. */
    public booleanValue(): boolean {
        return this.value;
    }

    /**
     * Compares this Boolean instance with another.
     *
     * @param b the object to compare with.
     *
     * @returns true if the Boolean objects represent the same value; false otherwise.
     */
    public compareTo(b: JavaBoolean): number {
        return JavaBoolean.compare(this.value, b.value);
    }

    /**
     * Returns true if and only if the argument is not null and is a Boolean object that represents the same boolean
     * value as this object.
     *
     * @param obj the object to compare with.
     *
     * @returns true if the Boolean objects represent the same value; false otherwise.
     */
    public override equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }

        if (obj instanceof JavaBoolean) {
            return this.value === obj.value;
        }

        if (typeof obj === "boolean") {
            return this.value === obj;
        }

        return false;
    }

    /** @returns a hash code for this Boolean object. */
    public override hashCode(): number {
        return JavaBoolean.hashCode(this.value);
    }

    /** @returns a string representing this Boolean's value. */
    public override toString(): JavaString {
        return this.value ? new JavaString("true") : new JavaString("false");
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

}
