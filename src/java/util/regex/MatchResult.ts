/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../lang/Object.js";
import { JavaString } from "../../lang/String.js";

/** The result of a match operation. */
export interface MatchResult extends IReflection {
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
