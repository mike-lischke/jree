/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../../../src";
import { BigMark } from "../../jdk/java/io/BufferedReader/BigMark";
import { EOL } from "../../jdk/java/io/BufferedReader/EOL";
import { Fill } from "../../jdk/java/io/BufferedReader/Fill";
import { MarkedFillAtEOF } from "../../jdk/java/io/BufferedReader/MarkedFillAtEOF";
import { ReadLine } from "../../jdk/java/io/BufferedReader/ReadLine";
import { Ready } from "../../jdk/java/io/BufferedReader/Ready";

describe("Buffered Reader Tests", () => {
    java.lang.System.setProperty("test.src", "tests/jdk/java/io/BufferedReader/");

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
