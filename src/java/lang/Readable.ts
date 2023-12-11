/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CharBuffer } from "../nio/CharBuffer.js";
import { IReflection } from "./Object.js";

export interface Readable extends IReflection {
    /** Attempts to read characters into the specified character buffer. */
    read(cb: CharBuffer): number;
}
