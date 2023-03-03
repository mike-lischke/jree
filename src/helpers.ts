/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { AutoCloseable } from "./java/lang/AutoCloseable";
import { Throwable } from "./java/lang/Throwable";

// The 3 following functions comprise the emulation of the try-with-resource Java statement.
// They are used in different places of the generated double-try block.

/**
 * Takes care to close auto-closeable resources and returns a Throwable if anything went wrong.
 * The function does not throw any error. If more than one error occurred then all of them are added as
 * suppressed errors to the first one.
 *
 * @param list The list of resources to close.
 *
 * @returns A Throwable if an error occurred while closing the objects.
 */
export const closeResources = (list: AutoCloseable[]): Throwable | undefined => {
    let error: Throwable | undefined;

    // Close in reverse order.
    for (const closeable of list.reverse()) {
        try {
            closeable.close();
        } catch (x) {
            const t = Throwable.fromError(x);
            if (!error) {
                error = t;
            } else {
                error.addSuppressed(t);
            }
        }
    }

    return error;
};

/**
 * Second part of the try-with-resource handling. It's called in the catch block of the outer try block to combine
 * any errors reported from the first part (the auto closing) and the error from the block execution.
 *
 * @param e The error thrown from code in the inner try block.
 * @param error The error produced while closing the resources. If it exist it's added to the suppressed list of the
 *              new throwable generated by this function.
 *
 * @returns A new Throwable instance created from the given resource error.
 */
export const handleResourceError = (e: unknown, error?: Throwable): Throwable => {
    const t = Throwable.fromError(e);
    if (error) {
        t.addSuppressed(error);
    }

    return t;
};

/**
 * Last part of the try-with-resource handling. If an error is actually given, then it will be thrown.
 *
 * @param error A possible error.
 *
 * @throws The given error if it's not undefined.
 */
export const throwResourceError = (error?: Throwable): void | never => {
    if (error) {
        throw error;
    }
};
