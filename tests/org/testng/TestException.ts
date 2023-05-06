/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";

export class TestException extends java.lang.RuntimeException {
    public constructor(exception: java.lang.Throwable) {
        super(exception);
    }
}
