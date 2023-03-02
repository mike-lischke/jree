/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../../templates";
import { JavaObject } from "../../lang/Object";
import { Charset } from "./Charset";

export class StandardCharsets extends JavaObject {
    /** ISO Latin Alphabet No. */
    public static readonly ISO_8859_1 = Charset.forName(S`ISO-8859-1`)!;

    /** Seven-bit ASCII, a.k.a. */
    public static readonly US_ASCII = Charset.forName(S`US-ASCII`)!;

    /** Sixteen-bit UCS Transformation Format, byte order identified by an optional byte-order mark */
    public static readonly UTF_16 = Charset.forName(S`UTF-16`)!;

    /** Sixteen-bit UCS Transformation Format, big-endian byte order */
    //public static readonly UTF_16BE = Charset.forName(S`UTF-16B`");

    /** Sixteen-bit UCS Transformation Format, little-endian byte order */
    public static readonly UTF_16LE = Charset.forName(S`UTF-16LE`)!;

    /** Eight-bit UCS Transformation Format */
    public static readonly UTF_8 = Charset.forName(S`UTF-8`)!;

    private constructor() {
        super();
    }
}
