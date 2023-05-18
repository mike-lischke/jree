/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../../types";

/**
 * This is a functional interface and can therefore be used as the assignment target for a lambda expression or
 * method reference.
 */
export interface IntBinaryOperator {
    /**
     * Applies this operator to the given operands.
     *
     * @param left the first operand
     * @param right the second operand
     *
     * @returns the operator result
     */
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    /* applyAsInt */(left: int, right: int): int;
}
