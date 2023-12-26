/* java2ts: keep */

/*
 * Copyright (c) 2000, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 4329985
 * @summary Ensure that BufferedReader's ready() method handles the new line
 * character following the carriage return correctly and returns the right
 * value so that a read operation after a ready() does not block unnecessarily.
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { BufferedReader } from "../../../../../src/java/io/BufferedReader.js";
import { Reader } from "../../../../../src/java/io/Reader.js";
import { IllegalArgumentException } from "../../../../../src/java/lang/IllegalArgumentException.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { RuntimeException } from "../../../../../src/java/lang/RuntimeException.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { S } from "../../../../../src/templates.js";
import { int } from "../../../../../src/types.js";

export class Ready extends JavaObject {

    private static BoundedReader = class BoundedReader extends Reader {

        public content: Uint16Array;
        public limit: int;
        public pos = 0;

        public constructor(c: string) {
            super();

            const content = new JavaString(c);
            this.limit = content.length();
            this.content = new Uint16Array(this.limit);
            content.getChars(0, this.limit, this.content, 0);
        }

        public override read(): int;
        public override read(buf: Uint16Array, offset: int, length: int): int;
        public override read(...args: unknown[]): int {
            switch (args.length) {
                case 0: {
                    if (this.pos >= this.limit) {
                        throw new RuntimeException("Hit infinite wait condition");
                    }

                    return this.content[this.pos++];
                }

                case 1: {
                    return super.read(args[0] as Uint16Array);
                }

                case 3: {
                    const [buf, offset, length] = args as [Uint16Array, int, int];
                    if (this.pos >= this.limit) {
                        throw new RuntimeException("Hit infinite wait condition");
                    }

                    const oldPos = this.pos;
                    const readlen = (length > (this.limit - this.pos)) ? (this.limit - this.pos) : length;
                    for (let i = offset; i < readlen; i++) {
                        buf[i] = this.read();
                    }

                    return (this.pos - oldPos);
                }

                default: {
                    throw new IllegalArgumentException(S`Invalid number of arguments`);
                }
            }
        }

        public override close = (): void => { /* */ };

        public override ready = (): boolean => {
            if (this.pos < this.limit) {
                return true;
            } else {
                return false;
            }
        };
    };

    public static main = (args: JavaString[]): void => {
        let reader: BufferedReader;
        const strings = [
            "LF-Only\n",
            "LF-Only\n",
            "CR/LF\r\n",
            "CR/LF\r\n",
            "CR-Only\r",
            "CR-Only\r",
            "CR/LF line\r\nMore data.\r\n",
            "CR/LF line\r\nMore data.\r\n",
        ];
        const expected = [
            ["LF-Only"],
            ["LF-Only"],
            ["CR/LF"],
            ["CR/LF"],
            ["CR-Only"],
            ["CR-Only"],
            ["CR/LF line", "More data."],
            ["CR/LF line", "More data."],
        ];

        // The buffer sizes are chosen such that the boundary conditions are
        // tested.
        const bufsizes = [7, 8, 6, 5, 7, 8, 11, 10];

        for (let i = 0; i < strings.length; i++) {
            reader = new BufferedReader(new Ready.BoundedReader(strings[i]), bufsizes[i]);
            const actual: string[] = [];
            while (reader.ready()) {
                const str = reader.readLine()!;
                expect(str).not.toBeNull();
                actual.push(str.valueOf());
            }

            expect(actual).toEqual(expected[i]);
        }
    };

}
