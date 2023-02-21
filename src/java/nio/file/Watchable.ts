/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/**
 * An object that may be registered with a watch service so that it can be watched for changes and events.
 */
export interface Watchable {
    /** Registers an object with a watch service. */
    register(watcher: java.nio.file.WatchService,
        ...events: Array<java.nio.file.WatchEvent.Kind<unknown>>): java.nio.file.WatchKey;

    /** Registers an object with a watch service. */
    register(watcher: java.nio.file.WatchService, events: Array<java.nio.file.WatchEvent.Kind<unknown>>,
        ...modifiers: java.nio.file.WatchEvent.Modifier[]): java.nio.file.WatchKey;
}
