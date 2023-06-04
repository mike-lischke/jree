/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../../NotImplementedError";
import { CloneNotSupportedException } from "../CloneNotSupportedException";
import { JavaObject } from "../Object";

/**
 * Abstract base class for reference objects. This class defines the operations common to all reference objects.
 * Because reference objects are implemented in close cooperation with the garbage collector, this class may not be
 * subclassed directly.
 */
export abstract class Reference<T> extends JavaObject {
    /**
     * Ensures that the object referenced by the given reference remains strongly reachable, regardless of any prior
     * actions of the program that might otherwise cause the object to become unreachable; thus, the referenced
     * object is not reclaimable by garbage collection at least until after the invocation of this method.
     *
     * @param ref the reference.
     */
    public static reachabilityFence<T>(ref: T): void {
        throw new NotImplementedError();
    }

    /**
     * @throws CloneNotSupportedException Always.
     */
    public override clone(): JavaObject {
        throw new CloneNotSupportedException();
    }

    /** Clears this reference object. */
    public abstract clear(): void;

    /** Clears this reference object and enqueue it, if it is registered with a queue. */
    public abstract enqueue(): boolean;

    /** Returns this reference object's referent. */
    public abstract get(): T | null;

    /**
     * Tells whether or not this reference object has been enqueued, either by the program or by the garbage collector.
     */
    public abstract isEnqueued(): boolean;

}
