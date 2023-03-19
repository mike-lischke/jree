/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "./Object";

export interface Comparable<T> extends IReflection {
    compareTo(o: T): number;
}
