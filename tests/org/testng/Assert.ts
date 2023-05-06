/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";

/**
 * This is an emulation of the Java TestNG Assert class, which acts as a thin wrapper around Jest.
 */
export class Assert extends java.lang.Object {
    public static assertEquals = (expected: unknown, actual: unknown): void => {
        if (expected === actual) {
            return;
        }

        if (expected == null || actual == null) {
            fail();
        }

        if (expected instanceof java.lang.Object && actual instanceof java.lang.Object) {
            if (expected.equals(actual)) {
                return;
            }
        }

        fail("Expected: " + expected + " but was: " + actual);
    };

    public static assertTrue = (condition: boolean, message?: string): void => {
        if (!condition) {
            fail(message);
        }
    };

    public static fail = (message?: string): void => {
        this.fail(message);
    };
}
