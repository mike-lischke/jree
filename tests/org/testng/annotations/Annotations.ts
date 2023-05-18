/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { java } from "../../../../src";

type TargetFunction<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

/**
 * Test parameters for the Test annotation.
 */
export interface ITestParameters {
    /** The name of the test. */
    testName?: string;

    /** The name of a static method in the same class, which generates test data for the decorated method. */
    dataProvider?: string;

    /** The type of an expected exception in the decorated method. */
    expectedExceptions?: typeof java.lang.Throwable;
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
        // Only one argument given. This makes this function to a decorator factory.
        const [_param] = args as [IDataProviderParameters];

        return <This, Args extends unknown[], Return>(
            target: TargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>) => {
            return target;
        };
    } else {
        // Multiple arguments given. This makes this function to a decorator.
        const [target, _context] = args as [TargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>];

        return target;
    }
}

export function Test<This, Args extends unknown[], Return>(
    target: TargetFunction<This, Args, Return>,
    context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>): TargetFunction<This, Args, Return>;
export function Test<T extends ITestParameters>(param: T): Function;
/**
 * Decorator factory for the Test annotation. It creates a method decorator that applies the parameters given to the
 * factory.
 *
 * @param args Either a single parameter object or the target method and the context of the decorator.
 *
 * @returns Either a method decorator (when acting as factory) or the original method (when acting as decorator).
 */
export function Test<T extends ITestParameters, This, Args extends unknown[], Return>(
    ...args: unknown[]): Function | TargetFunction<This, Args, Return> {
    if (args.length === 1) {
        // Only one argument given. This makes this function to a decorator factory.
        const param = args[0] as T;

        return <This, Args extends unknown[], Return>(target: TargetFunction<This, Args, Return>,
            context: ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>) => {
            return function (this: This & { constructor: { [key: string]: Function; }; }, ...args: Args): Return {
                if (param.dataProvider) {
                    // If a data provider is given assume it's a static method on the class and call it to get the new
                    // arguments.
                    const newArgs = this.constructor[param.dataProvider]()[0] as Args;

                    try {
                        return target.call(this, ...newArgs) as Return;
                    } catch (e) {
                        if (param.expectedExceptions && e instanceof param.expectedExceptions) {
                            return void 0 as Return;
                        }

                        throw e;
                    }
                }

                return target.call(this, ...args) as Return;
            };
        };
    } else {
        // Multiple arguments given. This makes this function to a decorator.
        const [target, _context] = args as [TargetFunction<This, Args, Return>,
            ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>];

        return target;
    }
}
