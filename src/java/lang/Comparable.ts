/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { int } from "../../types";

import { IReflection } from "./Object";

/**
 * This interface imposes a total ordering on the objects of each class that implements it. This ordering is referred
 * to as the class's natural ordering, and the class's compareTo method is referred to as its natural comparison method.
 */
export interface Comparable<T> extends IReflection {
    compareTo(o: T): int;
}
