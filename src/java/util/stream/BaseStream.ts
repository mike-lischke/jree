/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AutoCloseable } from "../../lang/AutoCloseable";
import { Spliterator } from "../Spliterator";

/**
 * Base interface for streams, which are sequences of elements supporting sequential and parallel aggregate operations.
 */
export interface BaseStream<T, S extends BaseStream<T, S>> extends AutoCloseable {
    /** Closes this stream, causing all close handlers for this stream pipeline to be called. */
    close(): void;

    /** @returns whether this stream, if a terminal operation were to be executed, would execute in parallel. */
    isParallel(): boolean;

    /** @returns an iterator for elements of this stream. */
    iterator(): Iterator<T>;

    /** @returns an equivalent stream with an additional close handler. */
    onClose(action: () => void): S;

    /** @returns an equivalent stream that is parallel. */
    parallel(): S;

    /** @returns an equivalent stream that is sequential. */
    sequential(): S;

    spliterator(): Spliterator<T>;

    /** @returns an equivalent stream that is unordered. */
    unordered(): S;

}
