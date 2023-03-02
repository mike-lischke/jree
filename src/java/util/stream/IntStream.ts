/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Integer } from "../../lang/Integer";
import { BaseStream } from "./BaseStream";

export interface IntStream extends BaseStream<Integer, IntStream> {
    /** @returns an empty sequential IntStream. */
    empty(): IntStream;
}
