/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { RuntimeException } from "../lang";

/**
 * Thrown by methods in the Stack class to indicate that the stack is empty.
 */
export class EmptyStackException extends RuntimeException {
}
