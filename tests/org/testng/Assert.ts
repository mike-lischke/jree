/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";

/**
 * Assertion tool class. Presents assertion methods with a more natural parameter order. The order is always
 * actualValue, expectedValue [, message].
 *
 * This is an emulation of the org.testng.Assert class, which acts as a thin wrapper around Jest.
 */
export class Assert extends java.lang.Object {
    public static assertEquals = (expected: unknown, actual: unknown): void => {
        if (!java.util.Objects.equals(expected, actual)) {
            fail("Expected: " + expected + " but was: " + actual);
        }
    };

    public static assertTrue = (condition: boolean, message?: string): void => {
        if (!condition) {
            fail(message);
        }
    };

    public static assertFalse = (condition: boolean, message?: string): void => {
        if (condition) {
            fail(message);
        }
    };

    public static assertNotEquals = (expected: unknown, actual: unknown): void => {
        if (java.util.Objects.equals(expected, actual)) {
            fail("Expected: " + expected + " but was: " + actual);
        }
    };

    public static assertNull = (object: unknown, message?: string): void => {
        if (object != null) {
            fail(message);
        }
    };

    public static assertNotNull = (object: unknown, message?: string): void => {
        if (object == null) {
            fail(message);
        }
    };

    public static assertSame = (expected: unknown, actual: unknown): void => {
        if (!java.util.Objects.equals(expected, actual)) {
            fail("Expected: " + expected + " but was: " + actual);
        }
    };

    public static assertNotSame = (expected: unknown, actual: unknown): void => {
        if (java.util.Objects.equals(expected, actual)) {
            fail("Expected: " + expected + " but was: " + actual);
        }
    };

    public static fail = (message?: string): void => {
        fail(message); // Jest fail function.
    };
}
