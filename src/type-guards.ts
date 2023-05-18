/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
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

const handler = { construct: () => { return handler; } };

/**
 * Determines if a value is a constructor. It uses a multi step approach to determine the result, which avoids
 * that the constructor is actually called. This way side effects are avoided.
 *
 * @param value The value to check. Usually a function.
 *
 * @returns True if the value is a constructor, false otherwise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const isConstructor = (value: any): value is new (...args: unknown[]) => unknown => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return !!(new (new Proxy(value, handler))());
    } catch (e) {
        return false;
    }
};
