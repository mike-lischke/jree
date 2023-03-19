/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "../lang/Object";

export interface Flushable extends IReflection {
    /** Flushes this stream by writing any buffered output to the underlying stream. */
    flush(): void;
}
