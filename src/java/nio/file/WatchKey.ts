/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "../../lang/Object";
import { List } from "../../util/List";
import { Watchable } from "./Watchable";
import { WatchEvent } from "./WatchEvent";

export interface WatchKey extends IReflection {
    cancel(): boolean;
    isValid(): boolean;
    pollEvents(): List<WatchEvent<unknown>>;
    reset(): boolean;
    watchable(): Watchable;
}
