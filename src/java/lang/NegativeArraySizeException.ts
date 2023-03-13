/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { RuntimeException } from "./RuntimeException";
import { JavaString } from "./String";

export class NegativeArraySizeException extends RuntimeException {
    public constructor(message?: JavaString) {
        super(message ?? new JavaString("A negative array size is invalid."));
    }
}
