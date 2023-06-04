/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ListDefaults } from "../../jdk/java/util/List/ListDefaults";
import { ListFactories } from "../../jdk/java/util/List/ListFactories";
import { LockStep } from "../../jdk/java/util/List/LockStep";
import { TestNG } from "../../org/testng/TestNG";

describe("List Tests", () => {
    describe("JDK ListDefaults", () => {
        const testNG = new TestNG();
        testNG.run(ListDefaults);
    });

    describe("JDK ListFactories", () => {
        const testNG = new TestNG();
        testNG.run(ListFactories);
    });

    describe("JDK LockStep", () => {
        const testNG = new TestNG();
        testNG.run(LockStep);
    });
});
