/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IndexOutOfBoundsException } from "./IndexOutOfBoundsException";
import { JavaString } from "./String";

/**
 * Thrown to indicate that an array has been accessed with an illegal index. The index is either negative or greater
 * than or equal to the size of the array.
 */
export class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException {
    public constructor();
    public constructor(index: number);
    public constructor(message: JavaString);
    public constructor(...args: unknown[]) {
        if (args.length === 0) {
            super();

            return;
        }

        if (args[0] instanceof JavaString) {
            super(args[0]);
        } else {
            super(new JavaString(`Array index out of range: ${args[0]}`));
        }
    }
}
