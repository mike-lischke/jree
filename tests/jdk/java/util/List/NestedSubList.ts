/* java2ts: keep */

/*
 * Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 8079136
 * @run testng NestedSubList
 * @summary Accessing a nested sublist leads to StackOverflowError
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { Integer } from "../../../../../src/java/lang/Integer.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { StackOverflowError } from "../../../../../src/java/lang/StackOverflowError.js";
import { AbstractList } from "../../../../../src/java/util/AbstractList.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { Arrays } from "../../../../../src/java/util/Arrays.js";
import { Collections } from "../../../../../src/java/util/Collections.js";
import { LinkedList } from "../../../../../src/java/util/LinkedList.js";
import { List } from "../../../../../src/java/util/List.js";
import { Vector } from "../../../../../src/java/util/Vector.js";
import { int } from "../../../../../src/types.js";

export class NestedSubList extends JavaObject {

    protected static readonly NEST_LIMIT = 65536;

    private static MyList = class MyList extends AbstractList<Integer> {
        public constructor() {
            super();
        }
        public override  get(index: int): Integer { return new Integer(42); }
        public override  size(): int { return 1; }
    };

    public static lists(): Array<[JavaObject, boolean]> {
        const MODIFIABLE = true;
        const NON_MODIFIABLE = false;
        const c = Arrays.asList(new Integer(42));

        return [
            [c, NON_MODIFIABLE],
            [new ArrayList(c), MODIFIABLE],
            [new LinkedList(c), MODIFIABLE],
            [new NestedSubList.MyList(), NON_MODIFIABLE],
            [new Vector(c), MODIFIABLE],
            [Collections.singletonList(new Integer(42)), NON_MODIFIABLE],

            /* These variants do not add any new test case.
            [Collections.checkedList(c, Integer.class), NON_MODIFIABLE],
            [Collections.checkedList(new ArrayList(c), Integer.class), MODIFIABLE],
            [Collections.checkedList(new LinkedList(c), Integer.class), MODIFIABLE],
            [Collections.checkedList(new Vector(c), Integer.class), MODIFIABLE],
            [Collections.synchronizedList(c), NON_MODIFIABLE],
            [Collections.synchronizedList(new ArrayList(c)), MODIFIABLE],
            [Collections.synchronizedList(new LinkedList(c)), MODIFIABLE],
            [Collections.synchronizedList(new Vector(c)), MODIFIABLE],
            [Collections.unmodifiableList(c), NON_MODIFIABLE],
            [Collections.unmodifiableList(new ArrayList(c)), NON_MODIFIABLE],
            [Collections.unmodifiableList(new LinkedList(c)), NON_MODIFIABLE],
            [Collections.unmodifiableList(new Vector(c)), NON_MODIFIABLE],
            */
        ];
    }

    public testAccessToSublists(list: List<Integer>, modifiable: boolean): void {
        const cls = list.getClass();
        for (let i = 0; i < NestedSubList.NEST_LIMIT; ++i) {
            list = list.subList(0, 1);
        }

        try {
            list.get(0);
            if (modifiable) {
                list.remove(0);
                list.add(0, new Integer(42));
            }
        } catch (e) {
            if (e instanceof StackOverflowError) {
                fail("failed for " + cls);
            } else {
                throw e;
            }
        }
    }
}
