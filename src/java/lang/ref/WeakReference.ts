/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../Object.js";
import { Reference } from "./Reference.js";

export class WeakReference<T extends JavaObject> extends Reference<T> {
    #ref: WeakRef<T> | null;

    /**
     * Creates a new weak reference that refers to the given object.
     *
     * @param referent The object the new weak reference will refer to.
     */
    public constructor(referent: T) {
        super();
        this.#ref = new WeakRef(referent);
    }

    /** Clears this reference object. */
    public override clear(): void {
        this.#ref = null;
    }

    /**
     * Clears this reference object and enqueue it, if it is registered with a queue.
     *
     * @returns `true` if this reference object was successfully enqueued; `false` if it was already enqueued or if it
     *          was not registered with a queue when it was created.
     */
    public override enqueue(): boolean {
        this.#ref = null;

        return false;
    }

    /** @returns this reference object's referent. */
    public override get(): T | null {
        return this.#ref?.deref() ?? null;
    }

    /**
     * Tells whether or not this reference object has been enqueued, either by the program or by the garbage collector.
     *
     * @returns `true` if and only if this reference object has been enqueued.
     */
    public override isEnqueued(): boolean {
        return false;
    }
}
