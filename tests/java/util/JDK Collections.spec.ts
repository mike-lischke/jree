/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ListDefaults } from "../../jdk/java/util/List/ListDefaults";
import { ListFactories } from "../../jdk/java/util/List/ListFactories";
import { TestNG } from "../../org/testng/TestNG";

/** Executes the ListDefault JDK tests. */
describe("Run JDK Collections Tests", () => {
    const testNG = new TestNG();

    describe("ListDefaults", () => {
        testNG.run(ListDefaults);
    });

    describe("ListFactories", () => {
        testNG.run(ListFactories);
    });
});
