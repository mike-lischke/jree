/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
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
