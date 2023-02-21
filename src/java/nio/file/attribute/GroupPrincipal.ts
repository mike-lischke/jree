/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../../../..";

/**
 * A UserPrincipal representing a group identity, used to determine access rights to objects in a file system.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupPrincipal extends java.nio.file.attribute.UserPrincipal {
}
