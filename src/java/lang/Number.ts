/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "./Object.js";

/**
 * The abstract class Number is the superclass of platform classes representing numeric values that are convertible
 * to the primitive types byte, double, float, int, long, and short.
 */
export abstract class JavaNumber extends JavaObject {
    /** @returns the value of the specified number as a byte. */
    public byteValue(): number {
        return this.intValue() & 0xFF;
    }

    /** @returns the value of the specified number as a short. */
    public shortValue(): number {
        return this.intValue() & 0xFFFF;
    }

    /** @returns the value of the specified number as a double. */
    public abstract doubleValue(): number;

    /** @returns the value of the specified number as a float. */
    public abstract floatValue(): number;

    /** @returns the value of the specified number as an int. */
    public abstract intValue(): number;

    /** @returns the value of the specified number as a long. */
    public abstract longValue(): bigint;
}
