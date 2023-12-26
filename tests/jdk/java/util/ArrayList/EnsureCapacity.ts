/* java2ts: keep */

/*
 * Copyright (c) 2010, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 6992121
 * @summary Test the ArrayList.ensureCapacity() and Vector.ensureCapacity
 *    method with negative minimumCapacity input argument.
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { Integer } from "../../../../../src/java/lang/Integer.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { RuntimeException } from "../../../../../src/java/lang/RuntimeException.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { Vector } from "../../../../../src/java/util/Vector.js";
import { int } from "../../../../../src/types.js";

export class EnsureCapacity extends JavaObject {
    public static main = (args: JavaString[]): void => {
        EnsureCapacity.testArrayList();
        EnsureCapacity.testVector();
    };

    private static checkCapacity = (before: int, after: int): void => {
        if (before !== after) {
            throw new RuntimeException("capacity is expected to be unchanged: " +
                "before=" + before + " after=" + after);
        }
    };

    private static testArrayList = (): void => {
        const al = new ArrayList<string>();
        al.add("abc");
        al.ensureCapacity(Integer.MIN_VALUE);

        // there is no method to query the capacity of ArrayList
        // so before and after capacity are not checked
    };

    private static testVector = (): void => {
        const vector = new Vector<string>();
        vector.add("abc");

        const cap = vector.capacity();
        vector.ensureCapacity(Integer.MIN_VALUE);

        expect(cap).toEqual(vector.capacity());
    };
}
