/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export type char = number;   // UTF-16 code unit, default `\u0000`
export type byte = number;   // 8-bit signed integer, default 0
export type short = number;  // 16-bit signed integer, default 0
export type int = number;    // 32-bit signed integer, default 0
export type long = bigint;   // 64-bit signed integer, default 0n
export type float = number;  // 32-bit IEEE 754 floating point, default 0.0
export type double = number; // 64-bit IEEE 754 floating point, default 0.0

/* eslint-enable @typescript-eslint/naming-convention */

/**
 * This interface defines the required methods for object equality.
 * It's the same structure used by the immutable.js library (ValueObject).
 */
export interface IEquatable {
    equals(other: unknown): boolean;
    hashCode(): number;
}

export interface IComparable<T> {
    compareTo(o: T): number;
}
