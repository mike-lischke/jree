/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

export interface IEquatable {
    equals(other: unknown): boolean;
    hashCode(): number;
}

export interface IComparable<T> {
    compareTo(o: T): number;
}
