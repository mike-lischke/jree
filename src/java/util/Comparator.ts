/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection, JavaObject } from "../lang/Object";

export interface Comparator<T> extends IReflection {
    compare?: (o1: T, o2: T) => number;
    equals?: (obj: JavaObject) => boolean;
}
