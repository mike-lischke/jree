/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../../lang/Object.js";
import { JavaString } from "../../../lang/String.js";
import { GroupPrincipal } from "./GroupPrincipal.js";
import { UserPrincipal } from "./UserPrincipal.js";

/**
 * An object to lookup user and group principals by name. This class is used to lookup user and group principals by
 * name. The lookup methods may not be supported by all file systems. Where supported, the principal returned by
 * the lookup methods is associated with the file system. The principal may or may not be
 * {@link java.nio.file.attribute.UserPrincipal}
 * or {@link java.nio.file.attribute.GroupPrincipal} depending on the file system.
 */
export abstract class UserPrincipalLookupService extends JavaObject {
    /**
     * Initializes a new instance of this class.
     */
    protected constructor() {
        super();
    }

    /**
     * Looks up a group principal by group name.
     *
     * @param name The group name.
     *
     * @returns The group principal.
     */
    public abstract lookupPrincipalByGroupName(name: JavaString): GroupPrincipal;

    /**
     * Looks up a user principal by name.
     *
     * @param name The user name.
     *
     * @returns The user principal.
     */
    public abstract lookupPrincipalByName(name: JavaString): UserPrincipal;
}
