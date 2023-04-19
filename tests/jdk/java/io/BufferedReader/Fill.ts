/* java2ts: keep */

/*
 * Copyright (c) 1998, Oracle and/or its affiliates. All rights reserved.
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

/* @test
   @bug 4090383
   @summary Ensure that BufferedReader's read method will fill the target array
            whenever possible
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */

import { java, JavaObject, int, char } from "../../../../../src";

export class Fill extends JavaObject {

    /**
     * A simple Reader that is always ready but may read fewer than the
     * requested number of characters
     */
    private static Source = class Source extends java.io.Reader {

        public shortFall: int;
        public next = 0;

        public constructor(shortFall: int) {
            super();
            this.shortFall = shortFall;
        }

        public override read(): char;
        public override read(buffer: Uint16Array): int;
        public override read(target: Uint16Array, offset: int, length: int): int;
        public override read(target: java.nio.CharBuffer): int;
        public override read(...args: unknown[]): int {
            switch (args.length) {
                case 0: {
                    return super.read();
                }

                case 1: {
                    return super.read(args[0] as Uint16Array);
                }

                default:
            }

            if (args.length === 3) {
                const cbuf = args[0] as Uint16Array;
                const off = args[1] as int;
                const len = args[2] as int;

                const n = len - this.shortFall;
                for (let i = off; i < n; i++) {

                    cbuf[i] = this.next++;
                }

                return n;
            }

            return super.read([...args] as never);
        }

        public override  ready = (): boolean => {
            return true;
        };

        public override  close = (): void => {
            //
        };

    };

    public static main = (args: java.lang.String[]): void => {
        for (let i = 0; i < 8; i++) {
            Fill.go(i);
        }

    };

    /**
     * Test BufferedReader with an underlying source that always reads
     * shortFall fewer characters than requested
     *
     * @param shortFall tbd
     */
    protected static go = (shortFall: int): void => {

        const r = new java.io.BufferedReader(new Fill.Source(shortFall), 10);
        const cbuf = new Uint16Array(8);

        const n1 = r.read(cbuf);
        const n2 = r.read(cbuf);

        expect(n1).toBe(cbuf.length);
        expect(n2).toBe(cbuf.length);
    };

}
