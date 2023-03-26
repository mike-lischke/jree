/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../../../lang/Object";
import { JavaString } from "../../../lang/String";

/**
 * An object that provides a read-only or updatable view of non-opaque values associated with an object in a
 * filesystem. This interface is extended or implemented by specific attribute views that define the attributes
 * supported by the view. A specific attribute view will typically define type-safe methods to read or update the
 * attributes that it supports.
 */
export interface AttributeView extends IReflection {
    /**
     * Returns the name of the attribute view. Attribute views of the same type have the same name. The name of an
     * attribute view is used when requesting the view from a {@link java.nio.file.Files} class method.
     *
     * @returns The name of the attribute view.
     */
    name(): JavaString;
}
