/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

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
