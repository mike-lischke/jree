/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { RuntimeException } from "../lang/RuntimeException";

/**
 * This exception may be thrown by methods that have detected concurrent modification of an object when such
 * modification is not permissible.
 */
export class ConcurrentModificationException extends RuntimeException {
}
