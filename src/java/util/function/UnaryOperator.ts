/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaFunction } from "./Function.js";

/**
 * Represents an operation on a single operand that produces a result of the same type as its operand. This is a
 * specialization of {@link JavaFunction} for the case where the operand and result are of the same type.
 */
export interface UnaryOperator<T> extends JavaFunction<T, T> {
    /* apply*/(t: T): T;
}

export class UnaryOperator<T> extends JavaFunction<T, T> {
    /**
     * @returns a {@code Unary} that always returns its input argument
     */
    public static identity<T>(): UnaryOperator<T> {
        return (t: T) => { return t; };
    }

}
