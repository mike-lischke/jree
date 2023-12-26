/* java2ts: keep */

/*
 * Copyright (c) 1997, Oracle and/or its affiliates. All rights reserved.
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

import { BufferedReader } from "../../../../../src/java/io/BufferedReader.js";
import { StringReader } from "../../../../../src/java/io/StringReader.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { JavaString } from "../../../../../src/java/lang/String.js";

/* @test
   @bug 4072575
   @summary Test all the EOL delimiters accepted by BufferedReader
*/

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */

export class EOL extends JavaObject {

    public static main = (args: JavaString[]): void => {
        const sr = new StringReader(new JavaString("one\rtwo\r\nthree\nfour\r"));
        const br = new BufferedReader(sr);

        let i = 0;
        for (i = 0; ; i++) {
            const l = br.readLine();
            if (l === null) {
                break;
            }
        }

        expect(i).toBe(4);
    };

}
