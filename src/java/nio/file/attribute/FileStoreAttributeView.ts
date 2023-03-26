/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AttributeView } from "./AttributeView";

/**
 * An attribute view that is a read-only or updatable view of the attributes of a FileStore.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileStoreAttributeView extends AttributeView {
    // This is just a specialized attribute view.
}
