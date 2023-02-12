/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IllegalArgumentException } from "./IllegalArgumentException";

/**
 * Thrown to indicate that the application has attempted to convert a string to one of the numeric types,
 * but that the string does not have the appropriate format.
 */
export class NumberFormatException extends IllegalArgumentException {
}
