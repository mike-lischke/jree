/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeException } from "../lang/RuntimeException.js";
import type { JavaString } from "../lang/String.js";
import { Throwable } from "../lang/Throwable.js";

/**
 * Thrown by various accessor methods to indicate that the element being requested
 * does not exist.
 */
export class NoSuchElementException extends RuntimeException {
    public constructor();
    public constructor(cause: Throwable);
    public constructor(s: JavaString | string);
    public constructor(s: JavaString | string, cause: Throwable);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                if (args[0] instanceof Throwable) {
                    this.initCause(args[0]);
                } else if (typeof args[0] === "string") {
                    this.setMessage(args[0]);
                } else {
                    this.setMessage(args[0] as JavaString);
                }

                break;
            }
            case 2: {
                this.initCause(args[1] as Throwable);
                this.setMessage(args[0] as JavaString);
                break;
            }

            default:
        }
    }
}
