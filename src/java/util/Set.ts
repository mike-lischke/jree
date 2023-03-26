/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Collection } from "./Collection";

/**
 * A collection that contains no duplicate elements. More formally, sets contain no pair of elements e1 and e2 such
 * that e1.equals(e2), and at most one null element. As implied by its name, this interface models the mathematical
 * set abstraction.
 */
export interface JavaSet<T> extends Collection<T> {
    add(e: T): boolean;
}

export class JavaSet<T> extends Collection<T> {
}
