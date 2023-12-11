/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../../types.js";

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface IntUnaryOperator {
    /**
     * Applies this operator to the given operand.
     *
     * @param operand the operand
     *
     * @returns the operator result
     */
    /* applyAsInt*/(operand: int): int;

    andThen?: (after: IntUnaryOperator) => IntUnaryOperator;
    compose?: (before: IntUnaryOperator) => IntUnaryOperator;
}

export class IntUnaryOperator implements IntUnaryOperator {
    /**
     * @returns a unary operator that always returns its input argument.
     */
    public static identity(): IntUnaryOperator {
        return (operand: int): int => {
            return operand;
        };
    }

    /**
     * @param after the operator to apply after this operator is applied
     *
     * @returns a composed operator that first applies this operator to its input, and then applies the after operator
     * to the result.
     */
    public andThen? = (after: IntUnaryOperator): IntUnaryOperator => {
        return (operand: int): int => {
            return after(this(operand));
        };
    };

    /**
     * @param before the operator to apply before this operator is applied
     *
     * @returns a composed operator that first applies the before operator to its input, and then applies this operator
     * to the result.
     */
    public compose? = (before: IntUnaryOperator): IntUnaryOperator => {
        return (operand: int): int => {
            return this(before(operand));
        };
    };

}
