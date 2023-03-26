/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CharBuffer } from "../nio/CharBuffer";
import { IReflection } from "./Object";

export interface Readable extends IReflection {
    /** Attempts to read characters into the specified character buffer. */
    read(cb: CharBuffer): number;
}
