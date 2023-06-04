/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/**
 * Marks the given objects being read-only by setting the (non-enumerable) "readOnly" property to true.
 *
 * @param obj The object to mark as read-only.
 *
 * @returns The given object.
 */
export const makeReadOnly = <T>(obj: T): T => {
    Object.defineProperty(obj, "readOnly", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false,
    });

    return obj;
};
