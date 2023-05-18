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

import { java, JavaObject, int, S, I } from "../../../../../../src";
import { org } from "../../../../../org/org";

const Exception = java.lang.Exception;
type Exception = java.lang.Exception;
const Integer = java.lang.Integer;
type Integer = java.lang.Integer;
type Iterable<T> = java.lang.Iterable<T>;
const ArrayList = java.util.ArrayList;
type ArrayList<E> = java.util.ArrayList<E>;
const Arrays = java.util.Arrays;
type Arrays = java.util.Arrays;
const LinkedList = java.util.LinkedList;
type LinkedList<E> = java.util.LinkedList<E>;
type List<E> = java.util.List<E>;
const Random = java.util.Random;
type Random = java.util.Random;
const TestException = org.testng.TestException;
type TestException = org.testng.TestException;
const assertTrue = org.testng.Assert.assertTrue;
type Collection<E> = java.util.Collection<E>;
const Collections = java.util.Collections;
type Collections = java.util.Collections;
type Function<T, R> = java.util.function.Function<T, R>;
type Supplier<T> = java.util.function.Supplier<T>;
const Supplier = java.util.function.Supplier;

/**
 * @summary A Supplier of test cases for Collection tests
 */
export class CollectionSupplier<C extends Collection<Integer>>
    extends Supplier<Iterable<CollectionSupplier.TestCase<C>>> {

    /**
     * A Collection test case.
     */
    public static readonly TestCase = class TestCase<C extends Collection<Integer>> extends JavaObject {
        /**
         * The name of the test case.
         */
        public readonly name: java.lang.String;

        /**
         * The supplier of a collection
         */
        public supplier: Function<Collection<Integer>, C>;

        /**
         * Unmodifiable reference collection, useful for comparisons.
         */
        public readonly expected: List<Integer>;

        /**
         * A modifiable test collection.
         */
        public readonly collection: C;

        /**
         * Create a Collection test case.
         *
         * @param name name of the test case
         * @param supplier tbd
         * @param collection the modifiable test collection
         */
        public constructor(name: java.lang.String | string, supplier: Function<Collection<Integer>, C>, collection: C) {
            super();
            this.name = S`${name}`;
            this.supplier = supplier;
            this.expected = Collections.unmodifiableList(Arrays.asList(collection.toArray()));
            this.collection = collection;
        }

        public override toString(): java.lang.String {
            return S`${this.name} ${this.collection.getClass()}`;
        }

        public override clone(): java.lang.Object {
            const clone = super.clone() as TestCase<C>;
            clone.collection.clear();
            clone.collection.addAll(this.collection);

            return clone;
        }

        public [Symbol.toPrimitive](hint: string): string {
            return this.toString().valueOf();
        }
    };

    private readonly suppliers: List<Function<Collection<Integer>, C>>;
    private readonly size: int;

    /**
     * Create a {@code CollectionSupplier} that creates instances of specified
     * collection suppliers of the specified size.
     *
     * @param suppliers the suppliers names that supply {@code Collection}
     *        instances
     * @param size the desired size of each collection
     */
    public constructor(suppliers: List<Function<Collection<Integer>, C>>, size: int) {
        super();
        this.suppliers = suppliers;
        this.size = size;
    }

    /**
     * Shuffle a list using a PRNG with known seed for repeatability
     *
     * @param list the list to be shuffled
     */
    public static shuffle<E>(/* final */  list: List<E>): void {
        // PRNG with known seed for repeatable tests
        const prng = new Random(13n);
        const size = list.size();
        for (let i = 0; i < size; i++) {
            // random index in interval [i, size)
            const j = i + prng.nextInt(size - i);
            // swap elements at indices i & j
            const e = list.get(i);
            list.set(i, list.get(j));
            list.set(j, e);
        }
    }

    public get(): Iterable<CollectionSupplier.TestCase<C>> {
        const cases = new LinkedList<CollectionSupplier.TestCase<C>>();
        for (const supplier of this.suppliers) {
            try {
                cases.add(new CollectionSupplier.TestCase("empty", supplier, supplier(Collections.emptyList())));

                cases.add(new CollectionSupplier.TestCase("single", supplier, supplier(Arrays.asList(I`${42}`))));

                const regular = new ArrayList<Integer>();
                for (let i = 0; i < this.size; i++) {
                    regular.add(I`${i}`);
                }
                cases.add(new CollectionSupplier.TestCase("regular", supplier, supplier(regular)));

                const reverse = new ArrayList<Integer>();
                for (let i = this.size; i >= 0; i--) {
                    reverse.add(I`${i}`);
                }
                cases.add(new CollectionSupplier.TestCase("reverse", supplier, supplier(reverse)));

                const odds = new ArrayList<Integer>();
                for (let i = 0; i < this.size; i++) {
                    odds.add(I`${(i * 2) + 1}`);
                }
                cases.add(new CollectionSupplier.TestCase("odds", supplier, supplier(odds)));

                const evens = new ArrayList<Integer>();
                for (let i = 0; i < this.size; i++) {
                    evens.add(I`${i * 2}`);
                }
                cases.add(new CollectionSupplier.TestCase("evens", supplier, supplier(evens)));

                const fibonacci = new ArrayList<Integer>();
                let prev2 = 0;
                let prev1 = 1;
                for (let i = 0; i < this.size; i++) {
                    const n = prev1 + prev2;
                    if (n < 0) { // stop on overflow
                        break;
                    }
                    fibonacci.add(I`${n}`);
                    prev2 = prev1;
                    prev1 = n;
                }
                cases.add(new CollectionSupplier.TestCase("fibonacci", supplier, supplier(fibonacci)));

                let isStructurallyModifiable = false;
                try {
                    const t = supplier(Collections.emptyList());
                    t.add(I`${1}`);
                    isStructurallyModifiable = true;
                } catch (e) {
                    if (e instanceof java.lang.UnsupportedOperationException) { /**/ } else {
                        throw e;
                    }
                }

                if (!isStructurallyModifiable) {

                    continue;
                }

                // variants where the size of the backing storage != reported size
                // created by removing half of the elements
                const emptyWithSlack = supplier(Collections.emptyList());
                emptyWithSlack.add(I`${42}`);
                assertTrue(emptyWithSlack.remove(42));
                cases.add(new CollectionSupplier.TestCase("emptyWithSlack", supplier, emptyWithSlack));

                const singleWithSlack = supplier(Collections.emptyList());
                singleWithSlack.add(I`${42}`);
                singleWithSlack.add(I`${43}`);
                assertTrue(singleWithSlack.remove(43));
                cases.add(new CollectionSupplier.TestCase("singleWithSlack", supplier, singleWithSlack));

                const regularWithSlack = supplier(Collections.emptyList());
                for (let i = 0; i < (2 * this.size); i++) {
                    regularWithSlack.add(I`${i}`);
                }
                assertTrue(regularWithSlack.removeIf((x) => {
                    return x.valueOf() < this.size;
                }));
                cases.add(new CollectionSupplier.TestCase("regularWithSlack", supplier, regularWithSlack));

                const reverseWithSlack = supplier(Collections.emptyList());
                for (let i = 2 * this.size; i >= 0; i--) {
                    reverseWithSlack.add(I`${i}`);
                }
                assertTrue(reverseWithSlack.removeIf((x) => {
                    return x.valueOf() < this.size;
                }));
                cases.add(new CollectionSupplier.TestCase("reverseWithSlack", supplier, reverseWithSlack));

                const oddsWithSlack = supplier(Collections.emptyList());
                for (let i = 0; i < 2 * this.size; i++) {
                    oddsWithSlack.add(I`${(i * 2) + 1}`);
                }

                assertTrue(oddsWithSlack.removeIf((x) => {
                    return x.valueOf() >= this.size;
                }));
                cases.add(new CollectionSupplier.TestCase("oddsWithSlack", supplier, oddsWithSlack));

                const evensWithSlack = supplier(Collections.emptyList());
                for (let i = 0; i < 2 * this.size; i++) {
                    evensWithSlack.add(I`${i * 2}`);
                }
                assertTrue(evensWithSlack.removeIf((x) => {
                    return x.valueOf() >= this.size;
                }));
                cases.add(new CollectionSupplier.TestCase("evensWithSlack", supplier, evensWithSlack));

                const fibonacciWithSlack = supplier(Collections.emptyList());
                prev2 = 0;
                prev1 = 1;
                for (let i = 0; i < this.size; i++) {
                    const n = prev1 + prev2;
                    if (n < 0) { // stop on overflow
                        break;
                    }
                    fibonacciWithSlack.add(I`${n}`);
                    prev2 = prev1;
                    prev1 = n;
                }

                assertTrue(fibonacciWithSlack.removeIf((x) => {
                    return x.valueOf() < 20;
                }));
                cases.add(new CollectionSupplier.TestCase("fibonacciWithSlack", supplier, fibonacciWithSlack));
            } catch (failed) {
                if (failed instanceof Exception) {
                    throw new TestException(failed);
                } else {
                    throw failed;
                }
            }
        }

        return cases;
    }
}

// eslint-disable-next-line @typescript-eslint/no-namespace, no-redeclare
export namespace CollectionSupplier {
    export type TestCase<C extends Collection<Integer>> = InstanceType<typeof CollectionSupplier.TestCase<C>>;
}
