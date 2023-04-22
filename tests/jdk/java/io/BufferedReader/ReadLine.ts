/* java2ts: keep */

/*
 * Copyright (c) 1999, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 4151072
 * @summary Ensure that BufferedReader's methods handle the new line character
 *          following the carriage return correctly after a readLine
 *          operation that resulted in reading a line terminated by a
 *          carriage return (\r).
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject, int, S } from "../../../../../src";

export class ReadLine extends JavaObject {

    private static BoundedReader = class BoundedReader extends java.io.Reader {

        private content: Uint16Array;
        private limit: int;
        private pos = 0;

        public constructor(c: string) {
            super();

            const content = new java.lang.String(c);
            this.limit = content.length();
            this.content = new Uint16Array(this.limit);
            content.getChars(0, this.limit, this.content, 0);
        }

        public override read(): int;
        public override  read(buf: Uint16Array, offset: int, length: int): int;
        public override read(...args: unknown[]): int {
            switch (args.length) {
                case 0: {
                    if (this.pos >= this.limit) {
                        throw new java.lang.RuntimeException("Read past limit");
                    }

                    return this.content[this.pos++];
                }

                case 1: {
                    return super.read(args[0] as Uint16Array);
                }

                case 3: {
                    const [buf, offset, length] = args as [Uint16Array, int, int];

                    const oldPos = this.pos;
                    for (let i = offset; i < length; i++) {
                        buf[i] = this.read();
                    }

                    return (this.pos - oldPos);
                }

                default: {
                    throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
                }
            }
        }

        public override  close = (): void => { /* */ };
    };

    public static main = (args: java.lang.String[]): void => {
        // Make sure that the reader does not wait for additional characters to
        // be read after reading a new line.
        let reader: java.io.BufferedReader;
        const strings = [
            ["CR/LF\r\n", "CR/LF"],
            ["LF-Only\n", "LF-Only"],
            ["CR-Only\r", "CR-Only"],
            ["CR/LF line\r\nMore data", "More data"],
        ];

        // test 0 "CR/LF\r\n"
        // test 1 "LF-Only\n"
        // test 2 "CR-Only\r"
        for (let i = 0; i < 3; i++) {
            reader = new java.io.BufferedReader(new ReadLine.BoundedReader(strings[i][0]), strings[i][0].length);
            expect(reader.readLine()!.valueOf()).toEqual(strings[i][1]);
        }

        // Now test the mark and reset operations. Consider two cases.
        // 1. For lines ending with CR only.
        ReadLine.markResetTest("Lot of textual data\rMore textual data\n", "More textual data");

        // 2. Now for lines ending with CR/LF
        ReadLine.markResetTest("Lot of textual data\r\nMore textual data\n", "More textual data");

        // 3. Now for lines ending with LF only
        ReadLine.markResetTest("Lot of textual data\nMore textual data\n", "More textual data");

        // Need to ensure behavior of read() after a readLine() read of a CR/LF
        // terminated line.
        // 1.  For lines ending with CR/LF only.

        // uses "CR/LF line\r\nMore data"
        reader = new java.io.BufferedReader(new ReadLine.BoundedReader(strings[3][0]), strings[3][0].length);
        reader.readLine();
        expect(reader.read()).toEqual("M".codePointAt(0));

        // Need to ensure that a read(char[], int, int) following a readLine()
        // read of a CR/LF terminated line behaves correctly.

        // uses "CR/LF line\r\nMore data"
        reader = new java.io.BufferedReader(new ReadLine.BoundedReader(strings[3][0]), strings[3][0].length);
        reader.readLine();

        const buf = new Uint16Array(9);
        reader.read(buf, 0, 9);
        const newStr = new java.lang.String(buf);
        if (!newStr.equals(strings[3][1])) {
            throw new java.lang.RuntimeException("Read(char[],int,int) failed");
        }
    };

    protected static markResetTest = (inputStr: string, resetStr: string): void => {
        const reader = new java.io.BufferedReader(new ReadLine.BoundedReader(inputStr), inputStr.length);
        reader.readLine();
        reader.mark(30);
        reader.readLine();
        reader.reset();
        const newStr = reader.readLine();

        // Make sure that the reset point was set correctly.
        expect(newStr?.valueOf()).toEqual(resetStr);
    };

}
