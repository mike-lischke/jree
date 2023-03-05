/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../../lang/String";

/** The result of a match operation. */
export interface MatchResult {
    /** Returns the offset after the last character matched. */
    end(): number;

    /** Returns the offset after the last character of the subsequence captured by the given group during this match. */
    end(group: number): number;

    /** Returns the input subsequence matched by the previous match. */
    group(): JavaString;

    /** Returns the input subsequence captured by the given group during the previous match operation. */
    group(group: number): JavaString;

    /** Returns the number of capturing groups in this match result's pattern. */
    groupCount(): number;

    /** Returns the start index of the subsequence captured by the given group during this match. */
    start(group: number): number;

    /** Returns the start index of the subsequence captured by the given group during this match. */
    start(): number;
}
