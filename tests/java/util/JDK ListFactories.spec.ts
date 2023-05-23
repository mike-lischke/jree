/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ListFactories } from "../../jdk/java/util/List/ListFactories";
import { TestNG } from "../../org/testng/TestNG";

describe("ListFactories", () => {
    const testNG = new TestNG();
    testNG.run(ListFactories);
});
