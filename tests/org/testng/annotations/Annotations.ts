/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { DecoratorTargetFunction } from "../../../../src/decorators.js";
import { Throwable } from "../../../../src/java/lang/Throwable.js";
import { Arrays } from "../../../../src/java/util/Arrays.js";
import { JavaIterator } from "../../../../src/java/util/Iterator.js";

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

/**
 * Parameters for the @test decorator.
 */
export interface ITestParameters {
    /** The name of the test. Used for result output, if given and no description is specified. */
    testName?: string;

    /** A description for the test. */
    description?: string;

    /** The name of a static method in the same class, which generates test data for the decorated method. */
    dataProvider?: string;

    /** The type of expected exceptions in the decorated method. */
    expectedExceptions?: Array<typeof Throwable>;

    /** Whether methods on this class/method are enabled. */
    enabled?: boolean;

    /** The maximum number of milliseconds this test should take. */
    timeout?: number;
}

export interface IDataProviderParameters {
    /** The name of the data provider. If not given then the decorated method name is used instead.*/
    name?: string;

    /** Not used. */
    parallel?: boolean;
}

/**
 * Executes the given target method and handles expected exceptions.
 *
 * @param target The target method.
 * @param expectedExceptions If given then the method is expected to throw an exception of one of the given types.
 * @param args The arguments for the target method.
 */
function executeTarget(this: unknown, target: Function, expectedExceptions?: Array<typeof Throwable>,
    ...args: unknown[]) {
    try {
        target.call(this, ...args);

        if (expectedExceptions) {
            throw new Error(`Expected exception of type ${expectedExceptions} ` +
                `but no exception was thrown.`);
        }
    } catch (e) {
        for (const expected of expectedExceptions ?? []) {
            if (e instanceof expected) {
                return;
            }
        }
        throw e;
    }

}

export function DataProvider<This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>
): DecoratorTargetFunction<This, Args, Return>;
export function DataProvider(param: IDataProviderParameters): Function;
/**
 * Mark a method as supplying data for a test method.
 *
 * This decorator mimics the base functionality of the TestNG DataProvider annotation, but doesn't really do
 * anything. It only exists to allow taking over the Java annotation.
 *
 * @param args Either a single parameter object or the target method and the context of the decorator.
 *
 * @returns The original method.
 */
export function DataProvider<This, Args extends unknown[], Return>(
    ...args: unknown[]): Function | DecoratorTargetFunction<This, Args, Return> {
    if (args.length === 1) {
        // Only one argument given => handled as decorator factory.
        const [param] = args as [IDataProviderParameters];

        return <This, Args extends unknown[], Return>(
            target: DecoratorTargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>) => {

            if (param.name) {
                // If a name is given for the data provider then change the name of the method to that name.
                // Note: this will not change the name in the property descriptor of the class. It only changes the
                //       name of the method itself.
                Object.defineProperty(target, "name", { value: param.name });
            }
            Object.defineProperty(target, "isDataProvider", { value: true });

            return target;
        };
    } else {
        // Multiple arguments given. This makes this function to a decorator.
        const [target, _context] = args as [DecoratorTargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>];
        Object.defineProperty(target, "isDataProvider", { value: true });

        return target;
    }
}

/**
 * Decorator function for the Test annotation.
 *
 * @param target The target method.
 * @param context The context of the decorator.
 *
 * @returns a method decorator.
 */
export function Test<This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>
): DecoratorTargetFunction<This, Args, Return>;
export function Test<T extends ITestParameters>(param: T): Function;
/**
 * Decorator factory for the Test annotation. It creates a method decorator that applies the parameters given to the
 * factory.
 *
 * @param args A single parameter object with details for the decorated method.
 *
 * @returns A decorator factory method.
 */
export function Test<T extends ITestParameters, This, Args extends unknown[], Return>(
    ...args: unknown[]): Function | DecoratorTargetFunction<This, Args, Return> {

    if (args.length === 1) {
        // Only one argument given. This makes this function to a decorator factory.
        const param = args[0] as T;

        return <This, Args extends unknown[], Return>(target: DecoratorTargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>) => {
            const result = function (this: This & {
                [key: string]: unknown;
                constructor: { [key: string]: Function; };
            }, ...args: Args): Return {
                const title = param.description ?? param.testName ?? target.name;
                if (param.enabled === false) { // Can be undefined which defaults to true.
                    xit(title, () => {
                        // Skip this test.
                    });
                } else {
                    if (param.dataProvider) {
                        // If a data provider is given assume it's a static method on the class and call it to get
                        // the new arguments.
                        let provider: Function | undefined;

                        // Provider methods can be renamed by the DataProvider decorator. Therefore enumerate all
                        // properties of the class and look for the provider method.
                        Object.getOwnPropertyNames(this.constructor).forEach((name) => {
                            if (this.constructor[name].name === param.dataProvider) {
                                provider = this.constructor[name];
                            }
                        });

                        if (!provider) {
                            // If there's no static method with the provider name try to find a method with the
                            // provider name on the prototype.
                            Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach((name) => {
                                if (typeof this[name] === "function" && name === param.dataProvider) {
                                    provider = this[name] as Function;
                                }
                            });
                        }

                        if (!provider) {
                            throw new Error(`Data provider "${param.dataProvider}" not found.`);
                        }

                        if (typeof provider !== "function") {
                            throw new Error(`Data provider "${param.dataProvider}" is not a function.`);
                        }

                        if (!("isDataProvider" in provider)) {
                            throw new Error(`The method "${param.dataProvider}" is not a data provider. ` +
                                `Use the @DataProvider decorator to mark it as data provider.`);
                        }

                        // Call the provider method to get a list of test cases.
                        const list = provider.call(this);
                        let cases: JavaIterator<unknown[]>;
                        if ("iterator" in list && typeof list.iterator === "function") {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                            cases = list.iterator();
                        } else if (Array.isArray(list)) {
                            cases = Arrays.asList(list).iterator();
                        } else {
                            cases = list;
                        }

                        let index = 0;
                        while (cases.hasNext()) {
                            const testArgs = cases.next() as Args;
                            it(`Data Set ${index++}`, () => {
                                executeTarget.call(this, target, param?.expectedExceptions, ...testArgs);
                            }, param.timeout);
                        }

                        return void 0 as Return;
                    } else {
                        it(title, () => {
                            executeTarget.call(this, target, param?.expectedExceptions, args);
                        }, param.timeout);
                    }
                }

                return void 0 as Return;
            };

            Object.defineProperty(result, "isTest", { value: true });
            if (param.description) {
                Object.defineProperty(result, "description", { value: param.description });
            }

            return result;
        };
    } else {
        // Multiple arguments given, that is, the decorator has no parameters.
        const [target, _context] = args as [DecoratorTargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>];

        const result = function (this: This, ...args: Args): Return {
            it(target.name, () => {
                target.call(this, ...args);
            });

            return void 0 as Return;
        };
        Object.defineProperty(result, "isTest", { value: true });

        return result;
    }
}
