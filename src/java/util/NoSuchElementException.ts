/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";

/**
 * Thrown by various accessor methods to indicate that the element being requested
 * does not exist.
 */
export class NoSuchElementException extends java.lang.RuntimeException {
    public constructor();
    public constructor(cause: java.lang.Throwable);
    public constructor(s: java.lang.String);
    public constructor(s: java.lang.String, cause: java.lang.Throwable);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                if (args[0] instanceof java.lang.Throwable) {
                    this.initCause(args[0]);
                } else if (args[0] instanceof java.lang.String) {
                    this.setMessage(args[0]);
                }
                break;
            }
            case 2: {
                this.initCause(args[1] as java.lang.Throwable);
                this.setMessage(args[0] as java.lang.String);
                break;
            }

            default:
        }
    }
}
