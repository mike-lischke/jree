/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { StringBuilder } from ".";

// StringBuffer is the same as StringBuilder, but thread-safe (in Java). Thread safety is not required here, though.
export class StringBuffer extends StringBuilder { }
