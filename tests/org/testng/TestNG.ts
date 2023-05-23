/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";
import { TestException } from "./TestException";

export type TestClass<T> = (new () => T);
export type TestFunction = Function & { isTest: boolean; };

/** This class is the main entry point for running tests in the TestNG framework. */
export class TestNG extends java.lang.Object {
    public run<T>(testClass: TestClass<T>): void {
        // Get all properties of the given class.
        const descriptors = Object.getOwnPropertyDescriptors(testClass.prototype);

        // Check if there is a static main method. If so, call it to start the tests.
        if ("constructor" in descriptors && "value" in descriptors.constructor) {
            const constructor = descriptors.constructor.value as Function;
            if ("main" in constructor) {
                const main = constructor.main as Function;
                main();

                return;
            }
        }

        const testMethods = Object.entries(descriptors).filter(([entry, descriptor]) => {
            return descriptor.value?.isTest;
        });

        const instance = new testClass();
        testMethods.forEach(([entry, descriptor]) => {
            describe(descriptor.value?.description as string ?? entry, () => {
                try {
                    const method = descriptor.value as TestFunction;
                    if (method.isTest) {
                        method.call(instance);
                    }
                } catch (error) {
                    if (error instanceof TestException) {
                        // Unfold the test exception to get to the real cause.
                        const cause = error.getCause();
                        if (cause) {
                            throw cause;
                        }

                        throw error;
                    } else {
                        throw error;
                    }
                }
            });
        });
    }
}
