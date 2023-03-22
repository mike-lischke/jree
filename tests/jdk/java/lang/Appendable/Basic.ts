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

import { java, JavaObject, S } from "../../../../../src";

interface BasicRunnable extends java.lang.Runnable {
    init(a: java.lang.Appendable, csq: java.lang.String, exp: java.lang.String): void;
    reset(csq: java.lang.Appendable): java.lang.Appendable;
}

export class Basic extends JavaObject {
    private static testBufferedWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        public init = (bw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            try {
                (bw as java.io.BufferedWriter).flush();
            } catch (x) {
                if (x instanceof java.io.IOException) {
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
        public reset = (bw: java.lang.Appendable): java.lang.Appendable => {
            Basic.gw.reset();

            return bw;
        };
    }();

    private static testCharArrayWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        private cw!: java.io.CharArrayWriter;
        public init = (cw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            this.cw = cw as java.io.CharArrayWriter;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("CharArrayWriter.append(" + this.csn + ")", this.exp, this.cw.toString());
        };
        public reset = (cw: java.lang.Appendable): java.lang.Appendable => {
            (cw as java.io.CharArrayWriter).reset();

            return cw;
        };
    }();

    private static testFileWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        public init = (fw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            try {
                (fw as java.io.FileWriter).flush();
            } catch (x) {
                if (x instanceof java.io.IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            const sb = new java.lang.StringBuilder();
            try {
                const input = new java.io.BufferedReader(new java.io.FileReader(Basic.#gf));
                let line: java.lang.String | null;
                while (true) {
                    if ((line = input.readLine()) === null) {

                        break;
                    }

                    sb.append(line);
                }
            } catch (x) {
                if (x instanceof java.io.IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }
            Basic.ck("FileWriter.append(" + this.csn + ")", this.exp, sb.toString());
        };
        public reset = (fw: java.lang.Appendable): java.lang.Appendable => {
            try {
                fw = new java.io.FileWriter(Basic.#gf);
            } catch (x) {
                if (x instanceof java.io.IOException) {
                    Basic.fail(x);
                } else {
                    throw x;
                }
            }

            return fw;
        };
    }();

    private static testOutputStreamWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        public init = (osw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            try {
                (osw as java.io.OutputStreamWriter).flush();
            } catch (x) {
                if (x instanceof java.io.IOException) {
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
        public reset = (osw: java.lang.Appendable): java.lang.Appendable => {
            Basic.gos.reset();

            return osw;
        };
    }();

    private static testPrintWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        public init = (pw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            (pw as java.io.PrintWriter).flush();
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("PrintWriter.append(" + this.csn + ")", this.exp, Basic.gw.toString());
        };
        public reset = (pw: java.lang.Appendable): java.lang.Appendable => {
            Basic.gw.reset();

            return pw;
        };
    }();

    private static testStringWriter = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        private sw!: java.io.StringWriter;
        public init = (sw: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            this.sw = sw as java.io.StringWriter;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringWriter.append(" + this.csn + ")", this.exp, this.sw.toString());
        };
        public reset = (sw: java.lang.Appendable): java.lang.Appendable => {
            return new java.io.StringWriter();
        };
    }();

    private static testPrintStream = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        public init = (ps: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            (ps as java.io.PrintStream).flush();
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("PrintStream.append(" + this.csn + ")", this.exp, Basic.gos.toString());
        };
        public reset = (ps: java.lang.Appendable): java.lang.Appendable => {
            Basic.gos.reset();

            return ps;
        };
    }();

    private static testCharBuffer = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        private cb!: java.nio.CharBuffer;
        public init = (cb: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            this.cb = cb as java.nio.CharBuffer;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            this.cb.limit(this.cb.position()).rewind();
            Basic.ck("CharBuffer.append(" + this.csn + ")", this.exp, this.cb.toString());
        };
        public reset = (cb: java.lang.Appendable): java.lang.Appendable => {
            (cb as java.nio.CharBuffer).clear();

            return cb;
        };
    }();

    private static testStringBuffer = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        private sb!: java.lang.StringBuffer;
        public init = (sb: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            this.sb = sb as java.lang.StringBuffer;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringBuffer.append(" + this.csn + ")", this.exp, this.sb.toString());
        };
        public reset = (sb: java.lang.Appendable): java.lang.Appendable => {
            return new java.lang.StringBuffer();
        };
    }();

    private static testStringBuilder = new class extends JavaObject implements BasicRunnable {
        private csn!: java.lang.String;
        private exp!: java.lang.String;
        private sb!: java.lang.StringBuilder;
        public init = (sb: java.lang.Appendable, csn: java.lang.String, exp: java.lang.String): void => {
            this.sb = sb as java.lang.StringBuilder;
            this.csn = csn;
            this.exp = exp;
        };
        public run = (): void => {
            Basic.ck("StringBuilder.append(" + this.csn + ")", this.exp, this.sb.toString());
        };
        public reset = (sb: java.lang.Appendable): java.lang.Appendable => {
            return new java.lang.StringBuilder();
        };
    }();

    /** cspell: ignore Jabberwock */
    private static readonly s = S`Beware the Jabberwock, my son!`;
    private static gw = new java.io.CharArrayWriter();
    private static gos = new java.io.ByteArrayOutputStream();

    static #gf = Basic.newFile()!;

    static #fail = 0;
    static #pass = 0;

    static #first: java.lang.Throwable | null = null;

    public static main(args: java.lang.String[]): void {
        // CharSequences
        const cb = java.nio.CharBuffer.allocate(128).put(Basic.s);
        cb.limit(Basic.s.length()).rewind();
        const dcb = java.nio.ByteBuffer.allocateDirect(128).asCharBuffer().put(Basic.s);
        dcb.limit(Basic.s.length()).rewind();
        const ca = [Basic.s, new java.lang.StringBuffer(Basic.s), new java.lang.StringBuilder(Basic.s), cb, dcb];

        // Appendables/Writers
        const wa = [
            [new java.io.CharArrayWriter(), Basic.testCharArrayWriter],
            [new java.io.BufferedWriter(Basic.gw), Basic.testBufferedWriter],
            // abstract, no implementing classes in jdk
            // { new FilterWriter(), testFilterWriter },
            [new java.io.FileWriter(Basic.#gf), Basic.testFileWriter],
            [new java.io.OutputStreamWriter(Basic.gos), Basic.testOutputStreamWriter],
            // covered by previous two test cases
            // { new PipedWriter(gw), testPipedWriter },
            [new java.io.PrintWriter(Basic.gw), Basic.testPrintWriter],
            [new java.io.StringWriter(), Basic.testStringWriter],
        ];

        for (let i = 0; i < ca.length; i++) {
            const a = ca[i];
            for (let j = 2; j < wa.length; j++) {
                Basic.test(wa[j][0] as java.io.Writer, a, wa[j][1] as BasicRunnable);
            }

            // other Appendables
            Basic.test(new java.io.PrintStream(Basic.gos), a, Basic.testPrintStream);
            Basic.test(java.nio.CharBuffer.allocate(128), a, Basic.testCharBuffer);
            Basic.test(java.nio.ByteBuffer.allocateDirect(128).asCharBuffer(), a, Basic.testCharBuffer);
            Basic.test(new java.lang.StringBuffer(), a, Basic.testStringBuffer);
            Basic.test(new java.lang.StringBuilder(), a, Basic.testStringBuilder);
        }

        expect(Basic.#fail).toBe(0);
        /*if (Basic.#fail !== 0) {
            throw new java.lang.RuntimeException((Basic.#fail + Basic.#pass) + " tests: "
                + Basic.#fail + " failure(s), first", Basic.#first);
        } else {
            java.lang.System.out.println("all " + (Basic.#fail + Basic.#pass) + " tests passed");
        }*/

    }

    protected static pass(): void {
        Basic.#pass++;
    }

    protected static fail(ex: java.lang.Throwable): void;
    protected static fail(fs: java.lang.String | string, ex: java.lang.Throwable): void;
    protected static fail(fs: java.lang.String | string, exp: java.lang.String, got: java.lang.String): void;
    protected static fail(...args: unknown[]): void {
        switch (args.length) {
            case 1: {
                const [ex] = args as [java.lang.Throwable];

                if (Basic.#first === null) {
                    Basic.#first = ex;
                }

                java.lang.System.err.println("FAILED: unexpected exception");
                Basic.#fail++;

                break;
            }

            case 2: {
                const [fs, ex] = args as [java.lang.String | string, java.lang.Throwable];

                const s = "'" + fs + "': " + ex.getClass().getName() + " not thrown";
                if (Basic.#first === null) {

                    Basic.#first = ex;
                }

                java.lang.System.err.println("FAILED: " + s);
                Basic.#fail++;

                break;
            }

            case 3: {
                const [fs, exp, got] = args as [java.lang.String | string, java.lang.String, java.lang.String];

                //expect(exp).toBe(got);
                const s = "'" + fs + "': Expected '" + exp + "', got '" + got + "'";
                if (Basic.#first === null) {

                    Basic.#first = new java.lang.RuntimeException(s);
                }

                java.lang.System.err.println("FAILED: " + s);
                Basic.#fail++;

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    protected static ck(s: string, exp: java.lang.String, got: java.lang.String): void {
        if (exp.valueOf() !== got.valueOf()) {
            debugger;
        }

        expect(got.valueOf()).toEqual(exp.valueOf());
        /*if (!exp.equals(got)) {
            Basic.fail(s, exp, got);
        } else {

            Basic.pass();
        }*/

    }

    private static newFile(): java.io.File | null {
        let f = null;
        try {
            f = java.io.File.createTempFile("append", ".txt");
            f.deleteOnExit();
        } catch (x) {
            if (x instanceof java.io.IOException) {
                Basic.fail(x);
            } else {
                throw x;
            }
        }

        return f;
    }

    private static test = (a: java.lang.Appendable, csq: java.lang.CharSequence, thunk: BasicRunnable): void => {
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
                if (x instanceof java.io.IOException) {
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
                    new java.lang.IndexOutOfBoundsException());
                a = thunk.reset(a);
            } catch (x) {
                if (x instanceof java.lang.IndexOutOfBoundsException) {
                    Basic.pass();
                } else if (x instanceof java.io.IOException) {
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
            if (x instanceof java.io.IOException) {
                Basic.fail(x);
            } else {
                throw x;
            }
        }
    };

}
