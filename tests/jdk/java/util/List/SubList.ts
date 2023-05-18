/* java2ts: keep */

/*
 * Copyright (c) 2016, 2017, Oracle and/or its affiliates. All rights reserved.
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
 * @library /test/lib
 * @build jdk.test.lib.RandomFactory
 * @run testng SubList
 * @summary Basic functionality of sub lists
 * @key randomness
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, int, I } from "../../../../../src";
import { org } from "../../../../org/org";

type Random = java.util.Random;
const Random = java.util.Random;
const Test = org.testng.annotations.Test;
type List<E> = java.util.List<E>;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type ConcurrentModificationException = java.util.ConcurrentModificationException;
const ConcurrentModificationException = java.util.ConcurrentModificationException;
type UnsupportedOperationException = java.lang.UnsupportedOperationException;
const UnsupportedOperationException = java.lang.UnsupportedOperationException;
const DataProvider = org.testng.annotations.DataProvider;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type System = java.lang.System;
const System = java.lang.System;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type LinkedList<E> = java.util.LinkedList<E>;
const LinkedList = java.util.LinkedList;
type Vector<E> = java.util.Vector<E>;
const Vector = java.util.Vector;
type Collections = java.util.Collections;
const Collections = java.util.Collections;

export class SubList extends org.testng.Assert {

    private static MyList = class MyList extends java.util.AbstractList<Integer> {
        #size: int;

        public constructor(s: int) {
            super();
            this.#size = s;
        }
        public override  get(index: int): Integer { return I`42`; }
        public override  size(): int { return this.#size; }
    };

    protected readonly rnd = new Random();

    /**
     * All kinds of lists
     *
     * @returns tbd
     */
    @DataProvider
    public static all(): Array<[List<Integer>, int, int]> {
        const l1 = SubList.modifiable();
        const l2 = SubList.unresizable();
        const res = Arrays.copyOf(l1, l1.length + l2.length);
        System.arraycopy(l2, 0, res, l1.length, l2.length);

        return res;
    }

    /**
     * Lists that allow any modifications: resizing and setting values
     *
     * @returns tbd
     */
    @DataProvider
    public static modifiable(): Array<[List<Integer>, int, int]> {
        const c1 = Arrays.asList(I`42`);
        const c9 = Arrays.asList(I`40`, I`41`, I`42`, I`43`, I`44`, I`45`, I`-1`, I`Integer.MIN_VALUE`, I`1000500`);

        return [
            [new ArrayList(c1), 0, 1],
            [new LinkedList(c1), 0, 1],
            [new Vector(c1), 0, 1],
            [new ArrayList(c1).subList(0, 1), 0, 1],
            [new LinkedList(c1).subList(0, 1), 0, 1],
            [new Vector(c1).subList(0, 1), 0, 1],
            [Collections.checkedList<Integer>(new ArrayList(c1), Integer.class), 0, 1],
            [Collections.checkedList<Integer>(new LinkedList(c1), Integer.class), 0, 1],
            [Collections.checkedList<Integer>(new Vector(c1), Integer.class), 0, 1],
            [Collections.synchronizedList<Integer>(new ArrayList(c1)), 0, 1],
            [Collections.synchronizedList<Integer>(new LinkedList(c1)), 0, 1],
            [Collections.synchronizedList<Integer>(new Vector(c1)), 0, 1],

            [new ArrayList(c9), 2, 5],
            [new LinkedList(c9), 2, 5],
            [new Vector(c9), 2, 5],
            [new ArrayList(c9).subList(1, 8), 1, 4],
            [new LinkedList(c9).subList(1, 8), 1, 4],
            [new Vector(c9).subList(1, 8), 1, 4],
            [Collections.checkedList<Integer>(new ArrayList(c9), Integer.class), 2, 5],
            [Collections.checkedList<Integer>(new LinkedList(c9), Integer.class), 2, 5],
            [Collections.checkedList<Integer>(new Vector(c9), Integer.class), 2, 5],
            [Collections.synchronizedList<Integer>(new ArrayList(c9)), 2, 5],
            [Collections.synchronizedList<Integer>(new LinkedList(c9)), 2, 5],
            [Collections.synchronizedList<Integer>(new Vector(c9)), 2, 5],
        ];
    }

    /**
     * Lists that don't allow resizing, but allow setting values
     *
     * @returns tbd
     */
    @DataProvider
    public static unresizable(): Array<[List<Integer>, int, int]> {
        const c1 = Arrays.asList(I`42`);
        const c9 = Arrays.asList(I`40`, I`41`, I`42`, I`43`, I`44`, I`45`, I`-1`, I`Integer.MIN_VALUE`, I`1000500`);

        const l1 = SubList.unsettable();
        const l2 = [
            [c1, 0, 1],
            [c1.subList(0, 1), 0, 1],
            [Collections.checkedList<Integer>(c1, Integer.class), 0, 1],
            [Collections.synchronizedList<Integer>(c1), 0, 1],
            [c9, 0, 4],
            [c9, 4, 6],
            [c9.subList(1, 8), 1, 4],
            [c9.subList(1, 8), 0, 7],
            [Collections.checkedList<Integer>(c9, Integer.class), 3, 6],
            [Collections.synchronizedList<Integer>(c9), 3, 5],
        ];
        const res = Arrays.copyOf(l1, l1.length + l2.length);
        System.arraycopy(l2, 0, res, l1.length, l2.length);

        return res;
    }

    /**
     * Lists that don't allow either resizing or setting values
     *
     * @returns tbd
     */
    @DataProvider
    public static unsettable(): Array<[List<Integer>, int, int]> {
        const c1 = Arrays.asList(I`42`);
        const c9 = Arrays.asList(I`40`, I`41`, I`42`, I`43`, I`44`, I`45`, I`-1`, I`Integer.MIN_VALUE`, I`1000500`);

        return [
            [new SubList.MyList(1), 0, 1],
            [new SubList.MyList(1).subList(0, 1), 0, 1],
            [Collections.singletonList(I`42`), 0, 1],
            [Collections.singletonList(I`42`).subList(0, 1), 0, 1],
            [Collections.unmodifiableList(c1), 0, 1],
            [Collections.unmodifiableList<Integer>(new ArrayList(c1)), 0, 1],
            [Collections.unmodifiableList<Integer>(new LinkedList(c1)), 0, 1],
            [Collections.unmodifiableList<Integer>(new Vector(c1)), 0, 1],

            [new SubList.MyList(9), 3, 6],
            [new SubList.MyList(9).subList(2, 8), 3, 6],
            [Collections.unmodifiableList(c9), 3, 6],
            [Collections.unmodifiableList<Integer>(new ArrayList(c9)), 3, 6],
            [Collections.unmodifiableList<Integer>(new LinkedList(c9)), 3, 6],
            [Collections.unmodifiableList<Integer>(new Vector(c9)), 3, 6],
        ];
    }

    @Test({ dataProvider: "modifiable" })
    public testAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const e = new Integer(this.rnd.nextInt());
        subList.add(e);
        SubList.assertEquals(list.get(to), e);
        SubList.assertEquals(subList.size(), to - from + 1);
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.add(I`42`);
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        subList.add(I`42`);
    }

    @Test({ dataProvider: "modifiable" })
    public testAddAtPos(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const i = this.rnd.nextInt(1 + to - from);
        const e = this.rnd.nextInt();
        subList.add(i, new Integer(e));
        SubList.assertEquals(list.get(from + i), e);
        SubList.assertEquals(subList.size(), to - from + 1);
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModAddAtPos(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        const i = this.rnd.nextInt(1 + to - from);
        subList.add(i, I`42`);
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodAddAtPos(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const i = this.rnd.nextInt(1 + to - from);
        subList.add(i, new Integer(42));
    }

    @Test({ dataProvider: "modifiable" })
    public testClear(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        subList.clear();
        SubList.assertTrue(subList.isEmpty());
        SubList.assertEquals(subList.size(), 0);
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModClear(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.clear();
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodClear(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        subList.clear();
    }

    @Test({ dataProvider: "all" })
    public testEquals(list: List<Integer>, from: int, to: int): void {
        const subList1 = list.subList(from, to);
        const subList2 = list.subList(from, to);
        SubList.assertTrue(subList1.equals(subList2));
        SubList.assertEquals(subList1.hashCode(), subList2.hashCode());
        for (let i = 0; i !== 16; ++i) {
            const from3 = this.rnd.nextInt(1 + list.size());
            const to3 = from3 + this.rnd.nextInt(1 + list.size() - from3);
            let equal = (to - from) === (to3 - from3);
            for (let j = 0; j < to - from && j < to3 - from3; ++j) {

                equal &&= list.get(from + j) === list.get(from3 + j);
            }

            const subList3 = list.subList(from3, to3);
            SubList.assertEquals(subList1.equals(subList3), equal);
        }
    }

    //    @Test(dataProvider = "modifiable",
    //          expectedExceptions = ConcurrentModificationException.class)
    //    public void testModEquals(List<Integer> list, int from, int to) {
    //        List<Integer> subList = list.subList(from, to);
    //        list.add(I`42`);
    //        subList.equals(subList);
    //    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModHashCode(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.hashCode();
    }

    @Test({ dataProvider: "all" })
    public testGet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let i = 0; i < to - from; ++i) {

            SubList.assertEquals(list.get(from + i), subList.get(i));
        }

    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModGet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.get(from);
    }

    @Test({ dataProvider: "all" })
    public testIndexOf(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        if (from < to) {
            const e = list.get(from);
            const j = subList.indexOf(e);
            SubList.assertTrue(j === 0);
        }
        for (let i = 0; i < list.size(); ++i) {
            const e = list.get(i);
            const j = subList.indexOf(e);
            if (i < from || i >= to) {
                SubList.assertTrue(j === -1 || subList.get(j) === e);
            } else {
                SubList.assertTrue(j >= 0);
                SubList.assertTrue(j <= i - from);
                SubList.assertEquals(subList.get(j), e);
            }
        }
        for (let i = 0; i < 16; ++i) {
            const r = new Integer(this.rnd.nextInt());
            if (list.contains(r)) {
                continue;
            }

            const j = subList.indexOf(r);
            SubList.assertTrue(j === -1);
        }
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModIndexOf(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.indexOf(new Integer(from));
    }

    @Test({ dataProvider: "all" })
    public testIterator(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.iterator();
        for (let i = from; i < to; ++i) {
            SubList.assertTrue(it.hasNext());
            SubList.assertEquals(list.get(i), it.next());
        }
        SubList.assertFalse(it.hasNext());
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModIteratorNext(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.iterator();
        list.add(I`42`);
        it.next();
    }

    @Test({ dataProvider: "modifiable" })
    public testIteratorRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.iterator();
        for (let i = from; i < to; ++i) {
            SubList.assertTrue(it.hasNext());
            SubList.assertEquals(list.get(from), it.next());
            it.remove();
        }
        SubList.assertFalse(it.hasNext());
        SubList.assertTrue(subList.isEmpty());
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModIteratorRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.iterator();
        it.next();
        list.add(I`42`);
        it.remove();
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodIteratorRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.iterator();
        it.next();
        it.remove();
    }

    @Test({ dataProvider: "all" })
    public testIteratorForEachRemaining(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let k = 0; k < 16; ++k) {
            const r = from + this.rnd.nextInt(1 + to - from);
            const it = subList.iterator();
            for (let i = from; i < to; ++i) {
                SubList.assertTrue(it.hasNext());
                if (i === r) {
                    const jt = list.listIterator(r);
                    it.forEachRemaining((x) => {
                        return SubList.assertTrue(jt.hasNext() && x === jt.next());
                    });
                    break;
                }
                SubList.assertEquals(list.get(i), it.next());
            }

            // eslint-disable-next-line no-loop-func
            it.forEachRemaining(() => { fail(); }); // This is actually the global fail function from Jest.
        }
    }

    @Test({ dataProvider: "all" })
    public testLastIndexOf(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        if (from < to) {
            const e = list.get(to - 1);
            const j = subList.lastIndexOf(e);
            SubList.assertTrue(j === to - from - 1);
        }
        for (let i = 0; i < list.size(); ++i) {
            const e = list.get(i);
            const j = subList.lastIndexOf(e);
            if (i < from || i >= to) {
                SubList.assertTrue(j === -1 || subList.get(j) === e);
            } else {
                SubList.assertTrue(j >= 0 && j >= i - from);
                SubList.assertEquals(subList.get(j), e);
            }
        }
        for (let i = 0; i < 16; ++i) {
            const r = new Integer(this.rnd.nextInt());
            if (list.contains(r)) {
                continue;
            }

            const j = subList.lastIndexOf(r);
            SubList.assertTrue(j === -1);
        }
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModLastIndexOf(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.lastIndexOf(I`42`);
    }

    @Test({ dataProvider: "unresizable" })
    public testListIterator(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        for (let i = from; i < to; ++i) {
            SubList.assertTrue(it.hasNext());
            SubList.assertTrue(it.nextIndex() === i - from);
            SubList.assertEquals(list.get(i), it.next());
        }
        SubList.assertFalse(it.hasNext());
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModListIteratorNext(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        list.add(I`42`);
        it.next();
    }

    @Test({ dataProvider: "modifiable" })
    public testListIteratorSet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        for (let i = from; i < to; ++i) {
            SubList.assertTrue(it.hasNext());
            SubList.assertTrue(it.nextIndex() === i - from);
            SubList.assertEquals(list.get(i), it.next());
            const e = new Integer(this.rnd.nextInt());
            it.set(e);
            SubList.assertEquals(list.get(i), e);
        }
        SubList.assertFalse(it.hasNext());
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModListIteratorSet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        it.next();
        list.add(I`42`);
        it.set(I`42`);
    }

    @Test({
        dataProvider: "unsettable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodListIteratorSet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        it.next();
        it.set(I`42`);
    }

    @Test({ dataProvider: "unresizable" })
    public testListIteratorPrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(subList.size());
        for (let i = to - 1; i >= from; --i) {
            SubList.assertTrue(it.hasPrevious());
            SubList.assertTrue(it.previousIndex() === i - from);
            SubList.assertEquals(list.get(i), it.previous());
        }
        SubList.assertFalse(it.hasPrevious());
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModListIteratorPrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(to - from);
        list.add(I`42`);
        it.previous();
    }

    @Test({ dataProvider: "modifiable" })
    public testListIteratorSetPrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(subList.size());
        for (let i = to - 1; i >= from; --i) {
            SubList.assertTrue(it.hasPrevious());
            SubList.assertTrue(it.previousIndex() === i - from);
            SubList.assertEquals(list.get(i), it.previous());
            const e = new Integer(this.rnd.nextInt());
            it.set(e);
            SubList.assertEquals(list.get(i), e);
        }
        SubList.assertFalse(it.hasPrevious());
    }

    @Test({
        dataProvider: "unsettable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodListIteratorSetPrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(to - from);
        it.previous();
        it.set(I`42`);
    }

    @Test({ dataProvider: "modifiable" })
    public testListIteratorAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let i = 0; i < 16; ++i) {
            const r = this.rnd.nextInt(1 + subList.size());
            const it = subList.listIterator(r);
            const e = new Integer(this.rnd.nextInt());
            it.add(e);
            SubList.assertEquals(it.previous(), e);
            SubList.assertEquals(list.get(from + r), e);
        }
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodListIteratorAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const r = this.rnd.nextInt(1 + subList.size());
        const it = subList.listIterator(r);
        it.add(I`42`);
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModListIteratorAdd(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        it.next();
        list.add(I`42`);
        it.add(I`42`);
    }

    @Test({ dataProvider: "modifiable" })
    public testListIteratorRemoveNext(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        for (let i = from; i < to; ++i) {
            SubList.assertTrue(it.hasNext());
            SubList.assertTrue(it.nextIndex() === 0);
            SubList.assertEquals(list.get(from), it.next());
            it.remove();
        }
        SubList.assertFalse(it.hasNext());
        SubList.assertTrue(subList.isEmpty());
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodListIteratorRemoveNext(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        it.next();
        it.remove();
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModListIteratorRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator();
        it.next();
        list.add(I`42`);
        it.remove();
    }

    @Test({ dataProvider: "modifiable" })
    public testListIteratorRemovePrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(subList.size());
        for (let i = to - 1; i >= from; --i) {
            SubList.assertTrue(it.hasPrevious());
            SubList.assertTrue(it.previousIndex() === i - from);
            SubList.assertEquals(list.get(i), it.previous());
            it.remove();
        }
        SubList.assertFalse(it.hasPrevious());
        SubList.assertTrue(subList.isEmpty());
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodListIteratorRemovePrevious(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const it = subList.listIterator(subList.size());
        it.previous();
        it.remove();
    }

    @Test({ dataProvider: "modifiable" })
    public testRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let i = 0; i < 16; ++i) {
            if (subList.isEmpty()) {
                break;
            }

            const r = this.rnd.nextInt(subList.size());
            const e = list.get(from + r);
            SubList.assertEquals(subList.remove(r), e);
        }
    }

    @Test({
        dataProvider: "unresizable",
        expectedExceptions: UnsupportedOperationException,
    })
    public testUnmodRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        const r = this.rnd.nextInt(subList.size());
        subList.remove(r);
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModRemove(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.remove(0);
    }

    @Test({ dataProvider: "modifiable" })
    public testSet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let i = 0; i < to - from; ++i) {
            const e0 = list.get(from + i);
            const e1 = new Integer(this.rnd.nextInt());
            SubList.assertEquals(subList.set(i, e1), e0);
            SubList.assertEquals(list.get(from + i), e1);
        }
    }

    @Test({
        dataProvider: "modifiable",
        expectedExceptions: ConcurrentModificationException,
    })
    public testModSet(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        list.add(I`42`);
        subList.set(0, I`42`);
    }

    @Test({ dataProvider: "all" })
    public testSubList(list: List<Integer>, from: int, to: int): void {
        const subList = list.subList(from, to);
        for (let i = 0; i < 16 && from < to; ++i) {
            const from1 = this.rnd.nextInt(to - from);
            const to1 = from1 + 1 + this.rnd.nextInt(to - from - from1);
            const subSubList = subList.subList(from1, to1);
            for (let j = 0; j < to1 - from1; ++j) {

                SubList.assertEquals(list.get(from + from1 + j), subSubList.get(j));
            }

        }
    }
}
