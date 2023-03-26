/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import type { char } from "../../types";

import type { CharSequence } from "./CharSequence";
import type { IReflection } from "./Object";

export interface Appendable extends IReflection {
    /** Appends the specified character to this Appendable. */
    append(c: char): this;

    /** Appends the specified character sequence to this Appendable. */
    append(csq: CharSequence | null): this;

    /** Appends a subsequence of the specified character sequence to this Appendable. */
    append(csq: CharSequence | null, start: number, end: number): this;
}
