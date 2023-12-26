/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection, JavaObject } from "../../lang/Object.js";
import { WatchEvent } from "./WatchEvent.js";
import { WatchKey } from "./WatchKey.js";
import { WatchService } from "./WatchService.js";

/**
 * An object that may be registered with a watch service so that it can be watched for changes and events.
 */
export interface Watchable extends IReflection {
    /** Registers an object with a watch service. */
    register(watcher: WatchService,
        ...events: Array<WatchEvent.Kind<JavaObject>>): WatchKey;

    /** Registers an object with a watch service. */
    register(watcher: WatchService, events: Array<WatchEvent.Kind<JavaObject>>,
        ...modifiers: WatchEvent.Modifier[]): WatchKey;
}
