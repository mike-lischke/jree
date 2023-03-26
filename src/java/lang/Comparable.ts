/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../types";

import { IReflection } from "./Object";

export interface Comparable<T> extends IReflection {
    compareTo(o: T): int;
}
