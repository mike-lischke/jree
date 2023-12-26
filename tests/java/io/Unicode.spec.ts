/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { S } from "../../../src/templates.js";
import { Unicode } from "../../jdk/java/io/Unicode.js";

describe("Unicode Tests", () => {
    xit("Base", () => {
        // For now disabled, as we need a text encoder with more than just UTF-8.
        Unicode.main([S`utf-16le`, S`little`, S`false`]);
    });

});
