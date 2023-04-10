/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Comparison } from "../../jdk/java/lang/CharSequence/Comparison";

describe("java.lang.CharSequence Tests", () => {
    it("Compare with string", () => {
        const c = new Comparison();
        c.compareWithString();
    });

    it("Test compare", () => {
        const c = new Comparison();
        c.testCompare();
    });
});
