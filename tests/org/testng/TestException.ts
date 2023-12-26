/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeException } from "../../../src/java/lang/RuntimeException.js";
import { Throwable } from "../../../src/java/lang/Throwable.js";

/**
 * Exception thrown when an exception happens while running a test method.
 *
 * This is an implementation of the org.testng.TestException class.
 */
export class TestException extends RuntimeException {
    public constructor(exception: Throwable) {
        super(exception);
    }
}
