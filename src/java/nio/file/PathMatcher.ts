/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/**
 * An interface that is implemented by objects that perform match operations on paths.
 */
// @FunctionalInterface
export interface PathMatcher {
    /**
     * Tells if a given path matches this matcher's pattern.
     *
     * @param path The path to match against.
     *
     * @returns true if, and only if, the path matches this matcher's pattern.
     */
    matches(path: java.nio.file.Path): boolean;
}
