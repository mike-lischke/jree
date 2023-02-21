/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { AttributeView } from "./AttributeView";

/**
 * An attribute view that is a read-only or updatable view of the attributes of a FileStore.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FileStoreAttributeView extends AttributeView {
    // This is just a specialized attribute view.
}
