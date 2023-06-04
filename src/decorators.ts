/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */

/** A definition of the target function for a function decorator. */
export type DecoratorTargetFunction<This, Args extends unknown[], Return> = (this: This, ...args: Args) => Return;

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/** Marks a method as overriding an inherited method. */
export function Override<This, Args extends unknown[], Return>(
    target: DecoratorTargetFunction<This, Args, Return>,
    _context: ClassMethodDecoratorContext<This, DecoratorTargetFunction<This, Args, Return>>,
): DecoratorTargetFunction<This, Args, Return> {
    return target;
}
