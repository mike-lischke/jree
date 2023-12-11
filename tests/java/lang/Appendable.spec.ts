/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { runTest } from "../../test-helpers.js";

describe("Tests", () => {
    it("Basic", async () => {
        await runTest("tests/jdk/java/lang/Appendable/Basic.ts", "main");
    });
});
