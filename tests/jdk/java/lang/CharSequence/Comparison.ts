/*
 * Copyright (c) 2018, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */

import { CharSequence } from "../../../../../src/java/lang/CharSequence.js";
import { Comparable } from "../../../../../src/java/lang/Comparable.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { StringBuffer } from "../../../../../src/java/lang/StringBuffer.js";
import { StringBuilder } from "../../../../../src/java/lang/StringBuilder.js";
import { HashSet } from "../../../../../src/java/util/HashSet.js";
import { JavaSet } from "../../../../../src/java/util/Set.js";
import { S } from "../../../../../src/templates.js";
import { int } from "../../../../../src/types.js";

/**
 * @test
 * @bug 8137326
 * @summary Test to verify the compare method for the CharSequence class.
 * @run testng Comparison
 */
export class Comparison extends JavaObject {
    protected static SEP = ":";

    protected static books = [
        ["Biography", "Steve Jobs"],
        ["Biography", "Elon Musk: Tesla, SpaceX, and the Quest for a Fantastic Future"],
        ["Law", "Law 101: Everything You Need to Know About American Law, Fourth Edition"],
        ["Law", "The Tools of Argument: How the Best Lawyers Think, Argue, and Win"],
        ["History", "The History Book (Big Ideas Simply Explained)"],
        ["History", "A People's History of the United States"],
    ];

    private static generateTestBuilder = (from1: int, to1: int,
        from2: int, to2: int): StringBuilder => {
        const aBuffer = new StringBuilder(50);

        for (let i = from1; i < to1; i++) {
            aBuffer.append(i);
        }
        for (let i = from2; i < to2; i++) {
            aBuffer.append(i);
        }

        return aBuffer;
    };

    private static generateTestBuffer = (from1: int, to1: int,
        from2: int, to2: int): StringBuffer => {
        const aBuffer = new StringBuffer(50);

        for (let i = from1; i < to1; i++) {
            aBuffer.append(i);
        }
        for (let i = from2; i < to2; i++) {
            aBuffer.append(i);
        }

        return aBuffer;
    };

    /**
     * Verifies the compare method by comparing StringBuilder objects with String
     * objects.
     */
    public compareWithString = (): void => {
        const sbSet = this.constructSBSet();
        const sSet = this.constructStringSet();
        const iSB = sbSet.iterator();
        const iS = sSet.iterator();
        while (iSB.hasNext()) {
            const result = CharSequence.compare(iSB.next(), iS.next());
            expect(result).toBe(0);
        }
    };

    /**
     * Verify comparison between two CharSequence implementations, including String,
     * StringBuffer and StringBuilder.
     *
     * Note: CharBuffer states that "A char buffer is not comparable to any other type of object."
     */
    public testCompare = (): void => {
        const sb1 = Comparison.generateTestBuilder(65, 70, 97, 102);
        const sb2 = Comparison.generateTestBuilder(65, 70, 97, 102);
        const sb3 = Comparison.generateTestBuilder(65, 71, 97, 103);

        expect(CharSequence.compare(sb1, sb2)).toBe(0);
        expect(CharSequence.compare(sb1, sb3)).not.toBe(0);

        expect(CharSequence.compare(sb1, sb2.toString())).toBe(0);
        expect(CharSequence.compare(sb1, sb3.toString())).not.toBe(0);

        const buf1 = Comparison.generateTestBuffer(65, 70, 97, 102);
        const buf2 = Comparison.generateTestBuffer(65, 70, 97, 102);
        const buf3 = Comparison.generateTestBuffer(65, 71, 97, 103);

        expect(CharSequence.compare(buf1, buf2)).toBe(0);
        expect(CharSequence.compare(buf1, buf3)).not.toBe(0);

        expect(CharSequence.compare(sb1, buf2)).toBe(0);
        expect(CharSequence.compare(sb1, buf3)).not.toBe(0);

        const cs1 = buf1 as CharSequence;
        //const cs2 = sb1 as CharSequence;

        const result = (cs1 as unknown as Comparable<JavaObject>).compareTo(buf2);
        expect(result).toBe(0);
    };

    private constructStringSet = (): JavaSet<JavaString> => {
        const sSet = new HashSet<JavaString>();
        for (const book of Comparison.books) {
            sSet.add(S`${book[0]}${Comparison.SEP}${book[1]}`);
        }

        return sSet;
    };

    private constructSBSet = (): JavaSet<StringBuilder> => {
        const sbSet = new HashSet<StringBuilder>();
        for (const book of Comparison.books) {
            sbSet.add(new StringBuilder(book[0]).append(Comparison.SEP).append(book[1]));
        }

        return sbSet;
    };
}
