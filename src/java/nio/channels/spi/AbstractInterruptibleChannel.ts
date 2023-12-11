/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../../lang/Object.js";
import { Channel } from "../Channel.js";
import { InterruptibleChannel } from "../InterruptibleChannel.js";

export abstract class AbstractInterruptibleChannel extends JavaObject
    implements Channel, InterruptibleChannel {

    #closed = false;

    /** Initializes a new instance of this class. */
    protected constructor() {
        super();
    }

    /** Close this channel. */
    public close(): void {
        if (!this.#closed) {
            this.#closed = true;
            this.implCloseChannel();
        }
    }

    public isOpen(): boolean {
        return !this.#closed;
    }

    /**
     * Marks the beginning of an I/O operation that might block infinitely.
     *
     * Note: since we don't have a thread model, this is a no-op.
     */
    protected begin(): void {
        // Nothing to do here.
    }

    /**
     * Marks the end of an I/O operation that might block infinitely.
     *
     * Note: since we don't have a thread model, this is a no-op.
     */
    protected end(): void {
        // Nothing to do here.
    }

    protected abstract implCloseChannel(): void;
}
