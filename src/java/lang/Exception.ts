/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Throwable } from "./Throwable";

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
