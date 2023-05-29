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
 * @bug 4189896
 * @summary AbstractList iterators previously checked for co-modification
 *          *after* the set/add/remove operations were performed.
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject } from "../../../../../src";

type String = java.lang.String;
const String = java.lang.String;
type ArrayList<E extends JavaObject> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type Exception = java.lang.Exception;
const Exception = java.lang.Exception;
type ConcurrentModificationException = java.util.ConcurrentModificationException;
const ConcurrentModificationException = java.util.ConcurrentModificationException;

export class FailFastIterator extends JavaObject {
    public static main(args: String[]): void {
        const orig = new ArrayList(100);
        for (let i = 0; i < 100; i++) {
            orig.add(new Integer(i));
        }

        const copy = new ArrayList(orig);
        try {
            const i = copy.listIterator();
            i.next();
            copy.remove(99);
            copy.add(new Integer(99));
            i.remove();
            throw new Exception("remove: iterator didn't fail fast");
        } catch (e) {
            if (e instanceof ConcurrentModificationException) {
                // expected
            } else {
                throw e;
            }
        }
        if (!copy.equals(orig)) {
            throw new Exception("remove: iterator didn't fail fast enough");
        }

        try {
            const i = copy.listIterator();
            i.next();
            copy.remove(99);
            copy.add(new Integer(99));
            i.set(new Integer(666));
            throw new Exception("set: iterator didn't fail fast");
        } catch (e) {
            if (e instanceof ConcurrentModificationException) {
                // expected
            } else {
                throw e;
            }
        }
        if (!copy.equals(orig)) {

            throw new Exception("set: iterator didn't fail fast enough");
        }

        try {
            const i = copy.listIterator();
            copy.remove(99);
            copy.add(new Integer(99));
            i.add(new Integer(666));
            throw new Exception("add: iterator didn't fail fast");
        } catch (e) {
            if (e instanceof ConcurrentModificationException) {
                // expected
            } else {
                throw e;
            }
        }
        if (!copy.equals(orig)) {
            throw new Exception("add: iterator didn't fail fast enough");
        }

    }
}
