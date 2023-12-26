/* java2ts: keep */

/*
 * Copyright (c) 2004, Oracle and/or its affiliates. All rights reserved.
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
 * @bug 5067405
 * @summary Basic test for classes which implement Appendable.
 */

/* eslint-disable @typescript-eslint/prefer-for-of */

/** cspell: ignore Appendables */

import { BufferedReader } from "../../../../../src/java/io/BufferedReader.js";
import { BufferedWriter } from "../../../../../src/java/io/BufferedWriter.js";
import { ByteArrayOutputStream } from "../../../../../src/java/io/ByteArrayOutputStream.js";
import { CharArrayWriter } from "../../../../../src/java/io/CharArrayWriter.js";
import { JavaFile } from "../../../../../src/java/io/File.js";
import { JavaFileReader } from "../../../../../src/java/io/FileReader.js";
import { FileWriter } from "../../../../../src/java/io/FileWriter.js";
import { IOException } from "../../../../../src/java/io/IOException.js";
import { OutputStreamWriter } from "../../../../../src/java/io/OutputStreamWriter.js";
import { PrintStream } from "../../../../../src/java/io/PrintStream.js";
import { PrintWriter } from "../../../../../src/java/io/PrintWriter.js";
import { StringWriter } from "../../../../../src/java/io/StringWriter.js";
import { Writer } from "../../../../../src/java/io/Writer.js";
import { Appendable } from "../../../../../src/java/lang/Appendable.js";
import { CharSequence } from "../../../../../src/java/lang/CharSequence.js";
import { IllegalArgumentException } from "../../../../../src/java/lang/IllegalArgumentException.js";
import { IndexOutOfBoundsException } from "../../../../../src/java/lang/IndexOutOfBoundsException.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { Runnable } from "../../../../../src/java/lang/Runnable.js";
import { RuntimeException } from "../../../../../src/java/lang/RuntimeException.js";
import { JavaString } from "../../../../../src/java/lang/String.js";
import { StringBuffer } from "../../../../../src/java/lang/StringBuffer.js";
import { StringBuilder } from "../../../../../src/java/lang/StringBuilder.js";
import { System } from "../../../../../src/java/lang/System.js";
import { Throwable } from "../../../../../src/java/lang/Throwable.js";
import { ByteBuffer } from "../../../../../src/java/nio/ByteBuffer.js";
import { CharBuffer } from "../../../../../src/java/nio/CharBuffer.js";
import { S } from "../../../../../src/templates.js";

interface BasicRunnable extends Runnable {
    init(a: Appendable, csq: JavaString, exp: JavaString): void;
    reset(csq: Appendable): Appendable;
}

export class Basic extends JavaObject {
    private static testBufferedWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        public init = (bw: Appendable, csn: JavaString, exp: JavaString): void => {
            try {
                (bw as BufferedWriter).flush();
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("BufferedWriter.append(" + this.csn + ")", this.exp, Basic.gw.toString());
        };
        public reset = (bw: Appendable): Appendable => {
            Basic.gw.reset();

            return bw;
        };
    }();

    private static testCharArrayWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        private cw!: CharArrayWriter;
        public init = (cw: Appendable, csn: JavaString, exp: JavaString): void => {
            this.cw = cw as CharArrayWriter;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("CharArrayWriter.append(" + this.csn + ")", this.exp, this.cw.toString());
        };
        public reset = (cw: Appendable): Appendable => {
            (cw as CharArrayWriter).reset();

            return cw;
        };
    }();

    private static testFileWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        public init = (fw: Appendable, csn: JavaString, exp: JavaString): void => {
            try {
                (fw as FileWriter).flush();
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            const sb = new StringBuilder();
            try {
                const input = new BufferedReader(new JavaFileReader(Basic.#gf));
                let line: JavaString | null;
                while (true) {
                    if ((line = input.readLine()) === null) {

                        break;
                    }

                    sb.append(line);
                }
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            Basic.ck("FileWriter.append(" + this.csn + ")", this.exp, sb.toString());
        };
        public reset = (fw: Appendable): Appendable => {
            try {
                fw = new FileWriter(Basic.#gf);
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }

            return fw;
        };
    }();

    private static testOutputStreamWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        public init = (osw: Appendable, csn: JavaString, exp: JavaString): void => {
            try {
                (osw as OutputStreamWriter).flush();
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("OutputStreamWriter.append(" + this.csn + ")", this.exp, Basic.gos.toString());
        };
        public reset = (osw: Appendable): Appendable => {
            Basic.gos.reset();

            return osw;
        };
    }();

    private static testPrintWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        public init = (pw: Appendable, csn: JavaString, exp: JavaString): void => {
            (pw as PrintWriter).flush();
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("PrintWriter.append(" + this.csn + ")", this.exp, Basic.gw.toString());
        };
        public reset = (pw: Appendable): Appendable => {
            Basic.gw.reset();

            return pw;
        };
    }();

    private static testStringWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        private sw!: StringWriter;
        public init = (sw: Appendable, csn: JavaString, exp: JavaString): void => {
            this.sw = sw as StringWriter;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringWriter.append(" + this.csn + ")", this.exp, this.sw.toString());
        };
        public reset = (sw: Appendable): Appendable => {
            return new StringWriter();
        };
    }();

    private static testPrintStream = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        public init = (ps: Appendable, csn: JavaString, exp: JavaString): void => {
            (ps as PrintStream).flush();
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("PrintStream.append(" + this.csn + ")", this.exp, Basic.gos.toString());
        };
        public reset = (ps: Appendable): Appendable => {
            Basic.gos.reset();

            return ps;
        };
    }();

    private static testCharBuffer = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        private cb!: CharBuffer;
        public init = (cb: Appendable, csn: JavaString, exp: JavaString): void => {
            this.cb = cb as CharBuffer;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            this.cb.limit(this.cb.position()).rewind();
            Basic.ck("CharBuffer.append(" + this.csn + ")", this.exp, this.cb.toString());
        };
        public reset = (cb: Appendable): Appendable => {
            (cb as CharBuffer).clear();

            return cb;
        };
    }();

    private static testStringBuffer = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        private sb!: StringBuffer;
        public init = (sb: Appendable, csn: JavaString, exp: JavaString): void => {
            this.sb = sb as StringBuffer;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringBuffer.append(" + this.csn + ")", this.exp, this.sb.toString());
        };
        public reset = (sb: Appendable): Appendable => {
            return new StringBuffer();
        };
    }();

    private static testStringBuilder = new class extends JavaObject implements BasicRunnable {
        private csn!: JavaString;
        private exp!: JavaString;
        private sb!: StringBuilder;
        public init = (sb: Appendable, csn: JavaString, exp: JavaString): void => {
            this.sb = sb as StringBuilder;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringBuilder.append(" + this.csn + ")", this.exp, this.sb.toString());
        };
        public reset = (sb: Appendable): Appendable => {
            return new StringBuilder();
        };
    }();

    /** cspell: ignore Jabberwock */
    private static readonly s = S`Beware the Jabberwock, my son!`;
    private static gw = new CharArrayWriter();
    private static gos = new ByteArrayOutputStream();

    static #gf = Basic.newFile()!;

    static #fail = 0;
    static #pass = 0;

    static #first: Throwable | null = null;

    public static main(args: JavaString[]): void {
        // CharSequences
        const cb = CharBuffer.allocate(128).put(Basic.s);
        cb.limit(Basic.s.length()).rewind();
        const dcb = ByteBuffer.allocateDirect(128).asCharBuffer().put(Basic.s);
        dcb.limit(Basic.s.length()).rewind();
        const ca = [Basic.s, new StringBuffer(Basic.s), new StringBuilder(Basic.s), cb, dcb];

        // Appendables/Writers
        const wa = [
            [new CharArrayWriter(), Basic.testCharArrayWriter],
            [new BufferedWriter(Basic.gw), Basic.testBufferedWriter],
            // abstract, no implementing classes in jdk
            // { new FilterWriter(), testFilterWriter },
            [new FileWriter(Basic.#gf), Basic.testFileWriter],
            [new OutputStreamWriter(Basic.gos), Basic.testOutputStreamWriter],
            // covered by previous two test cases
            // { new PipedWriter(gw), testPipedWriter },
            [new PrintWriter(Basic.gw), Basic.testPrintWriter],
            [new StringWriter(), Basic.testStringWriter],
        ];

        for (let i = 0; i < ca.length; i++) {
            const a = ca[i];
            for (let j = 0; j < wa.length; j++) {
                Basic.test(wa[j][0] as Writer, a, wa[j][1] as BasicRunnable);
            }

            // other Appendables
            Basic.test(new PrintStream(Basic.gos), a, Basic.testPrintStream);
            Basic.test(CharBuffer.allocate(128), a, Basic.testCharBuffer);
            Basic.test(ByteBuffer.allocateDirect(128).asCharBuffer(), a, Basic.testCharBuffer);
            Basic.test(new StringBuffer(), a, Basic.testStringBuffer);
            Basic.test(new StringBuilder(), a, Basic.testStringBuilder);
        }

        expect(Basic.#fail).toBe(0);
        /*if (Basic.#fail !== 0) {
            throw new RuntimeException((Basic.#fail + Basic.#pass) + " tests: "
                + Basic.#fail + " failure(s), first", Basic.#first);
        } else {
            System.out.println("all " + (Basic.#fail + Basic.#pass) + " tests passed");
        }*/

    }

    protected static pass(): void {
        Basic.#pass++;
    }

    protected static fail(ex: Throwable): void;
    protected static fail(fs: JavaString | string, ex: Throwable): void;
    protected static fail(fs: JavaString | string, exp: JavaString, got: JavaString): void;
    protected static fail(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [ex] = args as [Throwable];

                if (Basic.#first === null) {
                    Basic.#first = ex;
                }

                System.err.println("FAILED: unexpected exception");
                Basic.#fail++;

                break;
            }

            case 2: {
                const [fs, ex] = args as [JavaString | string, Throwable];

                const s = "'" + fs + "': " + ex.getClass().getName() + " not thrown";
                if (Basic.#first === null) {

                    Basic.#first = ex;
                }

                System.err.println("FAILED: " + s);
                Basic.#fail++;

                break;
            }

            case 3: {
                const [fs, exp, got] = args as [JavaString | string, JavaString, JavaString];

                //expect(exp).toBe(got);
                const s = "'" + fs + "': Expected '" + exp + "', got '" + got + "'";
                if (Basic.#first === null) {

                    Basic.#first = new RuntimeException(s);
                }

                System.err.println("FAILED: " + s);
                Basic.#fail++;

                break;
            }

            default: {
                throw new IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    protected static ck(s: string, exp: JavaString, got: JavaString): void {
        expect(got.valueOf()).toEqual(exp.valueOf());
        /*if (!exp.equals(got)) {
            Basic.fail(s, exp, got);
        } else {

            Basic.pass();
        }*/

    }

    private static newFile(): JavaFile | null {
        let f = null;
        try {
            f = JavaFile.createTempFile("append", ".txt");
            f.deleteOnExit();
        } catch (x) {
            if (x instanceof IOException) {
                Basic.fail(x);
            } else {
                throw x;
            }
        }

        return f;
    }

    private static test = (a: Appendable, csq: CharSequence, thunk: BasicRunnable): void => {
        // appends that should always work
        const sp = [
            [0, 0], [11, 11], [11, 21], [0, 7],
            [0, Basic.s.length()], [Basic.s.length(), Basic.s.length()],
        ];
        for (let j = 0; j < sp.length; j++) {
            const start = sp[j][0];
            const end = sp[j][1];
            try {
                thunk.init(a.append(csq, start, end), S`${csq.getClass().getName()}`,
                    Basic.s.subSequence(start, end).toString());
                thunk.run();
                a = thunk.reset(a);
            } catch (x) {
                if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
        }

        // appends that should always throw IndexOutOfBoundsException
        const sf = [[-1, 0], [0, -1], [11, 10], [0, Basic.s.length() + 1]];
        for (let j = 0; j < sf.length; j++) {
            const start = sf[j][0];
            const end = sf[j][1];
            try {
                a.append(csq, start, end);
                Basic.fail("start = " + start + ", end = " + end,
                    new IndexOutOfBoundsException());
                a = thunk.reset(a);
            } catch (x) {
                if (x instanceof IndexOutOfBoundsException) {
                    Basic.pass();
                } else if (x instanceof IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
        }

        // appends of null
        const start = 1;
        const end = 2;
        try {
            thunk.init(a.append(null, start, end), S`null`, S`null`.subSequence(start, end).toString());
            thunk.run();
            a = thunk.reset(a);
        } catch (x) {
            if (x instanceof IOException) {
                Basic.fail(x);
            } else {
                throw x;
            }
        }
    };

}
