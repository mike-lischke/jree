/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object";

/**
 * Represents a supplier of results.
 * There is no requirement that a new or distinct result be returned each time the supplier is invoked.
 * This is a functional interface whose functional method is get().
 */
export interface Supplier<T> {
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    /* get*/(): T;
}

export abstract class Supplier<T> extends JavaObject implements Supplier<T> {
    public abstract get(): T;
}
