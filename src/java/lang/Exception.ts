/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Throwable } from "./Throwable.js";

/**
 * Exception is the superclass of those exceptions that can be thrown during the normal operation of the
 * Java Virtual Machine.
 *
 * An application might want to catch particular exceptions while letting the runtime system handle others.
 * The Exception class and its subclasses are a form of Throwable that indicates conditions that a reasonable
 * application might want to catch.
 */
export class Exception extends Throwable {
}
