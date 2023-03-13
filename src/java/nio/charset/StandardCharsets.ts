/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../../lang/Object";
import { JavaString } from "../../lang/String";
import { Charset } from "./Charset";

export class StandardCharsets extends JavaObject {
    /** ISO Latin Alphabet No. */
    public static readonly ISO_8859_1: Charset;

    /** Seven-bit ASCII, a.k.a. */
    public static readonly US_ASCII: Charset;

    /** Sixteen-bit UCS Transformation Format, byte order identified by an optional byte-order mark */
    public static readonly UTF_16: Charset;

    /** Sixteen-bit UCS Transformation Format, big-endian byte order */
    //public static readonly UTF_16BE: Charset;

    /** Sixteen-bit UCS Transformation Format, little-endian byte order */
    public static readonly UTF_16LE: Charset;

    /** Eight-bit UCS Transformation Format */
    public static readonly UTF_8: Charset;

    private constructor() {
        super();
    }

    static {
        setTimeout(() => {
            // @ts-ignore
            StandardCharsets.ISO_8859_1 = Charset.forName(new JavaString("ISO-8859-1"))!;
            // @ts-ignore
            StandardCharsets.US_ASCII = Charset.forName(new JavaString("US-ASCII"))!;
            // @ts-ignore
            StandardCharsets.UTF_16 = Charset.forName(new JavaString("UTF-16"))!;
            // @ts-ignore
            StandardCharsets.UTF_16LE = Charset.forName(new JavaString("UTF-16LE"))!;
            // @ts-ignore
            StandardCharsets.UTF_8 = Charset.forName(new JavaString("UTF-8"))!;
        }, 0);
    }
}
