/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { ListDefaults } from "../../jdk/java/util/List/ListDefaults";
import { TestNG } from "../../org/testng/TestNG";

describe("ListDefaults", () => {
    const testNG = new TestNG();
    testNG.run(ListDefaults);
});
