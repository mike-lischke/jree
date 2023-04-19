/* java2ts: keep */

/*
 * Copyright 2016 Google, Inc.  All Rights Reserved.
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

/*
 * @test
 * @bug 8146568
 * @summary repro for: NegativeArraySizeException in ArrayList.grow(int)
 * @run main/othervm -Xmx17g Bug8146568
 * @ignore This test has huge memory requirements
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject } from "../../../../../src";

export class Bug8146568 extends JavaObject {
    public static main = (): void => {
        const size = java.lang.Integer.MAX_VALUE - 2;
        const huge = new java.util.ArrayList<null>(size);
        for (let i = 0; i < size; i++) {
            huge.add(null);
        }

        try {
            huge.addAll(huge);
            throw new java.lang.Error("expected OutOfMemoryError not thrown");
        } catch (success) {
            if (success instanceof java.lang.OutOfMemoryError) { /* */ } else {
                throw success;
            }
        }
    };
}
