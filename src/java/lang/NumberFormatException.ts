/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IllegalArgumentException } from "./IllegalArgumentException";

/**
 * Thrown to indicate that the application has attempted to convert a string to one of the numeric types,
 * but that the string does not have the appropriate format.
 */
export class NumberFormatException extends IllegalArgumentException {
}
