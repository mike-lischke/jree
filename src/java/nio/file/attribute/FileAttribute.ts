/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IReflection } from "../../../lang/Object";
import { JavaString } from "../../../lang/String";

/**
 * An object that encapsulates the value of a file attribute that can be set atomically when creating a new file
 * or directory by invoking the createFile or createDirectory methods.
 */
export interface FileAttribute<T> extends IReflection {
    name(): JavaString;
    value(): T;
}
