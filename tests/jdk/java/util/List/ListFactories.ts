/* java2ts: keep */

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

import { Integer } from "../../../../../src/java/lang/Integer.js";
import { NullPointerException } from "../../../../../src/java/lang/NullPointerException.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { UnsupportedOperationException } from "../../../../../src/java/lang/UnsupportedOperationException.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { Arrays } from "../../../../../src/java/util/Arrays.js";
import { Collections } from "../../../../../src/java/util/Collections.js";
import { JavaIterator } from "../../../../../src/java/util/Iterator.js";
import { List } from "../../../../../src/java/util/List.js";
import { ListIterator } from "../../../../../src/java/util/ListIterator.js";
import { I, S } from "../../../../../src/templates.js";
import { org } from "../../../../index.js";

const DataProvider = org.testng.annotations.DataProvider;
const Test = org.testng.annotations.Test;
const assertEquals = org.testng.Assert.assertEquals;
const assertNotSame = org.testng.Assert.assertNotSame;
const assertSame = org.testng.Assert.assertSame;
const assertNotEquals = org.testng.Assert.assertNotEquals;

/*
 * @test
 * @bug 8048330 8203184
 * @summary Test convenience static factory methods on List.
 * @run testng ListFactories
 */

export class ListFactories extends JavaObject {

    protected static readonly NUM_STRINGS = 20; // should be larger than the largest fixed-arg overload
    protected static readonly stringArray: JavaString[];

    // returns array of [actual, expected]
    protected static a(act: List<JavaString>, exp: List<JavaString>): JavaObject[] {
        return [act, exp];
    }

    @DataProvider({ name: "empty" })
    public empty(): JavaIterator<JavaObject[]> {
        return Collections.singletonList(
            ListFactories.a(List.of(), Arrays.asList()),
        ).iterator();
    }

    @DataProvider({ name: "nonempty" })
    public nonempty(): JavaIterator<JavaObject[]> {
        return Arrays.asList(
            ListFactories.a(List.of(S`a`),
                Arrays.asList(S`a`)),
            ListFactories.a(List.of(S`a`, S`b`),
                Arrays.asList(S`a`, S`b`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`),
                Arrays.asList(S`a`, S`b`, S`c`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`)),
            ListFactories.a(List.of(...ListFactories.stringArray),
                Arrays.asList(ListFactories.stringArray)),
        ).iterator();
    }

    @DataProvider({ name: "sublists" })
    public sublists(): JavaIterator<JavaObject[]> {
        return Arrays.asList(
            ListFactories.a(List.of<JavaString>().subList(0, 0),
                Arrays.asList()),
            ListFactories.a(List.of(S`a`).subList(0, 0),
                Arrays.asList(S`a`).subList(0, 0)),
            ListFactories.a(List.of(S`a`, S`b`).subList(0, 1),
                Arrays.asList(S`a`, S`b`).subList(0, 1)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`).subList(1, 3),
                Arrays.asList(S`a`, S`b`, S`c`).subList(1, 3)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`).subList(0, 4),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`).subList(0, 4)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`).subList(0, 3),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`).subList(0, 3)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`).subList(3, 5),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`).subList(3, 5)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`).subList(0, 7),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`).subList(0, 7)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`).subList(0, 0),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`).subList(0, 0)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`).subList(4, 5),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`).subList(4, 5)),
            ListFactories.a(List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`).subList(1, 10),
                Arrays.asList(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, S`j`).subList(1, 10)),

            ListFactories.a(List.of(...ListFactories.stringArray).subList(5, ListFactories.NUM_STRINGS),
                Arrays.asList(Arrays.copyOfRange(ListFactories.stringArray, 5, ListFactories.NUM_STRINGS))),
        ).iterator();
    }

    @DataProvider({ name: "all" })
    public all(): JavaIterator<JavaObject[]> {
        const all = new ArrayList<JavaObject[]>();
        this.empty().forEachRemaining((x) => { return all.add(x); });
        this.nonempty().forEachRemaining((x) => { return all.add(x); });
        this.sublists().forEachRemaining((x) => { return all.add(x); });

        return all.iterator();
    }

    @DataProvider({ name: "nonsublists" })
    public nonsublists(): JavaIterator<JavaObject[]> {
        const all = new ArrayList<JavaObject[]>();
        this.empty().forEachRemaining((x) => { return all.add(x); });
        this.nonempty().forEachRemaining((x) => { return all.add(x); });

        return all.iterator();
    }

    @Test({ dataProvider: "all", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotAddLast(act: List<JavaString>, exp: List<JavaString>): void {
        act.add(S`x`);
    }

    @Test({ dataProvider: "all", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotAddFirst(act: List<JavaString>, exp: List<JavaString>): void {
        act.add(0, S`x`);
    }

    @Test({ dataProvider: "nonempty", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotRemove(act: List<JavaString>, exp: List<JavaString>): void {
        act.remove(0);
    }

    @Test({ dataProvider: "nonempty", expectedExceptions: [UnsupportedOperationException], enabled: true })
    public cannotSet(act: List<JavaString>, exp: List<JavaString>): void {
        act.set(0, S`x`);
    }

    @Test({ dataProvider: "all", enabled: true })
    public contentsMatch(act: List<JavaString>, exp: List<JavaString>): void {
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
    public containsNullShouldThrowNPE(act: List<JavaString>, exp: List<JavaString>): void {
        act.contains(null as never);
    }

    @Test({ dataProvider: "all", expectedExceptions: [NullPointerException], enabled: true })
    public indexOfNullShouldThrowNPE(act: List<JavaString>, exp: List<JavaString>): void {
        act.indexOf(null as never);
    }

    @Test({ dataProvider: "all", expectedExceptions: [NullPointerException], enabled: true })
    public lastIndexOfNullShouldThrowNPE(act: List<JavaString>, exp: List<JavaString>): void {
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
        const list = List.of<Integer>(I`1`, I`2`, I`3`, I`4`, I`5`);
        const it = list.iterator();
        it.next();
        try {
            (it as ListIterator<Integer>).previous();
            fail("ListIterator operation succeeded on Iterator");
        } catch (ignore) {
            if (ignore instanceof TypeError) { /**/ } else {
                throw ignore;
            }
        }
    }

    protected genList(): List<Integer> {
        return new ArrayList(Arrays.asList(I`1`, I`2`, I`3`));
    }

    static {
        const sa = new Array<JavaString>(ListFactories.NUM_STRINGS);
        for (let i = 0; i < ListFactories.NUM_STRINGS; i++) {
            sa[i] = JavaString.valueOf(String.fromCharCode("a".charCodeAt(0) + i));
        }

        // @ts-ignore
        ListFactories.stringArray = sa;
    }
}
