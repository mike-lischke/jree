/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Long } from "../../lang/Long";
import { BaseStream } from "./BaseStream";

export interface LongStream extends BaseStream<Long, LongStream> {
    /** @returns an empty sequential IntStream. */
    empty(): LongStream;
}
