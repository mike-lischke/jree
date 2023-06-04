/* java2ts: keep */

/*
 * Copyright (c) 2013, Oracle and/or its affiliates. All rights reserved.
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
 * Portions Copyright (c) 2013 IBM Corporation
 */

/**
 * @summary Verify that we do not get exception when we override isEmpty()
 *          in a subclass of HashMap
 * @author zhangshj@linux.vnet.ibm.com
 */

import { java, JavaObject, type int, Override } from "../../../../../src";

type Object = java.lang.Object;

export class OverrideIsEmpty extends JavaObject {
    private static NotEmptyHashMap = class NotEmptyHashMap<K extends Object, V extends Object>
        extends java.util.HashMap<K, V> {
        private alwaysExistingKey: K = new Object() as K;
        private alwaysExistingValue: V = new Object() as V;

        @Override
        public override get(key: K): V | null {
            if (key === this.alwaysExistingKey) {
                return this.alwaysExistingValue;
            }

            return super.get(key);
        }

        @Override
        public override size(): int {
            return super.size() + 1;
        }

        @Override
        public override isEmpty(): boolean {
            return this.size() === 0;
        }
    };

    public static main(): void {
        const map = new OverrideIsEmpty.NotEmptyHashMap();
        const key = new java.lang.Object();
        const value = new java.lang.Object();
        map.get(key);
        map.remove(key);
        map.replace(key, value, null);
        map.replace(key, value);
        map.computeIfPresent(key, (key: java.lang.Object, oldValue: java.lang.Object): java.lang.Object => {
            return oldValue;
        });
    }
}
