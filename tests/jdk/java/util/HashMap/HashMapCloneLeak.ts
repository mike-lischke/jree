/* java2ts: keep */

/*
 * Copyright (c) 2013, 2018, Oracle and/or its affiliates. All rights reserved.
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

/**
 * @summary Verify that we do not leak contents when we clone a HashMap
 * @author david.buck@oracle.com
 */

import { I, java, JavaObject } from "../../../../../src";

type WeakReference<T extends JavaObject> = java.lang.ref.WeakReference<T>;
const WeakReference = java.lang.ref.WeakReference;
type HashMap<K, V> = java.util.HashMap<K, V>;
const HashMap = java.util.HashMap;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type String = java.lang.String;
const String = java.lang.String;
type OutOfMemoryError = java.lang.OutOfMemoryError;
const OutOfMemoryError = java.lang.OutOfMemoryError;
type System = java.lang.System;
const System = java.lang.System;

// Note: This test is not really used as we cannot test for memory leaks in a reliable way and have no way to
// manually trigger garbage collection.
export class HashMapCloneLeak extends JavaObject {

    protected static wr: WeakReference<java.lang.Object>;

    public static main(args: String[]): void {
        let hm = HashMapCloneLeak.makeMap();
        hm = hm.clone() as HashMap<Integer, java.lang.Object>;
        hm.clear();
        // There should no longer be a strong reference to testObject
        // the WeakReference should be nulled out by GC. If not,
        // we will hang here until timed out by the test harness.
        let chain: Array<java.lang.Object[] | null> | null = null;
        while (HashMapCloneLeak.wr.get() !== null) {
            try {
                const allocate = new Array(1000000);
                allocate[0] = chain;
                chain = allocate;
            } catch (error) {
                if (error instanceof OutOfMemoryError) {
                    chain = null;
                } else {
                    throw error;
                }
            }
            System.gc();
            //Thread.sleep(100);
        }
    }

    // helper method to keep testObject and map out of main method's scope
    private static makeMap(): HashMap<Integer, java.lang.Object> {
        const map = new HashMap<Integer, java.lang.Object>();
        const testObject = new java.lang.Object();
        HashMapCloneLeak.wr = new WeakReference<java.lang.Object>(testObject);
        map.put(I`42`, testObject);

        return map;
    }

}
