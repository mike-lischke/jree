/* java2ts: keep */

/*
 * Copyright (c) 2012, 2013, Oracle and/or its affiliates. All rights reserved.
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

import { java, JavaObject, int, S } from "../../../../../../src";
import { org } from "../../../../..";

const ArrayList = java.util.ArrayList;
type ArrayList<E> = java.util.ArrayList<E>;
const Arrays = java.util.Arrays;
type Arrays = java.util.Arrays;
type Comparator<T> = java.util.Comparator<T>;
const HashSet = java.util.HashSet;
type HashSet<E> = java.util.HashSet<E>;
type Iterator<T> = java.util.Iterator<T>;
const Objects = java.util.Objects;
type Objects = java.util.Objects;
const assertEquals = org.testng.Assert.assertEquals;
const assertTrue = org.testng.Assert.assertTrue;
const fail = org.testng.Assert.fail;

/**
 * CollectionAssert -- assertion methods for lambda test cases
 */
export class CollectionAsserts extends JavaObject {

    private constructor() {
        // no instances
        super();
    }

    public static assertCountSum(it: java.lang.Iterable<java.lang.Integer> | Iterator<java.lang.Integer>, count: int,
        sum: int): void {

        if (it instanceof java.lang.Iterable) {
            it = it.iterator();
        }

        let c = 0;
        let s = 0;
        while (it.hasNext()) {
            const i = it.next();
            c++;
            s += i.valueOf();
        }

        assertEquals(c, count);
        assertEquals(s, sum);
    }

    public static assertConcat(it: Iterator<java.lang.Character>, result: java.lang.String): void {
        const sb = new java.lang.StringBuilder();
        while (it.hasNext()) {
            sb.append(it.next());
        }

        assertEquals(result, sb.toString());
    }

    public static assertSorted<T extends java.lang.Comparable<T>>(i: Iterator<T>): void;
    public static assertSorted<T extends java.lang.Comparable<T>>(iter: java.lang.Iterable<T>): void;
    public static assertSorted<T>(i: Iterator<T>, comp: Comparator<T>): void;
    public static assertSorted<T>(iter: java.lang.Iterable<T>, comp: Comparator<T>): void;
    public static assertSorted<T extends java.lang.Comparable<T>>(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                let [it] = args as [Iterator<T> | java.lang.Iterable<T>];
                if (it instanceof java.lang.Iterable) {
                    it = it.iterator();
                }

                if (!it.hasNext()) {
                    return;
                }

                let last = it.next();
                while (it.hasNext()) {
                    const t = it.next();
                    assertTrue(last.compareTo(t) <= 0);
                    assertTrue(t.compareTo(last) >= 0);
                    last = t;
                }

                break;
            }

            case 2: {
                let [it, comp] = args as [Iterator<T> | java.lang.Iterable<T>, Comparator<T>];
                if (it instanceof java.lang.Iterable) {
                    it = it.iterator();
                }
                if (!it.hasNext()) {

                    return;
                }

                let last = it.next();
                while (it.hasNext()) {
                    const t = it.next();
                    assertTrue(comp(last, t) <= 0);
                    assertTrue(comp(t, last) >= 0);
                    last = t;
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public static assertUnique<T>(iter: java.lang.Iterable<T>): void;
    public static assertUnique<T>(iter: Iterator<T>): void;
    public static assertUnique<T>(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                let [it] = args as [java.lang.Iterable<T> | Iterator<T>];

                if (it instanceof java.lang.Iterable) {
                    it = it.iterator();
                }

                if (!it.hasNext()) {
                    return;
                }

                const uniq = new HashSet();
                while (it.hasNext()) {
                    const each = it.next();
                    assertTrue(!uniq.contains(each));
                    uniq.add(each);
                }

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public static assertContents<T>(actual: java.lang.Iterable<T>, expected: java.lang.Iterable<T>): void;
    public static assertContents<T>(actual: Iterator<T>, expected: Iterator<T>): void;
    public static assertContents<T>(actual: Iterator<T>, ...expected: T[]): void;
    public static assertContents<T>(actual: java.lang.Iterable<T>, expected: java.lang.Iterable<T>,
        msg: java.lang.String | null): void;
    public static assertContents<T>(actual: Iterator<T>, expected: Iterator<T>, msg: java.lang.String | null): void;
    public static assertContents<T>(...args: unknown[]): void {
        let msg: java.lang.String | null = null;
        if (args.length > 1) {
            let [actual, expected] =
                args as [java.lang.Iterable<T> | Iterator<T>, java.lang.Iterable<T> | Iterator<T>];

            if (actual instanceof java.lang.Iterable) {
                actual = actual.iterator();
            }
            if (expected instanceof java.lang.Iterable) {
                expected = expected.iterator();
            } else if (Array.isArray(expected)) {
                expected = Arrays.asList(expected).iterator();
            }

            if (args.length === 3) {
                msg = args[2] as java.lang.String;
            }

            const history = new ArrayList();
            while (expected.hasNext()) {
                if (!actual.hasNext()) {
                    const expectedData = new ArrayList(history);
                    while (expected.hasNext()) { expectedData.add(expected.next()); }
                    fail(`${msg === null ? "" : msg} Premature end of data; expected=${expectedData}, ` +
                        `found=${history}`);
                }

                const a = actual.next();
                const e = expected.next();
                history.add(a);

                if (!Objects.equals(a, e)) {
                    fail(`${msg === null ? "" : msg} Data mismatch; preceding=${history}, nextExpected=${e}, ` +
                        `nextFound=${a}`);
                }

            }

            if (actual.hasNext()) {
                const rest = new ArrayList();
                while (actual.hasNext()) { rest.add(actual.next()); }
                fail(`${msg === null ? "" : msg} Unexpected data ${rest} after ${history}`);
            }
        }
    }

    public static assertContentsUnordered<T extends java.lang.Comparable<T>>(actual: java.lang.Iterable<T>,
        expected: java.lang.Iterable<T>): void;
    public static assertContentsUnordered<T extends java.lang.Comparable<T>>(actual: java.lang.Iterable<T>,
        expected: java.lang.Iterable<T>, msg: java.lang.String | null): void;
    public static assertContentsUnordered<T extends java.lang.Comparable<T>>(...args: unknown[]): void {
        switch (args.length) {
            case 2: {
                const [actual, expected] = args as [java.lang.Iterable<T>, java.lang.Iterable<T>];

                CollectionAsserts.assertContentsUnordered(actual, expected, null);

                break;
            }

            case 3: {
                const [actual, expected, msg] =
                    args as [java.lang.Iterable<T>, java.lang.Iterable<T>, java.lang.String];

                const allExpected = new ArrayList();
                for (const t of expected) {
                    allExpected.add(t);
                }

                for (const t of actual) {
                    assertTrue(allExpected.remove(t), msg + " element '" + java.lang.String.valueOf(t) + "' not found");
                }

                assertTrue(allExpected.isEmpty(), msg + "expected contained additional elements");

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    protected static assertSplitContents<T extends JavaObject>(splits: java.lang.Iterable<java.lang.Iterable<T>>,
        list: java.lang.Iterable<T>): void {
        const mI = splits.iterator();
        let pI = null;
        const lI = list.iterator();

        while (lI.hasNext()) {
            if (pI === null) {

                pI = mI.next().iterator();
            }

            while (!pI.hasNext()) {
                if (!mI.hasNext()) {
                    break;
                }
                else {
                    pI = mI.next().iterator();
                }
            }
            assertTrue(pI.hasNext());
            const pT = pI.next();
            const lT = lI.next();
            assertEquals(pT, lT);
        }

        if (pI !== null) {
            assertTrue(!pI.hasNext());
        }

        while (mI.hasNext()) {
            pI = mI.next().iterator();
            assertTrue(!pI.hasNext());
        }
    }
}
