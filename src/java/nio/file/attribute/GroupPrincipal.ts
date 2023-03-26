/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { UserPrincipal } from "./UserPrincipal";

/**
 * A UserPrincipal representing a group identity, used to determine access rights to objects in a file system.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GroupPrincipal extends UserPrincipal {
}
