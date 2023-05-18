/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";

/**
 * Exception thrown when an exception happens while running a test method.
 *
 * This is an implementation of the org.testng.TestException class.
 */
export class TestException extends java.lang.RuntimeException {
    public constructor(exception: java.lang.Throwable) {
        super(exception);
    }
}
