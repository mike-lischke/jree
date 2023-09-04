/*
 * Copyright (c) 2013, 2017, Oracle and/or its affiliates. All rights reserved.
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

import { java, JavaObject, type int, type long, type double } from "../../../../../src";
import { org } from "../../../../org/org";

const Test = org.testng.annotations.Test;
type PrimitiveIterator<T, T_CONS> = java.util.PrimitiveIterator<T, T_CONS>;
type IntConsumer = java.util.function.IntConsumer;
type Consumer<T> = java.util.function.Consumer<T>;
type Integer = java.lang.Integer;
const Integer = java.lang.Integer;
type LongConsumer = java.util.function.LongConsumer;
type Long = java.lang.Long;
const Long = java.lang.Long;
type DoubleConsumer = java.util.function.DoubleConsumer;
type Double = java.lang.Double;
const Double = java.lang.Double;
type NullPointerException = java.lang.NullPointerException;
const NullPointerException = java.lang.NullPointerException;

/**
 * @test
 * @run testng PrimitiveIteratorDefaults
 * @summary test default methods on PrimitiveIterator
 */
export class PrimitiveIteratorDefaults extends JavaObject {

    public testIntForEachRemainingWithNull(): void {
        const i = new class extends JavaObject implements PrimitiveIterator.OfInt {
            @Override
            public nextInt(): int {
                return 0;
            }

            @Override
            public hasNext(): boolean {
                return false;
            }
        }();

        this.assertThrowsNPE(() => { return i.forEachRemaining(null as IntConsumer); });
        this.assertThrowsNPE(() => { return i.forEachRemaining(null as Consumer<Integer>); });
    }

    public testLongForEachRemainingWithNull(): void {
        const i = new class extends JavaObject implements PrimitiveIterator.OfLong {
            @Override
            public nextLong(): long {
                return 0;
            }

            @Override
            public hasNext(): boolean {
                return false;
            }
        }();

        this.assertThrowsNPE(() => { return i.forEachRemaining(null as LongConsumer); });
        this.assertThrowsNPE(() => { return i.forEachRemaining(null as Consumer<Long>); });
    }

    public testDoubleForEachRemainingWithNull(): void {
        const i = new class extends JavaObject implements PrimitiveIterator.OfDouble {
            @Override
            public nextDouble(): double {
                return 0;
            }

            @Override
            public hasNext(): boolean {
                return false;
            }
        }();

        this.assertThrowsNPE(() => { return i.forEachRemaining(null as DoubleConsumer); });
        this.assertThrowsNPE(() => { return i.forEachRemaining(null as Consumer<Double>); });
    }

    private assertThrowsNPE(r: ThrowingRunnable): void {
        assertThrows(NullPointerException.class, r);
    }

}
