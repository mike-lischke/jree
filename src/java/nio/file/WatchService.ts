/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AutoCloseable } from "../../lang/AutoCloseable";
import { JavaIterable } from "../../lang/Iterable";
import { WatchKey } from "./WatchKey";

/**
 * A watch service that watches registered objects for changes and events. For example a file manager may use a
 * watch service to monitor a directory for changes so that it can update its display of the list of files when
 * files are created or deleted.
 */
export interface WatchService extends AutoCloseable, JavaIterable<WatchKey> {
    /** Closes this watch service. */
    close(): void;

    /** Retrieves and removes the next watch key, or null if none are present. */
    poll(): WatchKey;

    /**
     * Retrieves and removes the next watch key, waiting if necessary up to the specified wait time if none are
     * yet present.
     */
    // poll(timeout: number, unit: java.util.concurrent.TimeUnit): WatchKey;

    /** Retrieves and removes the next watch key, waiting if necessary if none are yet present. */
    take(): WatchKey;
}
