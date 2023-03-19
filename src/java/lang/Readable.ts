/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { CharBuffer } from "../nio/CharBuffer";
import { IReflection } from "./Object";

export interface Readable extends IReflection {
    /** Attempts to read characters into the specified character buffer. */
    read(cb: CharBuffer): number;
}
