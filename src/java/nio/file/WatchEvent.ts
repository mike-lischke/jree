/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "../../lang/Object";
import { JavaString } from "../../lang/String";

/**
 * An event or a repeated event for an object that is registered with a watch service.
 */
export interface WatchEvent<T> extends IReflection {
    /**
     * An event kind, for the purposes of identification.
     *
     * @returns the event kind.
     */
    context(): T;

    /**
     * @returns the event count.
     */
    count(): number;

    /**
     * @returns the event kind.
     */
    kind(): WatchEvent.Kind<T>;
}

export namespace WatchEvent {
    /**
     * An event kind, for the purposes of identification.
     */
    export interface Kind<T> extends IReflection {
        /**
         * @returns the name of the event kind.
         */
        name(): JavaString;

        /**
         * @returns the type of the context value.
         */
        type(): T;
    }

    /**
     * An event modifier that qualifies how a WatchEvent is registered with a WatchService.
     */
    export interface Modifier extends IReflection {
        /**
         * @returns the name of the modifier.
         */
        name(): JavaString;
    }
}
