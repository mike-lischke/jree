/*
 * Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved.
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
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject, S, I } from "../../../../../src";
import { org } from "../../../../org/org";

type String = java.lang.String;
const String = java.lang.String;
const List = java.util.List;
type List<E> = java.util.List<E>;
const DataProvider = org.testng.annotations.DataProvider;
type Iterator<E> = java.util.Iterator<E>;
type Collections = java.util.Collections;
const Collections = java.util.Collections;
const asList = java.util.Arrays.asList;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
const Test = org.testng.annotations.Test;
type UnsupportedOperationException = java.lang.UnsupportedOperationException;
const UnsupportedOperationException = java.lang.UnsupportedOperationException;
const assertEquals = org.testng.Assert.assertEquals;
const assertNotSame = org.testng.Assert.assertNotSame;
type NullPointerException = java.lang.NullPointerException;
const NullPointerException = java.lang.NullPointerException;
const assertSame = org.testng.Assert.assertSame;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
const assertNotEquals = org.testng.Assert.assertNotEquals;
type ListIterator<E> = java.util.ListIterator<E>;
type ClassCastException = java.lang.ClassCastException;
const ClassCastException = java.lang.ClassCastException;

/*
 * @test
 * @bug 8048330 8203184
 * @summary Test convenience static factory methods on List.
 * @run testng ListFactories
 */

export class ListFactories extends JavaObject {

    protected static readonly NUM_STRINGS = 20; // should be larger than the largest fixed-arg overload
    protected static readonly stringArray: String[];

    // returns array of [actual, expected]
    protected static a(act: List<String>, exp: List<String>): java.lang.Object[] {
        return [act, exp];
    }

    @DataProvider({ name: "empty" })
    public empty(): Iterator<java.lang.Object[]> {
        return Collections.singletonList(
            ListFactories.a(List.of(), asList()),
        ).iterator();
    }

    @DataProvider({ name: "nonempty" })
    public nonempty(): Iterator<java.lang.Object[]> {
        return asList(
            ListFactories.a(List.of(S`a`),
                asList(S`a`)),
            ListFactories.a(List.of(S`a`, S`b`),
                asList(S`a`, S`b`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`),
                asList(S`a`, S`b`, S`c`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`),
                asList(S`a`, S`b`, S`c`, S`d`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`)),
            ListFactories.a(List.of(...ListFactories.stringArray),
                asList(ListFactories.stringArray)),
        ).iterator();
    }

    @DataProvider({ name: "sublists" })
    public sublists(): Iterator<java.lang.Object[]> {
        return asList(
            ListFactories.a(List.of<String>().subList(0, 0),
                asList()),
            ListFactories.a(List.of(S`a`).subList(0, 0),
                asList(S`a`).subList(0, 0)),
            ListFactories.a(List.of(S`a`, S`b`).subList(0, 1),
                asList(S`a`, S`b`).subList(0, 1)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`).subList(1, 3),
                asList(S`a`, S`b`, S`c`).subList(1, 3)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`).subList(0, 4),
                asList(S`a`, S`b`, S`c`, S`d`).subList(0, 4)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`).subList(0, 3),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`).subList(0, 3)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`).subList(3, 5),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`).subList(3, 5)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`).subList(0, 7),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`).subList(0, 7)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`).subList(0, 0),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`).subList(0, 0)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`).subList(4, 5),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`).subList(4, 5)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`).subList(1, 10),
                asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`).subList(1, 10)),

            ListFactories.a(List.of(...ListFactories.stringArray).subList(5, ListFactories.NUM_STRINGS),
                asList(Arrays.copyOfRange(ListFactories.stringArray, 5, ListFactories.NUM_STRINGS))),
        ).iterator();
    }

    @DataProvider({ name: "all" })
    public all(): Iterator<java.lang.Object[]> {
        const all = new ArrayList<java.lang.Object[]>();
        this.empty().forEachRemaining((x) => { return all.add(x); });
        this.nonempty().forEachRemaining((x) => { return all.add(x); });
        this.sublists().forEachRemaining((x) => { return all.add(x); });

        return all.iterator();
    }

    @DataProvider({ name: "nonsublists" })
    public nonsublists(): Iterator<java.lang.Object[]> {
        const all = new ArrayList<java.lang.Object[]>();
        this.empty().forEachRemaining((x) => { return all.add(x); });
        this.nonempty().forEachRemaining((x) => { return all.add(x); });

        return all.iterator();
    }

    @Test({ dataProvider: "all", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotAddLast(act: List<String>, exp: List<String>): void {
        act.add(S`x`);
    }

    @Test({ dataProvider: "all", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotAddFirst(act: List<String>, exp: List<String>): void {
        act.add(0, S`x`);
    }

    @Test({ dataProvider: "nonempty", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotRemove(act: List<String>, exp: List<String>): void {
        act.remove(0);
    }

    @Test({ dataProvider: "nonempty", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotSet(act: List<String>, exp: List<String>): void {
        act.set(0, S`x`);
    }

    @Test({ dataProvider: "all", enabled: true })
    public contentsMatch(act: List<String>, exp: List<String>): void {
        assertEquals(act, exp);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed1(): void {
        List.of(null as never); // force one-arg overload
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed2a(): void {
        List.of(S`a`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed2b(): void {
        List.of(null, S`b`);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed3(): void {
        List.of(S`a`, S`b`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed4(): void {
        List.of(S`a`, S`b`, S`c`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed5(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed6(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed7(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed8(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed9(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowed10(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullDisallowedN(): void {
        const array = ListFactories.stringArray.slice();
        array[0] = null as never;
        List.of(array);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public nullArrayDisallowed(): void {
        List.of(null as never);
    }

    @Test
    public ensureArrayCannotModifyList(): void {
        const array = ListFactories.stringArray.slice();
        const list = List.of(array);
        array[0] = S`xyzzy`;
        assertEquals(list, Arrays.asList(ListFactories.stringArray));
    }

    @Test({ dataProvider: "all", expectedExceptions: [NullPointerException], enabled: true })
    public containsNullShouldThrowNPE(act: List<String>, exp: List<String>): void {
        act.contains(null as never);
    }

    @Test({ dataProvider: "all", expectedExceptions: [NullPointerException], enabled: true })
    public indexOfNullShouldThrowNPE(act: List<String>, exp: List<String>): void {
        act.indexOf(null as never);
    }

    @Test({ dataProvider: "all", expectedExceptions: [NullPointerException], enabled: true })
    public lastIndexOfNullShouldThrowNPE(act: List<String>, exp: List<String>): void {
        act.lastIndexOf(null as never);
    }

    @Test
    public copyOfResultsEqual(): void {
        const orig = this.genList();
        const copy = List.copyOf(orig);

        assertEquals(orig, copy);
        assertEquals(copy, orig);
    }

    @Test
    public copyOfModifiedUnequal(): void {
        const orig = this.genList();
        const copy = List.copyOf(orig);
        orig.add(I`4`);

        assertNotEquals(orig, copy);
        assertNotEquals(copy, orig);
    }

    @Test
    public copyOfIdentity(): void {
        const orig = this.genList();
        const copy1 = List.copyOf(orig);
        const copy2 = List.copyOf(copy1);

        assertNotSame(orig, copy1);
        assertSame(copy1, copy2);
    }

    @Test
    public copyOfSubList(): void {
        const orig = List.of(0, 1, 2, 3);
        const sub = orig.subList(0, 3);
        const copy = List.copyOf(sub);

        assertNotSame(sub, copy);
    }

    @Test
    public copyOfSubSubList(): void {
        const orig = List.of(0, 1, 2, 3);
        const sub = orig.subList(0, 3).subList(0, 2);
        const copy = List.copyOf(sub);

        assertNotSame(sub, copy);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public copyOfRejectsNullCollection(): void {
        List.copyOf(null);
    }

    @Test({ expectedExceptions: [NullPointerException], enabled: true })
    public copyOfRejectsNullElements(): void {
        List.copyOf(Arrays.asList(1, null, 3));
    }

    @Test
    public iteratorShouldNotBeListIterator(): void {
        const list = List.of<java.lang.Integer>(I`1`, I`2`, I`3`, I`4`, I`5`);
        const it = list.iterator();
        it.next();
        try {
            (it as ListIterator<Integer>).previous();
            fail("ListIterator operation succeeded on Iterator");
        } catch (ignore) {
            if (ignore instanceof ClassCastException || ignore instanceof UnsupportedOperationException) { /**/ } else {
                throw ignore;
            }
        }
    }

    protected genList(): List<Integer> {
        return new ArrayList(Arrays.asList(I`1`, I`2`, I`3`));
    }

    static {
        const sa = new Array<String>(ListFactories.NUM_STRINGS);
        for (let i = 0; i < ListFactories.NUM_STRINGS; i++) {
            sa[i] = java.lang.String.valueOf(String.fromCharCode("a".charCodeAt(0) + i));
        }

        // @ts-ignore
        ListFactories.stringArray = sa;
    }
}
