/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { LockStep } from "../../jdk/java/util/List/LockStep";
import { TestNG } from "../../org/testng/TestNG";

describe("LockStep", () => {
    const testNG = new TestNG();
    testNG.run(LockStep);
});
