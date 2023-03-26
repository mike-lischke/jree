/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../lang/Object";

/**
 * Represents a supplier of results.
 * There is no requirement that a new or distinct result be returned each time the supplier is invoked.
 * This is a functional interface whose functional method is get().
 */
export interface Supplier<T> extends IReflection {
    get(): T;
}
