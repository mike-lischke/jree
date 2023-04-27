/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AddAll } from "../../jdk/java/util/ArrayList/AddAll";
import { Bug8146568 } from "../../jdk/java/util/ArrayList/Bug8146568";
import { EnsureCapacity } from "../../jdk/java/util/ArrayList/EnsureCapacity";

describe("ArrayList Tests", () => {

    it("AddAll", () => {
        // There are no checks in this test, just a couple of value additions to array lists.
        // They are all expected to succeed.
        expect(() => { AddAll.main([]); }).not.toThrow();
    });

    // Cannot catch an OutOfMemoryError in JS.
    xit("Bug8146568", () => {
        expect(() => { Bug8146568.main(); }).not.toThrow();
    });

    it("EnsureCapacity", () => {
        EnsureCapacity.main([]);
    });
});
