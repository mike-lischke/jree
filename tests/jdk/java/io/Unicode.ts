/* java2ts: keep */

/*
 * Copyright (c) 1999, 2005, Oracle and/or its affiliates. All rights reserved.
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
   @bug 4241440 4220470
   @summary Test the various two-byte Unicode encodings

   @run main Unicode UnicodeLittle little true
   @run main Unicode UnicodeBig big true
   @run main Unicode UnicodeLittleUnmarked little false
   @run main Unicode UnicodeBigUnmarked big false
   @run main Unicode iso-10646-ucs-2 big false
   @run main Unicode x-utf-16be big false
   @run main Unicode x-utf-16le little false
 */

/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* cspell: disable */
/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/naming-convention */

import { java, JavaObject, int } from "../../../../src";

export class Unicode extends JavaObject {

    protected static readonly BOM_HIGH = 0xfe;
    protected static readonly BOM_LOW = 0xff;

    protected static readonly BIG = 0;
    protected static readonly LITTLE = 1;

    public static main = (args: java.lang.String[]): void => {
        const enc = args[0];
        const bos = args[1];
        const markExpected = java.lang.Boolean.valueOf(args[2]).booleanValue();
        let byteOrder = -1;
        if (bos.equals("big")) {
            byteOrder = Unicode.BIG;
        }

        if (bos.equals("little")) {
            byteOrder = Unicode.LITTLE;
        }

        /* We run each test twice in order to check the repeatability of
           String.getBytes and String(byte[], String) (4220470) */
        Unicode.encode(enc, byteOrder, markExpected);
        Unicode.encode(enc, byteOrder, markExpected);
        Unicode.decode(enc, byteOrder, markExpected);
        Unicode.decode(enc, byteOrder, markExpected);
    };

    protected static fail = (enc: string, msg: string, e0: int, e1: int, b0: int, b1: int): void => {
        throw new java.lang.Exception(enc + ": " + msg
            + ": Expected "
            + java.lang.Integer.toHexString(e0)
            + " " + java.lang.Integer.toHexString(e1)
            + ", got "
            + java.lang.Integer.toHexString(b0)
            + " " + java.lang.Integer.toHexString(b1));
    };

    /* Chars to bytes */
    protected static encode = (enc: java.lang.String, byteOrder: int, markExpected: boolean): void => {
        const s = new java.lang.String("abc");
        const b = s.getBytes(enc);
        let i = 0;
        if (markExpected) {
            const b0 = b[i++] & 0xff;
            const b1 = b[i++] & 0xff;
            let e0 = 0;
            let e1 = 0;
            if (byteOrder === Unicode.BIG) {
                e0 = Unicode.BOM_HIGH;
                e1 = Unicode.BOM_LOW;
            } else {
                if (byteOrder === Unicode.LITTLE) {
                    e0 = Unicode.BOM_LOW;
                    e1 = Unicode.BOM_HIGH;
                }
            }

            if ((b0 !== e0) || (b1 !== e1)) {
                Unicode.fail(enc.valueOf(), "Incorrect or missing byte-order mark", e0, e1, b0, b1);
            }
        }

        for (let j = 0; j < s.length(); j++) {
            const c = s.charAt(j);
            const b0 = b[i++] & 0xff;
            const b1 = b[i++] & 0xff;
            let e0 = 0;
            let e1 = 0;
            if (byteOrder === Unicode.BIG) {
                e0 = c >> 8;
                e1 = c & 0xff;
            } else {
                if (byteOrder === Unicode.LITTLE) {
                    e0 = c & 0xff;
                    e1 = c >> 8;
                }
            }

            if ((b0 !== e0) || (b1 !== e1)) {
                Unicode.fail(enc.valueOf(), "Incorrect content at index " + j, e0, e1, b0, b1);
            }
        }
    };

    /* Bytes to chars */
    protected static decode = (enc: java.lang.String, byteOrder: int, markit: boolean): void => {
        const s = new java.lang.String("abc");
        const bo = new java.io.ByteArrayOutputStream();
        if (markit) {
            if (byteOrder === Unicode.BIG) {
                bo.write(Unicode.BOM_HIGH);
                bo.write(Unicode.BOM_LOW);
            } else {
                if (byteOrder === Unicode.LITTLE) {
                    bo.write(Unicode.BOM_LOW);
                    bo.write(Unicode.BOM_HIGH);
                }
            }

        }

        for (let i = 0; i < s.length(); i++) {
            const c = s.charAt(i);
            if (byteOrder === Unicode.BIG) {
                bo.write(c >> 8);
                bo.write(c & 0xff);
            } else {
                if (byteOrder === Unicode.LITTLE) {
                    bo.write(c & 0xff);
                    bo.write(c >> 8);
                }
            }
        }

        const b = bo.toByteArray();
        const s2 = new java.lang.String(b, enc);
        if (!s.equals(s2)) {
            throw new java.lang.Exception(enc + ": Decode error");
        }
    };
}
