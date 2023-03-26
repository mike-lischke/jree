/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "./Object";

export interface Cloneable<T> extends IReflection {
    clone(): T;
}
