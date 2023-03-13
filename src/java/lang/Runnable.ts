/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/**
 * The Runnable interface should be implemented by any class whose instances are intended to be executed by a thread.
 * The class must define a method of no arguments called run.
 */
export interface Runnable {
    /**
     * When an object implementing interface Runnable is used to create a thread, starting the thread causes
     * the object's run method to be called in that separately executing thread.
     */
    run(): void;
}
