/* java2ts: keep */

/*
 * Copyright (c) 2000, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 4375048
 * @summary AbstractList's ListIterator.hasNext() returns
 *          true, after ListIterator.previous() causes
 *          an exception for an empty list.
 * @author Konstantin Kladko
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { RuntimeException } from "../../../../../src/java/lang/RuntimeException.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { NoSuchElementException } from "../../../../../src/java/util/NoSuchElementException.js";

export class HasNextAfterException extends JavaObject {
    public static main(args: String[]): void {
        const list = new ArrayList();
        const i = list.listIterator();
        try {
            i.previous();
        } catch (e) {
            if (e instanceof NoSuchElementException) {
                // expected
            } else {
                throw e;
            }
        }
        if (i.hasNext()) {
            throw new RuntimeException(
                "ListIterator.hasNext() returns true for an empty "
                + "List after ListIterator.previous().");
        }
    }
}
