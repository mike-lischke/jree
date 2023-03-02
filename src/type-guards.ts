/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IEquatable } from "./types";

/**
 * Type guard to check if a value supports the IEquatable interface.
 *
 * @param candidate The value to check.
 *
 * @returns The guard result.
 */
export const isEquatable = (candidate: unknown): candidate is IEquatable => {
    return (candidate as IEquatable).equals !== undefined && (candidate as IEquatable).hashCode !== undefined;
};

/**
 * Type guard to check if a value has a length property.
 *
 * @param candidate The value to check.
 *
 * @returns The guard result.
 */
export const isArrayLike = <T>(candidate: unknown): candidate is ArrayLike<T> => {
    return (candidate as ArrayLike<T>).length !== undefined;
};
