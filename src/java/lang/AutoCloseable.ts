/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "./Object.js";

export interface AutoCloseable extends IReflection {
    /** Closes this resource, relinquishing any underlying resources. */
    close(): void;
}
