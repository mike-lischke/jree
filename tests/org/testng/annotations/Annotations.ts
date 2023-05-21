/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { java } from "../../../../src";

type TargetFunction<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

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

    /** The type of an expected exception in the decorated method. */
    expectedExceptions?: typeof java.lang.Throwable;

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

export function DataProvider<This, Args extends unknown[], Return>(
    target: TargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>): TargetFunction<This, Args, Return>;
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
    ...args: unknown[]): Function | TargetFunction<This, Args, Return> {
    if (args.length === 1) {
        // Only one argument given => handled as decorator factory.
        const [param] = args as [IDataProviderParameters];

        return <This, Args extends unknown[], Return>(
            target: TargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>) => {

            if (param.name) {
                // If a name is given for the data provider then change the name of the method to that name.
                // Note: this will not change the name in the property descriptor of the class. It only changes the
                //       name of the method itself.
                Object.defineProperty(target, "name", { value: param.name });
            }

            return target;
        };
    } else {
        // Multiple arguments given. This makes this function to a decorator.
        const [target, _context] = args as [TargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>];

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
    target: TargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>): TargetFunction<This, Args, Return>;
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
    ...args: unknown[]): Function | TargetFunction<This, Args, Return> {
    if (args.length === 1) {
        // Only one argument given. This makes this function to a decorator factory.
        const param = args[0] as T;

        return <This, Args extends unknown[], Return>(target: TargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>) => {
            const result = function (this: This & { constructor: { [key: string]: Function; }; },
                ...args: Args): Return {
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
                            throw new Error(`Data provider "${param.dataProvider}" not found. The provider method ` +
                                `must be static.`);
                        }

                        if (typeof provider !== "function") {
                            throw new Error(`Data provider "${param.dataProvider}" is not a function.`);
                        }

                        // Call the provider method to get a list of test cases.
                        const cases = provider() as unknown[][];
                        cases?.forEach((testArgs, index: number) => {
                            it(`Data Set ${index}`, () => {
                                try {
                                    target.call(this, ...testArgs) as Return;
                                } catch (e) {
                                    if (param.expectedExceptions && e instanceof param.expectedExceptions) {
                                        return;
                                    }

                                    throw e;
                                }
                            }, param.timeout);
                        });

                        return void 0 as Return;
                    } else {
                        it(title, () => {
                            target.call(this, ...args);
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
        const [target, _context] = args as [TargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>];

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
