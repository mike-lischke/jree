/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "./Object";

/**
 * The Runnable interface should be implemented by any class whose instances are intended to be executed by a thread.
 * The class must define a method of no arguments called run.
 */
export interface Runnable extends IReflection {
    /**
     * When an object implementing interface Runnable is used to create a thread, starting the thread causes
     * the object's run method to be called in that separately executing thread.
     */
    run(): void;
}
