/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { char } from "../../types";
import { CharSequence } from "./CharSequence";

export interface Appendable {
    /** Appends the specified character to this Appendable. */
    append(c: char): this;

    /** Appends the specified character sequence to this Appendable. */
    append(csq: CharSequence): this;

    /** Appends a subsequence of the specified character sequence to this Appendable. */
    append(csq: CharSequence, start: number, end: number): this;
}
