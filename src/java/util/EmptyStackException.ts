/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeException } from "../lang/RuntimeException.js";

/**
 * Thrown by methods in the Stack class to indicate that the stack is empty.
 */
export class EmptyStackException extends RuntimeException {
}
