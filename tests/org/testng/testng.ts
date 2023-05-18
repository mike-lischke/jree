/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";

/** This class is the main entry point for running tests in the TestNG framework. */
export class TestNG extends java.lang.Object {
    public run(): void {
        console.log("Running testng tests...");
    }
}
