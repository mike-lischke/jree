/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { char, int } from "../../types";

import { JavaString } from "../lang/String";
import { IReflection } from "./Object";

export interface CharSequence extends IReflection {
    /** Returns the 16 bit char value at the specified index. */
    charAt(index: int): char | null;

    /** Returns the length of this character sequence. */
    length(): int;

    /** Returns a new CharSequence that is a subsequence of this sequence. */
    subSequence(start: int, end: int): CharSequence;

    /** Returns a string containing the characters in this sequence in the same order as this sequence. */
    toString(): JavaString;
}
