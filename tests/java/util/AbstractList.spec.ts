/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CheckForComodification } from "../../jdk/java/util/AbstractList/CheckForComodification";
import { FailFastIterator } from "../../jdk/java/util/AbstractList/FailFastIterator";
import { HasNextAfterException } from "../../jdk/java/util/AbstractList/HasNextAfterException";

describe("AbstractList Tests", () => {
    it("JDK CheckForComodification", () => {
        CheckForComodification.main([]);
    });

    it("JDK FailFastIterator", () => {
        FailFastIterator.main([]);
    });

    it("JDK HasNextAfterException", () => {
        HasNextAfterException.main([]);
    });
});