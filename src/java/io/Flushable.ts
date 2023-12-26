/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../lang/Object.js";

export interface Flushable extends IReflection {
    /** Flushes this stream by writing any buffered output to the underlying stream. */
    flush(): void;
}
