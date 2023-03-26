/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../../lang/Object";

/**
 * An attribute view that is a read-only or updatable view of non-opaque values associated with a file in a filesystem.
 * This interface is extended or implemented by specific file attribute views that define methods to read and/or
 * update the attributes of a file.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileAttributeView extends IReflection {
    // No extra members.
}
