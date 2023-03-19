/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { runTest } from "../../helpers";

export { };

describe("Tests", () => {
    it("Base", async () => {
        await runTest("test/jdk/java/lang/Appendable/Basic.ts", "main");
    });
});
