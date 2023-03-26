/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Long } from "../../lang/Long";
import { BaseStream } from "./BaseStream";

export interface LongStream extends BaseStream<Long, LongStream> {
    /** @returns an empty sequential IntStream. */
    empty(): LongStream;
}
