/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError.js";
import { char, int } from "../../types.js";

import { JavaString } from "../lang/String.js";
import { IntStream } from "../util/stream/IntStream.js";
import { IReflection } from "./Object.js";

/** A CharSequence is a readable sequence of char values. */
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

export class CharSequence implements CharSequence {
    /** Returns a stream of int zero-extending the char values from this sequence. */
    public static chars(): IntStream {
        throw new NotImplementedError();
    }

    /** Returns a stream of code point values from this sequence. */
    public static codePoints(): IntStream {
        throw new NotImplementedError();
    }

    /**
     * Compares two CharSequence instances lexicographically.
     *
     * @param cs1 The first CharSequence.
     * @param cs2 The second CharSequence.
     *
     * @returns the value 0 if the two CharSequence are equal; a negative integer if the first CharSequence is
     *          lexicographically less than the second; or a positive integer if the first CharSequence is
     *          lexicographically greater than the second.
     */
    public static compare(cs1: CharSequence, cs2: CharSequence): int {
        const xLen = cs1.length();
        const yLen = cs2.length();
        const lim = Math.min(xLen, yLen);
        let k = 0;
        while (k < lim) {
            const xChar = cs1.charAt(k);
            const yChar = cs2.charAt(k);
            if (xChar !== yChar) {
                return xChar! - yChar!;
            }
            k++;
        }

        return xLen - yLen;
    }
}
