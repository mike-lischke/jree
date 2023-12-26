/* java2ts: keep */

/*
 * Copyright (c) 2007, Oracle and/or its affiliates. All rights reserved.
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

// cspell: ignore Buchholz
/*
 * @test
 * @bug     6359979
 * @summary Compare List implementations for identical behavior
 * @author  Martin Buchholz
 * @key randomness
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { ArrayList } from "../../../../../src/java/util/ArrayList.js";
import { Collections } from "../../../../../src/java/util/Collections.js";
import { ConcurrentModificationException } from "../../../../../src/java/util/ConcurrentModificationException.js";
import { LinkedList } from "../../../../../src/java/util/LinkedList.js";
import { Random } from "../../../../../src/java/util/Random.js";
import { Vector } from "../../../../../src/java/util/Vector.js";
import { S, I } from "../../../../../src/templates.js";
import { int } from "../../../../../src/types.js";

import { Assert } from "../../../../org/testng/Assert.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { Integer } from "../../../../../src/java/lang/Integer.js";
import { List } from "../../../../../src/java/util/List.js";
import { IllegalArgumentException } from "../../../../../src/java/lang/IllegalArgumentException.js";
import { IndexOutOfBoundsException } from "../../../../../src/java/lang/IndexOutOfBoundsException.js";
import { Collection } from "../../../../../src/java/util/Collection.js";
import { JavaBoolean } from "../../../../../src/java/lang/Boolean.js";
import { JavaError } from "../../../../../src/java/lang/Error.js";
import { IllegalStateException } from "../../../../../src/java/lang/IllegalStateException.js";
import { Throwable } from "../../../../../src/java/lang/Throwable.js";

export class LockStep extends JavaObject {

    protected readonly DEFAULT_SIZE = 5;
    protected size: int = 0;

    protected readonly rnd = new Random();

    //--------------------- Infrastructure ---------------------------
    protected passed = 0;

    //--------------------- Infrastructure ---------------------------
    protected failed = 0;
    public static main(args: JavaString[]): void {
        new LockStep().instanceMain(args);
    }

    protected intArg(args: JavaString[], i: int, defaultValue: int): int {
        return args.length > i ? Integer.parseInt(args[i]) : defaultValue;
    }

    protected maybe(n: int): boolean { return this.rnd.nextInt(n) === 0; }

    protected test(args: JavaString[]): void {
        this.size = this.intArg(args, 0, this.DEFAULT_SIZE);

        this.lockSteps(new ArrayList<Integer>(),
            new LinkedList<Integer>(),
            new Vector<Integer>());
    }

    protected equalLists<T>(...lists: Array<List<T>>): void;
    protected equalLists<T>(lists: Array<List<T>>): void;
    protected equalLists<T>(x: List<T>, y: List<T>): void;
    protected equalLists<T>(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [lists] = args as [Array<List<T>>];

                for (const list of lists) {
                    this.equalLists(list, lists[0]);
                }

                break;
            }

            case 2: {
                const [x, y] = args as [List<T>, List<T>];

                this.equal(x, y);
                this.equal(y, x);
                this.equal(x.size(), y.size());
                this.equal(x.isEmpty(), y.isEmpty());
                this.equal(x.hashCode(), y.hashCode());
                this.equal(x.toString(), y.toString());
                this.equal(x.toArray(), y.toArray());

                break;
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    protected lockSteps(...lists: Array<List<Integer>>): void {
        it("Clone", () => {
            for (let i = 0; i < lists.length; i++) {
                if (this.maybe(4)) {
                    //lists[i] = LockStep.serialClone(lists[i]);
                }
            }
        });

        it("Empty List", () => {
            for (const list of lists) {
                this.testEmptyList(list);
            }
        });

        it("Equal List 1", () => {
            for (let i = 0; i < this.size; i++) {
                const adder = this.randomAdder();
                for (const list of lists) {
                    adder.frob(list);
                    this.equal(list.size(), i + 1);
                }
                this.equalLists<Integer>(lists);
            }
        });

        it("Concurrent Changes", () => {
            const adder = this.randomAdder();
            const remover = this.randomRemover<Integer>();
            for (const list of lists) {
                this.THROWS(ConcurrentModificationException,
                    new class implements LockStep.F {
                        public f(): void {
                            const it = list.iterator();
                            adder.frob(list);
                            it.next();
                        }
                    }(),

                    new class implements LockStep.F {
                        public constructor(private $outer: LockStep) { }

                        public f(): void {
                            const it = this.$outer.asSubList(list).iterator();
                            remover.frob(list);
                            it.next();
                        }
                    }(this),

                    new class implements LockStep.F {
                        public constructor(private $outer: LockStep) { }

                        public f(): void {
                            const it = this.$outer.asSubList(this.$outer.asSubList(list)).iterator();
                            adder.frob(list);
                            it.next();
                        }
                    }(this),

                    new class implements LockStep.F {
                        public constructor(private $outer: LockStep) { }

                        public f(): void {
                            const subList = this.$outer.asSubList(list);
                            remover.frob(list);
                            subList.get(0);
                        }
                    }(this),

                    new class implements LockStep.F {
                        public constructor(private $outer: LockStep) { }

                        public f(): void {
                            const sl = this.$outer.asSubList(list);
                            const ssl = this.$outer.asSubList(sl);
                            adder.frob(sl);
                            ssl.get(0);
                        }
                    }(this),

                    new class implements LockStep.F {
                        public constructor(private $outer: LockStep) { }

                        public f(): void {
                            const sl = this.$outer.asSubList(list);
                            const ssl = this.$outer.asSubList(sl);
                            remover.frob(sl);
                            ssl.get(0);
                        }
                    }(this));
            }
        });

        it("Equal Lists 2", () => {
            for (const l of lists) {
                const sl = this.asSubList(l);
                const ssl = this.asSubList(sl);
                ssl.add(0, I`42`);
                this.equal(ssl.get(0), I`42`);
                this.equal(sl.get(0), I`42`);
                this.equal(l.get(0), I`42`);
                const s = l.size();
                const rndIndex = this.rnd.nextInt(l.size());
                this.THROWS(IndexOutOfBoundsException,
                    new class implements LockStep.F { public f(): void { l.subList(rndIndex, rndIndex).get(0); } }(),
                    new class implements LockStep.F { public f(): void { l.subList(s / 2, s).get(s / 2 + 1); } }(),
                    new class implements LockStep.F { public f(): void { l.subList(s / 2, s).get(-1); } }(),
                );
                this.THROWS(IllegalArgumentException,
                    new class implements LockStep.F { public f(): void { l.subList(1, 0); } }(),
                    new class implements LockStep.F { public f(): void { sl.subList(1, 0); } }(),
                    new class implements LockStep.F { public f(): void { ssl.subList(1, 0); } }());
            }

            this.equalLists(lists);

            for (const list of lists) {
                this.equalLists(list, this.asSubList(list));
                this.equalLists(list, this.asSubList(this.asSubList(list)));
            }

            for (let i = lists[0].size(); i > 0; i--) {
                const remover = this.randomRemover();
                for (const list of lists) {

                    remover.frob(list);
                }

                this.equalLists(lists);
            }
        });
    }

    protected asSubList<T>(list: List<T>): List<T> {
        return list.subList(0, list.size());
    }

    protected testEmptyCollection(c: Collection<unknown>): void {
        this.check(c.isEmpty());
        this.equal(c.size(), 0);
        this.equal(c.toString(), S`[]`);
        this.equal(c.toArray().length, 0);
        this.equal(c.toArray(new Array<JavaObject>(0)).length, 0);

        const a = new Array<JavaObject>(1);
        a[0] = JavaBoolean.TRUE;
        this.equal(c.toArray(a), a);
        this.equal(a[0], null);
    }

    protected testEmptyList<T>(list: List<T>): void {
        this.testEmptyCollection(list);
        this.equal(list.hashCode(), 1);
        this.equal(list, Collections.emptyList());
    }

    protected randomAdder(): LockStep.ListFrobber<Integer> {
        const e = new Integer(this.rnd.nextInt(1024));
        const subListCount = this.rnd.nextInt(3);
        const atBeginning = this.rnd.nextBoolean();
        const useIterator = this.rnd.nextBoolean();

        return new class implements LockStep.ListFrobber<Integer> {
            public constructor(private $outer: LockStep) {
            }

            public frob(l: List<Integer>): void {
                const s = l.size();
                let ll = l;
                for (let i = 0; i < subListCount; i++) {
                    ll = this.$outer.asSubList(ll);
                }

                if (!useIterator) {
                    if (atBeginning) {
                        switch (this.$outer.rnd.nextInt(3)) {
                            case 0: {
                                ll.add(0, e); break;
                            }

                            case 1: {
                                ll.subList(0, this.$outer.rnd.nextInt(s + 1)).add(0, e); break;
                            }

                            case 2: {
                                ll.subList(0, this.$outer.rnd.nextInt(s + 1)).subList(0, 0).add(0, e); break;
                            }

                            default: {
                                throw new JavaError();
                            }
                        }
                    } else {
                        switch (this.$outer.rnd.nextInt(3)) {
                            case 0: {
                                this.$outer.check(ll.add(e)); break;
                            }

                            case 1: {
                                ll.subList(s / 2, s).add(s - s / 2, e); break;
                            }

                            case 2: {
                                ll.subList(s, s).subList(0, 0).add(0, e); break;
                            }

                            default: {
                                throw new JavaError();
                            }
                        }
                    }
                } else {
                    if (atBeginning) {
                        const it = ll.listIterator();
                        this.$outer.equal(it.nextIndex(), 0);
                        this.$outer.check(!it.hasPrevious());
                        it.add(e);
                        this.$outer.equal(it.previousIndex(), 0);
                        this.$outer.equal(it.nextIndex(), 1);
                        this.$outer.check(it.hasPrevious());
                    } else {
                        const siz = ll.size();
                        const it = ll.listIterator(siz);
                        this.$outer.equal(it.previousIndex(), siz - 1);
                        this.$outer.check(!it.hasNext());
                        it.add(e);
                        this.$outer.equal(it.previousIndex(), siz);
                        this.$outer.equal(it.nextIndex(), siz + 1);
                        this.$outer.check(!it.hasNext());
                        this.$outer.check(it.hasPrevious());
                    }
                }
            }
        }(this);
    }

    protected randomRemover<T>(): LockStep.ListFrobber<T> {
        const position = this.rnd.nextInt(3);
        const subListCount = this.rnd.nextInt(3);

        return new class implements LockStep.ListFrobber<T> {
            public constructor(private $outer: LockStep) {
            }

            public frob(l: List<T>): void {
                const s = l.size();
                let ll = l;
                for (let i = 0; i < subListCount; i++) {

                    ll = this.$outer.asSubList(ll);
                }

                switch (position) {
                    case 0: { // beginning
                        switch (this.$outer.rnd.nextInt(3)) {
                            case 0: {
                                ll.remove(0); break;
                            }

                            case 1: {
                                const it = ll.iterator();
                                this.$outer.check(it.hasNext());
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                it.next();
                                it.remove();
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                break;
                            }
                            case 2: {
                                const it = ll.listIterator();
                                this.$outer.check(it.hasNext());
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                it.next();
                                it.remove();
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                break;
                            }
                            default: {
                                throw new JavaError();
                            }

                        }
                        break;
                    }

                    case 1: { // midpoint
                        switch (this.$outer.rnd.nextInt(3)) {
                            case 0: {
                                ll.remove(s / 2); break;
                            }

                            case 1: {
                                const it = ll.listIterator(s / 2);
                                it.next();
                                it.remove();
                                break;
                            }
                            case 2: {
                                const it = ll.listIterator(s / 2 + 1);
                                it.previous();
                                it.remove();
                                break;
                            }
                            default: {
                                throw new JavaError();
                            }

                        }
                        break;
                    }

                    case 2: { // end
                        switch (this.$outer.rnd.nextInt(3)) {
                            case 0: {
                                ll.remove(s - 1); break;
                            }

                            case 1: {
                                ll.subList(s - 1, s).clear(); break;
                            }

                            case 2: {
                                const it = ll.listIterator(s);
                                this.$outer.check(!it.hasNext());
                                this.$outer.check(it.hasPrevious());
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                it.previous();
                                this.$outer.equal(it.nextIndex(), s - 1);
                                this.$outer.check(it.hasNext());
                                it.remove();
                                this.$outer.equal(it.nextIndex(), s - 1);
                                this.$outer.check(!it.hasNext());
                                this.$outer.THROWS(IllegalStateException,
                                    new class implements LockStep.F { public f(): void { it.remove(); } }());
                                break;
                            }

                            default: {
                                throw new JavaError();
                            }

                        }
                        break;
                    }

                    default: {
                        throw new JavaError();
                    }

                }
            }
        }(this);
    }

    protected check(cond: boolean): void {
        Assert.assertTrue(cond);
    }

    protected equal(x: unknown, y: unknown): void {
        Assert.assertEquals(x, y);
    }

    protected instanceMain(args: JavaString[]): void {
        this.test(args);
    }

    protected THROWS(k: typeof Throwable, ...fs: LockStep.F[]): void {
        for (const f of fs) {
            try {
                f.f();
                throw new Error("Expected " + k.constructor.name + " not thrown");
            } catch (t) {
                if (!(t instanceof k)) {
                    throw t;
                }
            }
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace LockStep {
    export interface ListFrobber<T> {
        frob(l: List<T>): void;
    }

    export interface F {
        f(): void;
    }
}
