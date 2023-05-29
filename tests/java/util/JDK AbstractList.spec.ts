/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CheckForComodification } from "../../jdk/java/util/AbstractList/CheckForComodification";
import { FailFastIterator } from "../../jdk/java/util/AbstractList/FailFastIterator";
import { HasNextAfterException } from "../../jdk/java/util/AbstractList/HasNextAfterException";

describe("AbstractList", () => {
    it("CheckForComodification", () => {
        CheckForComodification.main([]);
    });

    it("FailFastIterator", () => {
        FailFastIterator.main([]);
    });

    it("HasNextAfterException", () => {
        HasNextAfterException.main([]);
    });
});
