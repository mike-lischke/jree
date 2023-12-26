/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { expect } from "@jest/globals";
import type { MatcherFunction } from "expect";
import { Arrays } from "../../../src/java/util/Arrays.js";
import { Objects } from "../../../src/java/util/Objects.js";
import { JavaObject } from "../../../src/java/lang/Object.js";

/**
 * This is a custom matcher for Jest to compare Java values.
 *
 * @param actual The received value to compare.
 * @param other The expected value to compare against.
 *
 * @returns A result object with a pass flag and a message.
 */
const javaValuesEqual: MatcherFunction<[other: unknown]> = function (actual, other) {
    let pass;
    if (Array.isArray(actual) && Array.isArray(other)) {
        pass = Arrays.equals(actual, other);
    } else {
        pass = Objects.equals(actual, other);
    }

    if (pass) {
        return {
            message: () => {
                return `expected ${this.utils.printReceived(`${actual}`)} not to equal ` +
                    `${this.utils.printExpected(`${other}`)}`;
            },
            pass: true,
        };
    } else {
        return {
            message: () => {
                return `expected ${this.utils.printReceived(`${actual}`)} to equal ` +
                    `${this.utils.printExpected(`${other}`)}`;
            },
            pass: false,
        };
    }
};

expect.extend({
    javaValuesEqual,
});

declare module "expect" {
    interface AsymmetricMatchers {
        javaValuesEqual(other: unknown): void;
    }
    interface Matchers<R> {
        javaValuesEqual(other: unknown): R;
    }
}

/**
 * Assertion tool class. Presents assertion methods with a more natural parameter order. The order is always
 * actualValue, expectedValue [, message].
 *
 * This is an emulation of the org.testng.Assert class, which acts as a thin wrapper around Jest.
 */
export class Assert extends JavaObject {
    public static assertEquals = (expected: unknown, actual: unknown): void => {
        expect(actual).javaValuesEqual(expected);
    };

    public static assertTrue = (condition: boolean, message?: string): void => {
        expect(condition).toBe(true);
        /*if (!condition) {
            this.fail(message);
        }*/
    };

    public static assertFalse = (condition: boolean, message?: string): void => {
        expect(condition).toBe(false);
        /*if (condition) {
            this.fail(message);
        }*/
    };

    public static assertNotEquals = (expected: unknown, actual: unknown): void => {
        expect(actual).not.javaValuesEqual(expected);
    };

    public static assertNull = (object: unknown, message?: string): void => {
        expect(object).toBeNull();

        /*if (object != null) {
            this.fail(message);
        }*/
    };

    public static assertNotNull = (object: unknown, message?: string): void => {
        expect(object).not.toBeNull();

        /*if (object == null) {
            this.fail(message);
        }*/
    };

    public static assertSame = (expected: unknown, actual: unknown): void => {
        expect(actual).toEqual(expected); // Object identity test.
    };

    public static assertNotSame = (expected: unknown, actual: unknown): void => {
        expect(actual).not.toEqual(expected);
    };

    public static fail = (message?: string): void => {
        throw new Error(message ?? "Assertion failed");
    };
}
