/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "./Object";

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
