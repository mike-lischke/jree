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

import { java, JavaObject } from "../../../../../src";

export class AddAll extends JavaObject {
    public static main = (args: java.lang.String[]): void => {
        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            new java.util.ArrayList().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            new java.util.LinkedList().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            new java.util.Vector().addAll(m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            const list = new java.util.ArrayList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            const list = new java.util.LinkedList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }

        for (let j = 0; j < 1; j++) {
            const m = new java.util.WeakHashMap(100000);
            for (let i = 0; i < 100000; i++) {
                m.put(new java.lang.Object(), java.lang.Boolean.TRUE);
            }

            const list = new java.util.ArrayList();
            list.add("inka"); list.add("dinka"); list.add("doo");
            list.addAll(1, m.keySet());
        }
    };
}
