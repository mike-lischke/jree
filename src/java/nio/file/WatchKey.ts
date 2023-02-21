/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

export interface WatchKey {
    cancel(): boolean;
    isValid(): boolean;
    pollEvents(): java.util.List<java.nio.file.WatchEvent<unknown>>;
    reset(): boolean;
    watchable(): java.nio.file.Watchable;
}
