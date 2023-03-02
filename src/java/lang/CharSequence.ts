/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { char } from ".";

export interface CharSequence {
    /** Returns the 16 bit char value at the specified index. */
    charAt(index: number): char | null;

    /** Returns the length of this character sequence. */
    length(): number;

    /** Returns a new CharSequence that is a subsequence of this sequence. */
    subSequence(start: number, end: number): CharSequence;

    /** Returns a string containing the characters in this sequence in the same order as this sequence. */
    toString(): string;
}
