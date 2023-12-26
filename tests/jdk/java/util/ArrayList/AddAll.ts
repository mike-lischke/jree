/* java2ts: keep */

/*
 * Copyright (c) 2002, Oracle and/or its affiliates. All rights reserved.
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
 * @bug     4715206
 * @summary Ensure that addAll method can cope with underestimate by size().
 * @author  Josh Bloch
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { JavaBoolean } from "../../../../../src/java/lang/Boolean.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { LinkedList } from "../../../../../src/java/util/LinkedList.js";
import { Vector } from "../../../../../src/java/util/Vector.js";
import { WeakHashMap } from "../../../../../src/java/util/WeakHashMap.js";

export class AddAll extends JavaObject {
    public static main = (args: JavaString[]): void => {
        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            new ArrayList().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            new LinkedList().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            new Vector().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            const list = new ArrayList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            const list = new LinkedList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new JavaObject(), JavaBoolean.TRUE);
            }

            const list = new ArrayList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }
    };
}
