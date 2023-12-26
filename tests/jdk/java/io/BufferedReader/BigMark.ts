/* java2ts: keep */

/*
 * Copyright (c) 1997, 2010, Oracle and/or its affiliates. All rights reserved.
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
import { JavaFile } from "../../../../../src/java/io/File.js";
import { JavaFileReader } from "../../../../../src/java/io/FileReader.js";
import { Integer } from "../../../../../src/java/lang/Integer.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { OutOfMemoryError } from "../../../../../src/java/lang/OutOfMemoryError.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { System } from "../../../../../src/java/lang/System.js";

/* @test
   @summary BufferedReader should throw an OutOfMemoryError when the
            read-ahead limit is very large
   @bug 6350733
   @build BigMark
   @run main/othervm BigMark
*/

export class BigMark extends JavaObject {

    public static main = (args: JavaString[]): void => {
        const dir = System.getProperty("test.src", ".");
        const br = new BufferedReader(new JavaFileReader(new JavaFile(dir, "BigMark.ts")), 100);

        br.mark(200);
        br.readLine();

        expect(() => {
            br.mark(Integer.MAX_VALUE);
            br.readLine();
        }).toThrow(OutOfMemoryError);
    };
}
