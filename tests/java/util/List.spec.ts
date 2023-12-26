/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ListDefaults } from "../../jdk/java/util/List/ListDefaults.js";
import { ListFactories } from "../../jdk/java/util/List/ListFactories.js";
import { LockStep } from "../../jdk/java/util/List/LockStep.js";
import { TestNG } from "../../org/testng/TestNG.js";

describe("List Tests", () => {
    describe("JDK ListDefaults", () => {
        const testNG = new TestNG();
        testNG.run(ListDefaults);
    });

    describe.only("JDK ListFactories", () => {
        const testNG = new TestNG();
        testNG.run(ListFactories);
    });

    describe("JDK LockStep", () => {
        const testNG = new TestNG();
        testNG.run(LockStep);
    });
});
