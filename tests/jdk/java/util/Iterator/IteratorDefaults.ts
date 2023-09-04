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

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject, type int, type long } from "../../../../../src";
import { org } from "../../../../org/org";

const Test = org.testng.annotations.Test;
type List<E> = java.util.List<E>;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type Iterator<E> = java.util.Iterator<E>;
type UnsupportedOperationException = java.lang.UnsupportedOperationException;
const UnsupportedOperationException = java.lang.UnsupportedOperationException;
const assertTrue = org.testng.Assert.assertTrue;
type Arrays = java.util.Arrays;
const Arrays = java.util.Arrays;
type String = java.lang.String;
const String = java.lang.String;
type Iterable<T> = java.lang.Iterable<T>;
type Class<T> = java.lang.Class<T>;
const Class = java.lang.Class;
type Collection<E> = java.util.Collection<E>;
type ArrayList<E> = java.util.ArrayList<E>;
const ArrayList = java.util.ArrayList;
const assertEquals = org.testng.Assert.assertEquals;
type ListIterator<E> = java.util.ListIterator<E>;
const assertFalse = org.testng.Assert.assertFalse;
type NoSuchElementException = java.util.NoSuchElementException;
const NoSuchElementException = java.util.NoSuchElementException;
type Constructor<T> = java.lang.reflect.Constructor<T>;
const Constructor = java.lang.reflect.Constructor;
type Collections = java.util.Collections;
const Collections = java.util.Collections;
type System = java.lang.System;
const System = java.lang.System;

/**
 * @test
 * @run testng IteratorDefaults
 * @summary test extension methods on Iterator
 */
export class IteratorDefaults extends JavaObject {

    public static IteratorWithRemove = class IteratorWithRemove extends JavaObject implements Iterator {

        public removed: boolean;

        protected constructor() {
            super();
            this.removed = false;
        }

        @Override
        public hasNext(): boolean {
            return false;
        }

        @Override
        public next(): java.lang.Object {
            return null;
        }

        @Override
        public remove(): void {
            this.removed = true;
        }
    };

    public testRemoveUnsupported(): void {
        const iterator = new class extends Iterator {
            @Override
            public hasNext(): boolean {
                return false;
            }
            @Override
            public next(): java.lang.Object {
                return null;
            }
        }();

        try {
            iterator.remove();
            fail("expected UnsupportedOperationException from remove not thrown");
        } catch (ignore) {
            if (ignore instanceof UnsupportedOperationException) {
            } else {
                throw ignore;
            }
        }
    }

    public testRemoveOverride(): void {
        const iterator = new IteratorDefaults.IteratorWithRemove();
        iterator.remove();
        assertTrue(iterator.removed);
    }

    public testForEach(): void {
        const data = new Array<Integer>(1000);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        const source = Arrays.asList(data);

        const iterableCollectionClasses = [
            "java.util.ArrayDeque",
            "java.util.ArrayList",
            "java.util.HashSet",
            "java.util.LinkedHashSet",
            "java.util.LinkedList",
            "java.util.PriorityQueue",
            "java.util.TreeSet",
            "java.util.Vector",
            "java.util.concurrent.ConcurrentLinkedDeque",
            "java.util.concurrent.ConcurrentLinkedQueue",
            "java.util.concurrent.ConcurrentSkipListSet",
            "java.util.concurrent.CopyOnWriteArrayList",
            "java.util.concurrent.CopyOnWriteArraySet",
            "java.util.concurrent.LinkedBlockingDeque",
            "java.util.concurrent.LinkedBlockingQueue",
            "java.util.concurrent.LinkedTransferQueue",
            "java.util.concurrent.PriorityBlockingQueue",
        ];

        for (const iterableClass of iterableCollectionClasses) {
            const iterable =
                Class.forName(iterableClass).newInstance() as Iterable<Integer>;
            (iterable as Collection<Integer>).addAll(source);
            const iterator = iterable.iterator();
            const target = new ArrayList(source.size());
            iterator.forEachRemaining(target.add);
            if ("java.util.HashSet".equals(iterableClass)) {
                target.sort((x, y) => { return x - y; });
                assertEquals(target, source);
            } else {
                assertEquals(target, source);
            }

            // verify that for an iterator that has been advanced via next(),
            // forEach starts from the current location, not zero
            const OFFSET = 5;
            const reference2 = new ArrayList(source).subList(OFFSET, source.size());
            const removed2 = new ArrayList(OFFSET);
            const iterator2 = iterable.iterator();
            for (let i = 0; i < OFFSET; i++) {
                // advance the iterator by OFFSET, saving iterated elements
                removed2.add(iterator2.next());
            }
            const target2 = new ArrayList(reference2.size());
            iterator2.forEachRemaining(target2.add);
            if ("java.util.HashSet".equals(iterableClass)) {
                assertEquals(target2.size(), reference2.size());
                target2.addAll(removed2);
                target2.sort((x, y) => { return x - y; });
                assertEquals(target2, source);
                assertEquals(target2.subList(OFFSET, source.size()), reference2);
            } else {
                assertEquals(target2, reference2);
            }
        }
    }

    public testForEachSubList(): void {
        const data = new Array<Integer>(100);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        const source = Arrays.asList(data);
        const listClasses = [
            "java.util.ArrayList",
            "java.util.LinkedList",
            "java.util.Vector",
            "java.util.concurrent.CopyOnWriteArrayList",
        ];
        for (const listClass of listClasses) {
            const list =
                Class.forName(listClass).newInstance() as List<Integer>;
            list.addAll(source);
            this.trimmedSubList(list, new class extends JavaObject implements IteratorDefaults.Callback {
                @Override
                public call(/* final */  list: List<Integer>): void {
                    if (list.size() < 1) {
                        return;
                    }
                    const target = new ArrayList(list.size());
                    const iterator = list.listIterator();
                    assertTrue(iterator.hasNext());
                    assertFalse(iterator.hasPrevious());
                    assertEquals(iterator.nextIndex(), 0);
                    assertEquals(iterator.previousIndex(), -1);

                    iterator.forEachRemaining(target.add);
                    assertEquals(target, list);

                    assertFalse(iterator.hasNext());
                    assertTrue(iterator.hasPrevious());
                    assertEquals(iterator.nextIndex(), list.size());
                    assertEquals(iterator.previousIndex(), list.size() - 1);

                    try {
                        iterator.next();
                        fail(listClass + " iterator advanced beyond end");
                    } catch (ignore) {
                        if (ignore instanceof NoSuchElementException) {
                        } else {
                            throw ignore;
                        }
                    }
                }
            }());
        }
    }

    public testOptimizedForEach(): void {
        const data = new Array<Integer>(1000 * 1000);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        const source = Arrays.asList(data);

        const listClasses = [
            "java.util.ArrayList",
            "java.util.LinkedList",
            "java.util.Vector",
            "java.util.concurrent.CopyOnWriteArrayList",
        ];

        const OFFSET = 3;
        const target = new ArrayList(source);
        for (const listClass of listClasses) {
            const list =
                Class.forName(listClass).newInstance() as List<Integer>;
            list.addAll(source);
            const iterator = list.listIterator();
            assertFalse(iterator.hasPrevious());
            for (let i = 0; i < OFFSET; i++) {
                iterator.next();
            }
            assertTrue(iterator.hasNext());
            assertTrue(iterator.hasPrevious());
            assertEquals(iterator.nextIndex(), OFFSET);
            assertEquals(iterator.previousIndex(), OFFSET - 1);

            iterator.forEachRemaining((e) => {
                target.set(e, e + 1);
            });
            for (let i = OFFSET; i < data.length; i++) {
                assertEquals(target.get(i).intValue(), source.get(i) + 1);
            }

            assertFalse(iterator.hasNext());
            assertTrue(iterator.hasPrevious());
            assertEquals(iterator.nextIndex(), data.length);
            assertEquals(iterator.previousIndex(), data.length - 1);

            // CopyOnWriteArrayList.listIterator().remove() is unsupported
            if (!"java.util.concurrent.CopyOnWriteArrayList".equals(listClass)) {
                for (let i = data.length - 1; i >= 0; i--) {
                    iterator.remove(); // must not throw
                    if (i > 0) {
                        iterator.previous();
                    }
                }
                assertTrue(list.isEmpty());
            }

            try {
                iterator.next();
                fail(listClass + " iterator advanced beyond end");
            } catch (ignore) {
                if (ignore instanceof NoSuchElementException) {
                } else {
                    throw ignore;
                }
            }
        }
    }

    @Test({ enabled: false })
    public compareForEachPerformance(): void {
        const data = new Array<Integer>(1000 * 100);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        const source = Arrays.asList(data);

        const iterableCollectionClasses = [
            "java.util.ArrayList", // warmup, results discarded
            "java.util.ArrayDeque",
            "java.util.ArrayList",
            "java.util.HashSet",
            "java.util.LinkedHashSet",
            "java.util.LinkedList",
            "java.util.PriorityQueue",
            "java.util.TreeSet",
            "java.util.Vector",
            "java.util.concurrent.ConcurrentLinkedDeque",
            "java.util.concurrent.ConcurrentLinkedQueue",
            "java.util.concurrent.ConcurrentSkipListSet",
            "java.util.concurrent.CopyOnWriteArrayList",
            "java.util.concurrent.CopyOnWriteArraySet",
            "java.util.concurrent.LinkedBlockingDeque",
            "java.util.concurrent.LinkedBlockingQueue",
            "java.util.concurrent.LinkedTransferQueue",
            "java.util.concurrent.PriorityBlockingQueue",
        ];

        let warmup = true;
        const ITERATIONS = 10;
        const target = new Array<Integer>(source.size());
        for (const iterableClass of iterableCollectionClasses) {
            const type =
                Class.forName(iterableClass) as Class<Collection<Integer>>;
            const copyConstructor =
                type.getConstructor(Collection.class);
            const iterable = copyConstructor.newInstance(source);
            const reference =
                Collections.unmodifiableCollection(iterable as Collection<Integer>);

            for (let i = 0; i < ITERATIONS; i++) {
                const iterator = reference.iterator();
                const forEachStart = System.nanoTime();
                iterator.forEachRemaining((x) => { target[x.intValue()] = x; });
                const forEachEnd = System.nanoTime();

                const iterator2 = reference.iterator();
                let x: Integer;
                const iteratorStart = System.nanoTime();
                while (iterator2.hasNext()) {
                    x = iterator2.next();
                    target[x.intValue()] = x;
                }
                const iteratorEnd = System.nanoTime();

                if (warmup) { continue; } // warmup, discard results
                const forEachTime = forEachEnd - forEachStart;
                const iteratorTime = iteratorEnd - iteratorStart;
                const speedup = iteratorTime - forEachTime;
                System.out.print(iterableClass);
                System.out.print(" iterator: ");
                System.out.print(iteratorTime);
                System.out.print(", forEach: ");
                System.out.print(forEachTime);
                System.out.print(", speedup: ");
                System.out.print(speedup);
                System.out.print(" (");
                System.out.print((speedup * 100) / iteratorTime);
                System.out.print("%)\n");
            }
            if (warmup) { warmup = false; }
            System.out.println();
        }
    }

    @Test({ enabled: false })
    public compareSubListForEachPerformance(): void {
        const data = new Array<Integer>(1000 * 100);
        for (let i = 0; i < data.length; i++) {
            data[i] = i;
        }
        const source = Arrays.asList(data);

        const listClasses = [
            "java.util.ArrayList", // warmup, results discarded
            "java.util.ArrayList",
            "java.util.LinkedList",
            "java.util.Vector",
            "java.util.concurrent.CopyOnWriteArrayList",
        ];

        let warmup = true;
        const ITERATIONS = 10;
        const target = new Array<Integer>(source.size());
        for (const listClass of listClasses) {
            const type =
                Class.forName(listClass) as Class<List<Integer>>;
            const copyConstructor =
                type.getConstructor(Collection.class);
            const iterable = copyConstructor.newInstance(source);
            const reference = Collections.unmodifiableList(iterable);

            for (let i = 0; i < ITERATIONS; i++) {
                const iterator = reference.subList(42, reference.size() - 37).iterator();
                const forEachStart = System.nanoTime();
                iterator.forEachRemaining((x) => {
                    target[x.intValue()] = x;
                });
                const forEachEnd = System.nanoTime();

                const iterator2 = reference.iterator();
                let x: Integer;
                const iteratorStart = System.nanoTime();
                while (iterator2.hasNext()) {
                    x = iterator2.next();
                    target[x.intValue()] = x;
                }
                const iteratorEnd = System.nanoTime();

                if (warmup) { continue; } // warmup, discard results
                const forEachTime = forEachEnd - forEachStart;
                const iteratorTime = iteratorEnd - iteratorStart;
                const speedup = iteratorTime - forEachTime;
                System.out.print(listClass);
                System.out.print(" iterator: ");
                System.out.print(iteratorTime);
                System.out.print(", forEach: ");
                System.out.print(forEachTime);
                System.out.print(", speedup: ");
                System.out.print(speedup);
                System.out.print(" (");
                System.out.print((speedup * 100) / iteratorTime);
                System.out.print("%)\n");
            }
            if (warmup) { warmup = false; }
            System.out.println();
        }
    }

    // call the callback for each recursive subList
    private trimmedSubList(/* final */  list: List<Integer>, /* final */  callback: IteratorDefaults.Callback): void {
        const size = list.size();
        if (size > 1) {
            // trim 1 element from both ends
            const subList = list.subList(1, size - 1);
            callback.call(subList);
            this.trimmedSubList(subList, callback);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace IteratorDefaults {
    export interface Callback {
        call(list: List<Integer>): void;
    }

    export type IteratorWithRemove = InstanceType<typeof IteratorDefaults.IteratorWithRemove>;
}
