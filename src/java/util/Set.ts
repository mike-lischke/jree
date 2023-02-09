/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";

// The set interface does not add any new method to the Collection interface.

export type Set<T> = java.util.Collection<T>;
