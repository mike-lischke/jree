/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../..";

/**
 * An object that encapsulates the value of a file attribute that can be set atomically when creating a new file
 * or directory by invoking the createFile or createDirectory methods.
 */
export interface FileAttribute<T> {
    name(): java.lang.String;
    value(): T;
}
