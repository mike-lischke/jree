/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { System } from "../../../src/java/lang/System.js";
import { BigMark } from "../../jdk/java/io/BufferedReader/BigMark.js";
import { EOL } from "../../jdk/java/io/BufferedReader/EOL.js";
import { Fill } from "../../jdk/java/io/BufferedReader/Fill.js";
import { MarkedFillAtEOF } from "../../jdk/java/io/BufferedReader/MarkedFillAtEOF.js";
import { ReadLine } from "../../jdk/java/io/BufferedReader/ReadLine.js";
import { Ready } from "../../jdk/java/io/BufferedReader/Ready.js";

describe("Buffered Reader Tests", () => {
    System.setProperty("test.src", "tests/jdk/java/io/BufferedReader/");

    it("BigMark", () => {
        BigMark.main([]);
    });

    it("EOL", () => {
        EOL.main([]);
    });

    it("Fill", () => {
        Fill.main([]);
    });

    it("MarkedFillAtEOF", () => {
        MarkedFillAtEOF.main();
    });

    it("ReadLine", () => {
        ReadLine.main([]);
    });

    it("Ready", () => {
        Ready.main([]);
    });

});
