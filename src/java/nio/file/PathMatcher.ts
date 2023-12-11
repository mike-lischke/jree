/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../lang/Object.js";
import { Path } from "./Path.js";

/**
 * An interface that is implemented by objects that perform match operations on paths.
 */
// @FunctionalInterface
export interface PathMatcher extends IReflection {
    /**
     * Tells if a given path matches this matcher's pattern.
     *
     * @param path The path to match against.
     *
     * @returns true if, and only if, the path matches this matcher's pattern.
     */
    matches(path: Path): boolean;
}
