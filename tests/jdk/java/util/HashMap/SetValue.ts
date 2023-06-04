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
 * @bug 4627516
 * @summary HashMap.Entry.setValue() returns new value (as opposed to old)
 * @author jbloch
 */

import { java, JavaObject, S } from "../../../../../src";

type String = java.lang.String;
const String = java.lang.String;
type HashMap<K, V> = java.util.HashMap<K, V>;
const HashMap = java.util.HashMap;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;

export class SetValue extends JavaObject {
    protected static readonly key = S`key`;
    protected static readonly oldValue = S`old`;
    protected static readonly newValue = S`new`;

    public static main(args: String[]): void {
        const m = new HashMap<String, String>();
        m.put(SetValue.key, SetValue.oldValue);
        const e = m.entrySet().iterator().next();
        const returnVal = e.setValue(SetValue.newValue);
        if (!returnVal.equals(SetValue.oldValue)) {

            throw new RuntimeException("Return value: " + returnVal);
        }

    }
}
