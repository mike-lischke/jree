/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../../../..";
import { S } from "../../../../templates";
import { IllegalArgumentException } from "../../../lang/IllegalArgumentException";
import { JavaObject } from "../../../lang/Object";
import { StringBuilder } from "../../../lang/StringBuilder";
import { HashSet } from "../../../util/HashSet";
import { JavaSet } from "../../../util/Set";
import { FileAttribute } from "./FileAttribute";
import { PosixFilePermission } from "./PosixFilePermission";

type PosixFilePermissionSet = JavaSet<PosixFilePermission>;

export class PosixFilePermissions extends JavaObject {
    /**
     * Creates a {@code FileAttribute} view of a given {@code Set} of {@code PosixFilePermission}.
     *
     * @param permissions the set of permissions
     *
     * @returns a file attribute view of the permissions
     */
    public static asFileAttribute(permissions: PosixFilePermissionSet)
        : FileAttribute<PosixFilePermissionSet> {
        return {
            name: () => { return S`posix:permissions`; },
            value: () => { return permissions; },
        };
    }

    /**
     * Returns the set of permissions corresponding to a given String representation.
     *
     * @param perms the string representing the permissions
     *
     * @returns the set of permissions
     */
    public static fromString(perms: JavaString): PosixFilePermissionSet {
        const result = new HashSet<PosixFilePermission>();
        if (perms.length() !== 9) {
            throw new IllegalArgumentException(S`Invalid mode: ${perms}`);
        }

        // Posix permissions are 3 groups for read, write and execute.
        // The first group is for the owner, the second for the group and the third for others.
        // A minus sign means no permission for a particular element.

        const s = `${perms}`;
        const checkElement = (value: string, expected: string): boolean => {
            const t = value === expected;
            if (value !== "-" && !t) {
                throw new IllegalArgumentException(S`Invalid mode: ${perms}`);
            }

            return t;
        };

        if (checkElement(s[0], "r")) {
            result.add(PosixFilePermission.OWNER_READ);
        }

        if (checkElement(s[1], "w")) {
            result.add(PosixFilePermission.OWNER_WRITE);
        }

        if (checkElement(s[2], "x")) {
            result.add(PosixFilePermission.OWNER_EXECUTE);
        }

        if (checkElement(s[3], "r")) {
            result.add(PosixFilePermission.GROUP_READ);
        }

        if (checkElement(s[4], "w")) {
            result.add(PosixFilePermission.GROUP_WRITE);
        }

        if (checkElement(s[5], "x")) {
            result.add(PosixFilePermission.GROUP_EXECUTE);
        }

        if (checkElement(s[6], "r")) {
            result.add(PosixFilePermission.OTHERS_READ);

        }

        if (checkElement(s[7], "w")) {
            result.add(PosixFilePermission.OTHERS_WRITE);
        }

        if (checkElement(s[8], "x")) {
            result.add(PosixFilePermission.OTHERS_EXECUTE);
        }

        return result;
    }

    /**
     * Returns the String representation of a given set of permissions.
     *
     * @param permissions the set of permissions
     *
     * @returns the string representation of the permissions
     */
    public static override toString(permissions: PosixFilePermissionSet): string;
    public static override toString(permissions: PosixFilePermissionSet): JavaString;
    public static override toString(permissions: PosixFilePermissionSet): JavaString | string {
        const result = new StringBuilder(9);
        result.append(permissions.contains(PosixFilePermission.OWNER_READ) ? "r" : "-");
        result.append(permissions.contains(PosixFilePermission.OWNER_WRITE) ? "w" : "-");
        result.append(permissions.contains(PosixFilePermission.OWNER_EXECUTE) ? "x" : "-");
        result.append(permissions.contains(PosixFilePermission.GROUP_READ) ? "r" : "-");
        result.append(permissions.contains(PosixFilePermission.GROUP_WRITE) ? "w" : "-");
        result.append(permissions.contains(PosixFilePermission.GROUP_EXECUTE) ? "x" : "-");
        result.append(permissions.contains(PosixFilePermission.OTHERS_READ) ? "r" : "-");
        result.append(permissions.contains(PosixFilePermission.OTHERS_WRITE) ? "w" : "-");
        result.append(permissions.contains(PosixFilePermission.OTHERS_EXECUTE) ? "x" : "-");

        return result.toString();
    }
}
