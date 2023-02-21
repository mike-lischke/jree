/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../..";

/**
 * A watch service that watches registered objects for changes and events. For example a file manager may use a
 * watch service to monitor a directory for changes so that it can update its display of the list of files when
 * files are created or deleted.
 */
export interface WatchService extends java.lang.AutoCloseable, java.lang.Iterable<java.nio.file.WatchKey> {
    /** Closes this watch service. */
    close(): void;

    /** Retrieves and removes the next watch key, or null if none are present. */
    poll(): java.nio.file.WatchKey;

    /**
     * Retrieves and removes the next watch key, waiting if necessary up to the specified wait time if none are
     * yet present.
     */
    // poll(timeout: number, unit: java.util.concurrent.TimeUnit): java.nio.file.WatchKey;

    /** Retrieves and removes the next watch key, waiting if necessary if none are yet present. */
    take(): java.nio.file.WatchKey;
}
