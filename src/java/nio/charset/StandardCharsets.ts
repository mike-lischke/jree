/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object.js";
import { Charset } from "./Charset.js";

export class StandardCharsets extends JavaObject {
    /** ISO Latin Alphabet No. */
    public static readonly ISO_8859_1 = Charset.forName("ISO-8859-1")!;

    /** Seven-bit ASCII, a.k.a. */
    public static readonly US_ASCII = Charset.forName("US-ASCII")!;

    /** Sixteen-bit UCS Transformation Format, byte order identified by an optional byte-order mark */
    public static readonly UTF_16 = Charset.forName("UTF-16")!;

    /** Sixteen-bit UCS Transformation Format, big-endian byte order */
    //public static readonly UTF_16BE: Charset;

    /** Sixteen-bit UCS Transformation Format, little-endian byte order */
    public static readonly UTF_16LE = Charset.forName("UTF-16LE")!;

    /** Eight-bit UCS Transformation Format */
    public static readonly UTF_8 = Charset.forName("UTF-8")!;

    private constructor() {
        super();
    }
}
