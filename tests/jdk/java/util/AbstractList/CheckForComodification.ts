/* java2ts: keep */

/*
 * Copyright (c) 2004, Oracle and/or its affiliates. All rights reserved.
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
 * @bug     4902078
 * @summary concurrent modification not detected on 2nd to last iteration
 * @author  Josh Bloch
 *
 * @ignore Bug fix temporarily removed as it uncovered other bugs (4992226)
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { I, java, JavaObject } from "../../../../../src";

type String = java.lang.String;
const String = java.lang.String;
type ArrayList<E extends JavaObject> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type ConcurrentModificationException = java.util.ConcurrentModificationException;
const ConcurrentModificationException = java.util.ConcurrentModificationException;
type RuntimeException = java.lang.RuntimeException;
const RuntimeException = java.lang.RuntimeException;

export class CheckForComodification extends JavaObject {
    private static readonly LENGTH = 10;
    public static main(args: String[]): void {
        const list = new ArrayList<number>();
        for (let i = 0; i < CheckForComodification.LENGTH; i++) {
            list.add(i);
        }

        try {
            for (const i of list) {
                if (i === CheckForComodification.LENGTH - 2) {
                    list.remove(i);
                }
            }
        } catch (e) {
            if (e instanceof ConcurrentModificationException) {
                return;
            } else {
                throw e;
            }
        }

        throw new RuntimeException("No ConcurrentModificationException");
    }
}
