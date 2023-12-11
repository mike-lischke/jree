/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeException } from "./RuntimeException.js";
import { JavaString } from "./String.js";

export class NegativeArraySizeException extends RuntimeException {
    public constructor(message?: JavaString) {
        super(message ?? new JavaString("A negative array size is invalid."));
    }
}
