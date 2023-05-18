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
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { java, JavaObject, I, S } from "../../../../../src";
import { org } from "../../../../org/org";

const ArrayList = java.util.ArrayList;
type ArrayList<E> = java.util.ArrayList<E>;
const Arrays = java.util.Arrays;
type Arrays = java.util.Arrays;
const Collections = java.util.Collections;
type Collections = java.util.Collections;
type Iterator<T> = java.util.Iterator<T>;
type List<E> = java.util.List<E>;
const List = java.util.List;
type ListIterator<E> = java.util.ListIterator<E>;
const asList = java.util.Arrays.asList;
const assertEquals = org.testng.Assert.assertEquals;
const assertNotEquals = org.testng.Assert.assertNotEquals;
const assertNotSame = org.testng.Assert.assertNotSame;
const assertSame = org.testng.Assert.assertSame;
const fail = org.testng.Assert.fail;

/*
 * @test
 * @bug 8048330 8203184
 * @summary Test convenience static factory methods on List.
 * @run testng ListFactories
 */

export class ListFactories extends JavaObject {

    protected static readonly NUM_STRINGS = 20; // should be larger than the largest fixed-arg overload
    protected static readonly stringArray: java.lang.String[];

    // returns array of [actual, expected]
    protected static a(act: List<java.lang.String>, exp: List<java.lang.String>): java.lang.Object[] {
        return [act, exp];
    }

    /*protected static serialClone<T>(obj: T): T {
        try {
            let baos = new ByteArrayOutputStream();
            {
                // This holds the final error to throw (if any).
                let error: java.lang.Throwable | undefined;

                const oos: ObjectOutputStream = new ObjectOutputStream(baos);
                try {
                    try {
                        oos.writeObject(obj);
                    }
                    finally {
                        error = closeResources([oos]);
                    }
                } catch (e) {
                    error = handleResourceError(e, error);
                } finally {
                    throwResourceError(error);
                }
            }

            let bais = new ByteArrayInputStream(baos.toByteArray());
            let ois = new ObjectInputStream(bais);
            return ois.readObject() as T;
        } catch (e) {
            if (e instanceof IOException || e instanceof java.lang.ClassNotFoundException) {
                throw new java.lang.AssertionError(e);
            } else {
                throw e;
            }
        }
    } */

    public empty(): Iterator<java.lang.Object[]> {
        return Collections.singletonList(
            ListFactories.a(List.of(), asList()),
        ).iterator();
    }

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

    public sublists(): Iterator<java.lang.Object[]> {
        return asList(
            ListFactories.a(List.of<java.lang.String>().subList(0, 0),
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

    public all(): Iterator<java.lang.Object[]> {
        const all = new ArrayList<java.lang.Object[]>();
        this.empty().forEachRemaining(all.add.bind(all));
        this.nonempty().forEachRemaining(all.add.bind(all));
        this.sublists().forEachRemaining(all.add.bind(all));

        return all.iterator();
    }

    public nonsublists(): Iterator<java.lang.Object[]> {
        const all = new ArrayList<java.lang.Object[]>();
        this.empty().forEachRemaining(all.add.bind(all));
        this.nonempty().forEachRemaining(all.add.bind(all));

        return all.iterator();
    }

    public cannotAddLast(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.add(S`x`);
    }

    public cannotAddFirst(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.add(0, S`x`);
    }

    public cannotRemove(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.remove(0);
    }

    public cannotSet(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.set(0, S`x`);
    }

    public contentsMatch(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        assertEquals(act, exp);
    }

    public nullDisallowed1(): void {
        List.of(null as unknown as java.lang.Object); // force one-arg overload
    }

    public nullDisallowed2a(): void {
        List.of(S`a`, null);
    }

    public nullDisallowed2b(): void {
        List.of(null, S`b`);
    }

    public nullDisallowed3(): void {
        List.of(S`a`, S`b`, null);
    }

    public nullDisallowed4(): void {
        List.of(S`a`, S`b`, S`c`, null);
    }

    public nullDisallowed5(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, null);
    }

    public nullDisallowed6(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, null);
    }

    public nullDisallowed7(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, null);
    }

    public nullDisallowed8(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, null);
    }

    public nullDisallowed9(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, null);
    }

    public nullDisallowed10(): void {
        List.of(S`a`, S`b`, S`c`, S`d`, S`e`, S`f`, S`g`, S`h`, S`i`, null);
    }

    public nullDisallowedN(): void {
        const array = ListFactories.stringArray.slice();
        array[0] = null as unknown as java.lang.String;
        List.of(array);
    }

    public nullArrayDisallowed(): void {
        List.of(null as unknown as java.lang.Object[]);
    }

    public ensureArrayCannotModifyList(): void {
        const array = ListFactories.stringArray.slice();
        const list = List.of(array);
        array[0] = S`xyzzy`;
        assertEquals(list, Arrays.asList(ListFactories.stringArray));
    }

    public containsNullShouldThrowNPE(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        // Forcing a null in TS where no null is allowed.
        act.contains(null as unknown as java.lang.String);
    }

    public indexOfNullShouldThrowNPE(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.indexOf(null as unknown as java.lang.String);
    }

    public lastIndexOfNullShouldThrowNPE(act: List<java.lang.String>, exp: List<java.lang.String>): void {
        act.lastIndexOf(null as unknown as java.lang.String);
    }

    public copyOfResultsEqual(): void {
        const orig = this.genList();
        const copy = List.copyOf(orig);

        assertEquals(orig, copy);
        assertEquals(copy, orig);
    }

    public copyOfModifiedUnequal(): void {
        const orig = this.genList();
        const copy = List.copyOf(orig);
        orig.add(I`4`);

        assertNotEquals(orig, copy);
        assertNotEquals(copy, orig);
    }

    public copyOfIdentity(): void {
        const orig = this.genList();
        const copy1 = List.copyOf(orig);
        const copy2 = List.copyOf(copy1);

        assertNotSame(orig, copy1);
        assertSame(copy1, copy2);
    }

    public copyOfSubList(): void {
        const orig = List.of(0, 1, 2, 3);
        const sub = orig.subList(0, 3);
        const copy = List.copyOf(sub);

        assertNotSame(sub, copy);
    }

    public copyOfSubSubList(): void {
        const orig = List.of(0, 1, 2, 3);
        const sub = orig.subList(0, 3).subList(0, 2);
        const copy = List.copyOf(sub);

        assertNotSame(sub, copy);
    }

    public copyOfRejectsNullCollection(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const list = List.copyOf(null);
    }

    public copyOfRejectsNullElements(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const list = List.copyOf(Arrays.asList(1, null, 3));
    }

    public iteratorShouldNotBeListIterator(): void {
        const list = List.of<java.lang.Integer>(I`1`, I`2`, I`3`, I`4`, I`5`);
        const it = list.iterator();
        it.next();
        try {
            (it as ListIterator<java.lang.Integer>).previous();
            fail("ListIterator operation succeeded on Iterator");
        } catch (ignore) {
            if (ignore instanceof java.lang.ClassCastException || ignore instanceof java.lang.UnsupportedOperationException) {
                /* */
            } else {
                throw ignore;
            }
        }
    }

    protected genList(): List<java.lang.Integer> {
        return new ArrayList(Arrays.asList(I`1`, I`2`, I`3`));
    }

    static {
        const sa = new Array<java.lang.String>(ListFactories.NUM_STRINGS);
        for (let i = 0; i < ListFactories.NUM_STRINGS; i++) {
            sa[i] = java.lang.String.valueOf(String.fromCharCode("a".charCodeAt(0) + i));
        }

        // @ts-ignore
        ListFactories.stringArray = sa;
    }
}
