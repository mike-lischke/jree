/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { IReflection } from "../../lang/Object";
import { WatchEvent } from "./WatchEvent";
import { WatchKey } from "./WatchKey";
import { WatchService } from "./WatchService";

/**
 * An object that may be registered with a watch service so that it can be watched for changes and events.
 */
export interface Watchable extends IReflection {
    /** Registers an object with a watch service. */
    register(watcher: WatchService,
        ...events: Array<WatchEvent.Kind<unknown>>): WatchKey;

    /** Registers an object with a watch service. */
    register(watcher: WatchService, events: Array<WatchEvent.Kind<unknown>>,
        ...modifiers: WatchEvent.Modifier[]): WatchKey;
}
