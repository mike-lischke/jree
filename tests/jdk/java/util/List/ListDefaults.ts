/* java2ts: keep */

/*
 * Copyright (c) 2012, 2014, Oracle and/or its affiliates. All rights reserved.
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

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

/* cspell: disable */

import { I, JavaObject, S, java } from "../../../../../src";
import { org } from "../../../../org/org";
import { Assert } from "../../../../org/testng/Assert";
import { CollectionAsserts } from "../Collection/testlibrary/CollectionAsserts";
import { CollectionSupplier } from "../Collection/testlibrary/CollectionSupplier";
import { ExtendsAbstractList } from "../Collection/testlibrary/ExtendsAbstractList";

type List<E> = java.util.List<E>;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type Collection<E> = java.util.Collection<E>;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type AtomicInteger = java.util.concurrent.atomic.AtomicInteger;
const AtomicInteger = java.util.concurrent.atomic.AtomicInteger;
type Consumer<T> = java.util.function.Consumer<T>;
const DataProvider = org.testng.annotations.DataProvider;
type LinkedList<E> = java.util.LinkedList<E>;
const LinkedList = java.util.LinkedList;
type Collections = java.util.Collections;
const Collections = java.util.Collections;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
type Vector<E> = java.util.Vector<E>;
const Vector = java.util.Vector;
type Stack<E> = java.util.Stack<E>;
const Stack = java.util.Stack;
type CopyOnWriteArrayList<E> = java.util.concurrent.CopyOnWriteArrayList<E>;
const CopyOnWriteArrayList = java.util.concurrent.CopyOnWriteArrayList;
const Test = org.testng.annotations.Test;
const assertEquals = org.testng.Assert.assertEquals;
const assertTrue = org.testng.Assert.assertTrue;
const assertFalse = org.testng.Assert.assertFalse;
type AtomicBoolean = java.util.concurrent.atomic.AtomicBoolean;
const AtomicBoolean = java.util.concurrent.atomic.AtomicBoolean;
type ConcurrentModificationException = java.util.ConcurrentModificationException;
const ConcurrentModificationException = java.util.ConcurrentModificationException;
type Function<T, R> = java.util.function.Function<T, R>;

/**
 * @test
 * @summary Unit tests for extension methods on List
 * @bug 8023367 8037106
 * @library ../Collection/testlibrary
 * @build CollectionAsserts CollectionSupplier ExtendsAbstractList
 * @run testng ListDefaults
 */
export class ListDefaults extends JavaObject {

    // Suppliers of lists that can support structural modifications
    private static readonly LIST_STRUCT_MOD_SUPPLIERS = Arrays.asList<Function<Collection<Integer>, List<Integer>>>(
        (c) => { return new java.util.ArrayList<Integer>(c); },
        (c) => { return new java.util.LinkedList<Integer>(c); },
        (c) => { return new java.util.Vector<Integer>(c); },
        (c) => { return new java.util.concurrent.CopyOnWriteArrayList<Integer>(c); },
        (c) => { return new ExtendsAbstractList<Integer>(c); },
    );

    // Suppliers of lists that can support in place modifications
    private static readonly LIST_SUPPLIERS = Arrays.asList<Function<Collection<Integer>, List<Integer>>>(
        (c) => { return new java.util.ArrayList<Integer>(c); },
        (c) => { return new java.util.LinkedList<Integer>(c); },
        (c) => { return new java.util.Vector<Integer>(c); },
        (c) => { return new java.util.concurrent.CopyOnWriteArrayList<Integer>(c); },
        (c) => { return new ExtendsAbstractList<Integer>(c); },
        (c: List<Integer>) => { return Arrays.asList<Integer>(c.toArray()); },
    );

    // Suppliers of lists supporting CMEs
    private static readonly LIST_CME_SUPPLIERS = Arrays.asList<Function<Collection<Integer>, List<Integer>>>(
        () => { return new java.util.ArrayList<Integer>(); },
        () => { return new java.util.Vector<Integer>(); },
    );

    private static readonly SIZE = 100;
    private static readonly SUBLIST_FROM = 20;
    private static readonly SUBLIST_TO = ListDefaults.SIZE - 5;
    private static readonly SUBLIST_SIZE = ListDefaults.SUBLIST_TO - ListDefaults.SUBLIST_FROM;

    private static readonly SLICED_EXPECTED = Arrays.asList(I`0`, I`1`, I`2`, I`3`, I`5`, I`6`, I`7`, I`8`, I`9`);
    private static readonly SLICED_EXPECTED2 = Arrays.asList(I`0`, I`1`, I`2`, I`5`, I`6`, I`7`, I`8`, I`9`);

    @DataProvider({ name: "listProvider", parallel: true })
    public static listCases(): java.lang.Object[][] {
        const cases = new LinkedList<java.lang.Object[]>();
        cases.add([Collections.emptyList()]);
        cases.add([new ArrayList()]);
        cases.add([new LinkedList()]);
        cases.add([new Vector()]);
        cases.add([new Stack()]);
        cases.add([new CopyOnWriteArrayList()]);
        cases.add([Arrays.asList()]);

        const l = Arrays.asList(42);
        cases.add([new ArrayList(l)]);
        cases.add([new LinkedList(l)]);
        cases.add([new Vector(l)]);
        const s = new Stack(); s.addAll(l);
        cases.add([s]);
        cases.add([new CopyOnWriteArrayList(l)]);
        cases.add([l]);

        return cases.toArray();
    }

    @DataProvider({ name: "shortIntListProvider", parallel: true })
    public static intListCases(): java.lang.Object[][] {
        const DATA: Integer[] = [I`0`, I`1`, I`2`, I`3`, I`4`, I`5`, I`6`, I`7`, I`8`, I`9`];
        const cases = new LinkedList<java.lang.Object[]>();
        cases.add([new ArrayList(Arrays.asList(DATA))]);
        cases.add([new LinkedList(Arrays.asList(DATA))]);
        cases.add([new Vector(Arrays.asList(DATA))]);
        cases.add([new CopyOnWriteArrayList(Arrays.asList(DATA))]);
        cases.add([new ExtendsAbstractList(Arrays.asList(DATA))]);

        return cases.toArray();
    }

    private static readonly pEven = (x: Integer) => { return 0 === +x % 2; };
    private static readonly pOdd = (x: Integer) => { return 1 === +x % 2; };

    private static readonly BIT_COUNT_COMPARATOR = (x: Integer, y: Integer) => {
        return java.lang.Integer.bitCount(+x) - java.lang.Integer.bitCount(+y);
    };

    private static readonly ATOMIC_INTEGER_COMPARATOR = (x: AtomicInteger, y: AtomicInteger) => {
        return +x - +y;
    };

    @Test({ dataProvider: "listProvider", enabled: true, description: "Check for null functions" })
    public testProvidedWithNull(list: List<Integer>): void {
        try {
            list.forEach(null);
            Assert.fail("expected NPE not thrown");
        } catch (npe) {
            if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                throw npe;
            }
        }
        try {
            list.replaceAll(null);
            Assert.fail("expected NPE not thrown");
        } catch (npe) {
            if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                throw npe;
            }
        }
        try {
            list.removeIf(null);
            Assert.fail("expected NPE not thrown");
        } catch (npe) {
            if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                throw npe;
            }
        }
        try {
            list.sort(null);
        } catch (t) {
            if (t instanceof java.lang.Throwable) {
                Assert.fail("Exception not expected: " + t);
            } else {
                throw t;
            }
        }
    }

    @Test({ enabled: true })
    public testForEach(): void {
        const supplier = new CollectionSupplier<List<Integer>>(ListDefaults.LIST_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;

            try {
                list.forEach(null);
                Assert.fail("expected NPE not thrown");
            } catch (npe) {
                if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                    throw npe;
                }
            }
            CollectionAsserts.assertContents(list, original);

            const actual = new LinkedList<Integer>();

            list.forEach((x: Integer) => { actual.add(x); });
            CollectionAsserts.assertContents(actual, list);
            CollectionAsserts.assertContents(actual, original);

            if (original.size() > ListDefaults.SUBLIST_SIZE) {
                const subList = original.subList(ListDefaults.SUBLIST_FROM, ListDefaults.SUBLIST_TO);
                const actualSubList = new LinkedList();
                subList.forEach((x: Integer) => { actualSubList.add(x); });
                assertEquals(actualSubList.size(), ListDefaults.SUBLIST_SIZE);
                for (let i = 0; i < ListDefaults.SUBLIST_SIZE; i++) {
                    assertEquals(actualSubList.get(i), original.get(i + ListDefaults.SUBLIST_FROM));
                }
            }

            this.trimmedSubList(list, (l) => {
                const a = new LinkedList<Integer>();
                l.forEach((x: Integer) => { a.add(x); });
                CollectionAsserts.assertContents(a, l);
            });
        }
    }

    @Test({ enabled: true })
    public testRemoveIf(): void {
        const supplier = new CollectionSupplier<List<Integer>>(ListDefaults.LIST_STRUCT_MOD_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;

            try {
                list.removeIf(null);
                Assert.fail("expected NPE not thrown");
            } catch (npe) {
                if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                    throw npe;
                }
            }
            CollectionAsserts.assertContents(list, original);

            const offset = new AtomicInteger(1);
            while (list.size() > 0) {
                this.removeFirst(original, list, offset);
            }
        }

        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;
            list.removeIf(ListDefaults.pOdd);
            for (const i of list) {
                assertTrue((+i % 2) === 0);
            }
            for (const i of original) {
                if (+i % 2 === 0) {
                    assertTrue(list.contains(i));
                }
            }
            list.removeIf(ListDefaults.pEven);
            assertTrue(list.isEmpty());
        }

        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;
            const listCopy = new ArrayList<Integer>(list);
            if (original.size() > ListDefaults.SUBLIST_SIZE) {
                const subList = list.subList(ListDefaults.SUBLIST_FROM, ListDefaults.SUBLIST_TO);
                const subListCopy = new ArrayList(subList);
                listCopy.removeAll(subList);
                subList.removeIf(ListDefaults.pOdd);
                for (const i of subList) {
                    assertTrue((+i % 2) === 0);
                }
                for (const i of subListCopy) {
                    if (+i % 2 === 0) {
                        assertTrue(subList.contains(i));
                    } else {
                        assertFalse(subList.contains(i));
                    }
                }
                subList.removeIf(ListDefaults.pEven);
                assertTrue(subList.isEmpty());
                // elements outside the view should remain
                CollectionAsserts.assertContents(list, listCopy);
            }
        }

        for (const test of supplier.get()) {
            const list = test.collection;
            this.trimmedSubList(list, (l) => {
                const copy = new ArrayList(l);
                l.removeIf(ListDefaults.pOdd);
                for (const i of l) {
                    assertTrue((+i % 2) === 0);
                }
                for (const i of copy) {
                    if (+i % 2 === 0) {
                        assertTrue(l.contains(i));
                    } else {
                        assertFalse(l.contains(i));
                    }
                }
            });
        }
    }

    @Test({ enabled: true })
    public testReplaceAll(): void {
        const scale = 3;
        const supplier = new CollectionSupplier<List<Integer>>(ListDefaults.LIST_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;

            try {
                list.replaceAll(null);
                Assert.fail("expected NPE not thrown");
            } catch (npe) {
                if (npe instanceof java.lang.NullPointerException) { /**/ } else {
                    throw npe;
                }
            }
            CollectionAsserts.assertContents(list, original);

            list.replaceAll((x) => { return new java.lang.Integer(scale * +x); });
            for (let i = 0; i < original.size(); i++) {
                assertTrue(+list.get(i) === (scale * +original.get(i)), "mismatch at index " + i);
            }

            if (original.size() > ListDefaults.SUBLIST_SIZE) {
                const subList = list.subList(ListDefaults.SUBLIST_FROM, ListDefaults.SUBLIST_TO);
                subList.replaceAll((x) => { return new java.lang.Integer(+x + 1); });
                // verify elements in view [from, to) were replaced
                for (let i = 0; i < ListDefaults.SUBLIST_SIZE; i++) {
                    assertTrue(+subList.get(i) === ((scale * +original.get(i + ListDefaults.SUBLIST_FROM)) + 1),
                        "mismatch at sublist index " + i);
                }
                // verify that elements [0, from) remain unmodified
                for (let i = 0; i < ListDefaults.SUBLIST_FROM; i++) {
                    assertTrue(+list.get(i) === (scale * +original.get(i)),
                        "mismatch at original index " + i);
                }
                // verify that elements [to, size) remain unmodified
                for (let i = ListDefaults.SUBLIST_TO; i < list.size(); i++) {
                    assertTrue(+list.get(i) === (scale * +original.get(i)),
                        "mismatch at original index " + i);
                }
            }
        }

        for (const test of supplier.get()) {
            const list = test.collection;
            this.trimmedSubList(list, (l) => {
                const copy = new ArrayList(l);
                const offset = 5;
                l.replaceAll((x) => { return new java.lang.Integer(offset + +x); });
                for (let i = 0; i < copy.size(); i++) {
                    assertTrue(+l.get(i) === (offset + +copy.get(i)), "mismatch at index " + i);
                }
            });
        }
    }

    @Test({ enabled: true })
    public testSort(): void {
        const supplier = new CollectionSupplier<List<Integer>>(ListDefaults.LIST_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const original = test.expected;
            const list = test.collection;
            CollectionSupplier.shuffle(list);
            list.sort((x: Integer, y: Integer) => { return java.lang.Integer.compare(x, y); });
            CollectionAsserts.assertSorted(list, (x: Integer, y: Integer) => { return java.lang.Integer.compare(x, y); });
            if (test.name.startsWith(S`reverse`)) {
                Collections.reverse(list);
            }
            CollectionAsserts.assertContents(list, original);

            CollectionSupplier.shuffle(list);
            list.sort(null);
            CollectionAsserts.assertSorted(list, java.util.Comparator.naturalOrder());
            if (test.name.startsWith(S`reverse`)) {
                Collections.reverse(list);
            }
            CollectionAsserts.assertContents(list, original);

            CollectionSupplier.shuffle(list);
            list.sort(java.util.Comparator.naturalOrder());
            CollectionAsserts.assertSorted(list, java.util.Comparator.naturalOrder());
            if (test.name.startsWith(S`reverse`)) {
                Collections.reverse(list);
            }
            CollectionAsserts.assertContents(list, original);

            CollectionSupplier.shuffle(list);
            list.sort(java.util.Comparator.reverseOrder());
            CollectionAsserts.assertSorted(list, java.util.Comparator.reverseOrder());
            if (!test.name.startsWith(S`reverse`)) {
                Collections.reverse(list);
            }
            CollectionAsserts.assertContents(list, original);

            CollectionSupplier.shuffle(list);
            list.sort(ListDefaults.BIT_COUNT_COMPARATOR);
            CollectionAsserts.assertSorted(list, ListDefaults.BIT_COUNT_COMPARATOR);
            // check sort by verifying that bitCount increases and never drops
            let minBitCount = 0;
            for (const i of list) {
                const bitCount = java.lang.Integer.bitCount(+i);
                assertTrue(bitCount >= minBitCount);
                minBitCount = bitCount;
            }

            // Reuse the supplier to store AtomicInteger instead of Integer
            // Hence the use of raw type and cast
            const incomparablesData = new ArrayList<AtomicInteger>();
            for (let i = 0; i < test.expected.size(); i++) {
                incomparablesData.add(new AtomicInteger(i));
            }
            const f = test.supplier;
            const incomparables = f(incomparablesData as unknown as List<Integer>) as unknown as List<AtomicInteger>;

            CollectionSupplier.shuffle(incomparables);
            incomparables.sort(ListDefaults.ATOMIC_INTEGER_COMPARATOR);
            for (let i = 0; i < test.expected.size(); i++) {
                assertEquals(i, incomparables.get(i));
            }

            if (original.size() > ListDefaults.SUBLIST_SIZE) {
                const copy = new ArrayList(list);
                const subList = list.subList(ListDefaults.SUBLIST_FROM, ListDefaults.SUBLIST_TO);
                CollectionSupplier.shuffle(subList);
                subList.sort(java.util.Comparator.naturalOrder());
                CollectionAsserts.assertSorted(subList, java.util.Comparator.naturalOrder());
                // verify that elements [0, from) remain unmodified
                for (let i = 0; i < ListDefaults.SUBLIST_FROM; i++) {
                    assertTrue(list.get(i) === copy.get(i),
                        "mismatch at index " + i);
                }
                // verify that elements [to, size) remain unmodified
                for (let i = ListDefaults.SUBLIST_TO; i < list.size(); i++) {
                    assertTrue(list.get(i) === copy.get(i),
                        "mismatch at index " + i);
                }
            }
        }

        for (const test of supplier.get()) {
            const list = test.collection;
            this.trimmedSubList(list, (l) => {
                CollectionSupplier.shuffle(l);
                l.sort(java.util.Comparator.naturalOrder());
                CollectionAsserts.assertSorted(l, java.util.Comparator.naturalOrder());
            });
        }
    }

    @Test({ enabled: true })
    public testForEachThrowsCME(): void {
        const supplier = new CollectionSupplier(ListDefaults.LIST_CME_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const list = test.collection;

            if (list.size() <= 1) {
                continue;
            }
            let gotException = false;
            try {
                // bad predicate that modifies its list, should throw CME
                list.forEach((x: Integer) => { list.add(x); });
            } catch (cme) {
                if (cme instanceof ConcurrentModificationException) {
                    gotException = true;
                } else {
                    throw cme;
                }
            }
            if (!gotException) {
                Assert.fail("expected CME was not thrown from " + test);
            }
        }
    }

    @Test({ enabled: true })
    public testRemoveIfThrowsCME(): void {
        const supplier = new CollectionSupplier(ListDefaults.LIST_CME_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const list = test.collection;

            if (list.size() <= 1) {
                continue;
            }
            let gotException = false;
            try {
                // bad predicate that modifies its list, should throw CME
                list.removeIf((x: Integer) => { return list.add(x); });
            } catch (cme) {
                if (cme instanceof ConcurrentModificationException) {
                    gotException = true;
                } else {
                    throw cme;
                }
            }
            if (!gotException) {
                Assert.fail("expected CME was not thrown from " + test);
            }
        }
    }

    @Test({ enabled: true })
    public testReplaceAllThrowsCME(): void {
        const supplier = new CollectionSupplier(ListDefaults.LIST_CME_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const list = test.collection;

            if (list.size() <= 1) {
                continue;
            }
            let gotException = false;
            try {
                // bad predicate that modifies its list, should throw CME
                list.replaceAll((x) => {
                    const n = new java.lang.Integer(3 * +x);
                    list.add(n);

                    return n;
                });
            } catch (cme) {
                if (cme instanceof ConcurrentModificationException) {
                    gotException = true;
                } else {
                    throw cme;
                }
            }
            if (!gotException) {
                Assert.fail("expected CME was not thrown from " + test);
            }
        }
    }

    @Test({ enabled: true })
    public testSortThrowsCME(): void {
        const supplier = new CollectionSupplier(ListDefaults.LIST_CME_SUPPLIERS, ListDefaults.SIZE);
        for (const test of supplier.get()) {
            const list = test.collection;

            if (list.size() <= 1) {
                continue;
            }
            let gotException = false;
            try {
                // bad predicate that modifies its list, should throw CME
                list.sort((x, y) => {
                    list.add(x);

                    return +x - +y;
                });
            } catch (cme) {
                if (cme instanceof ConcurrentModificationException) {
                    gotException = true;
                } else {
                    throw cme;
                }
            }
            if (!gotException) {
                Assert.fail("expected CME was not thrown from " + test);
            }
        }
    }

    @Test({ dataProvider: "shortIntListProvider", enabled: true })
    public testRemoveIfFromSlice(list: List<java.lang.Integer>): void {
        const sublist = list.subList(3, 6);
        assertTrue(sublist.removeIf((x) => { return +x === 4; }));
        CollectionAsserts.assertContents(list, ListDefaults.SLICED_EXPECTED);

        const sublist2 = list.subList(2, 5);
        assertTrue(sublist2.removeIf((x) => { return +x === 3; }));
        CollectionAsserts.assertContents(list, ListDefaults.SLICED_EXPECTED2);
    }

    // call the callback for each recursive subList
    private trimmedSubList(list: List<Integer>, callback: Consumer<List<Integer>>): void {
        const size = list.size();
        if (size > 1) {
            // trim 1 element from both ends
            const subList = list.subList(1, size - 1);
            callback(subList);
            this.trimmedSubList(subList, callback);
        }
    }

    // remove the first element
    private removeFirst(original: List<Integer>, list: List<Integer>, offset: AtomicInteger): void {
        const first = new AtomicBoolean(true);
        list.removeIf((x) => { return first.getAndSet(false); });

        CollectionAsserts.assertContents(original.subList(offset.getAndIncrement(), original.size()), list);
    }
}
