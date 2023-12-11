/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Integer } from "../../lang/Integer.js";
import { BaseStream } from "./BaseStream.js";

export interface IntStream extends BaseStream<Integer, IntStream> {
    /** @returns an empty sequential IntStream. */
    empty(): IntStream;
}
