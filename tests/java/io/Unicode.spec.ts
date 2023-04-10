/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { S } from "../../../src";
import { runTest } from "../../helpers";

describe("Unicode Tests", () => {
    xit("Base", async () => {
        // For now disabled, as we need a text encoder with more than just UTF-8.
        await runTest("tests/jdk/java/io/Unicode.ts", "main", [[S`utf-16le`, S`little`, S`false`]]);
    });

});
