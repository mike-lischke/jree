/* java2ts: keep */

/*
 * Copyright (c) 1999, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 4189821
 * @summary HashMap's entry.toString threw a null pointer exc if the HashMap
 *          contained null keys or values.
 */

import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { HashMap } from "../../../../../src/java/util/HashMap.js";

export class ToString extends JavaObject {
    public static main(args: JavaString[]): void {
        const m = new HashMap();
        m.put(null, null);

        // Just verify that we can call toString() without an exception.
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        m.entrySet().iterator().next().toString();
        //console.log(s);
    }
}
