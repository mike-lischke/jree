/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { Enum } from "../../../lang/Enum";
import { JavaString } from "../../../lang/String";

export class PosixFilePermission extends Enum<PosixFilePermission> {
    /** Execute permission, group */
    public static readonly GROUP_EXECUTE = new PosixFilePermission(new JavaString("GROUP_EXECUTE"), 5);

    /** Read permission, group */
    public static readonly GROUP_READ = new PosixFilePermission(new JavaString("GROUP_READ"), 3);

    /** Write permission, group */
    public static readonly GROUP_WRITE = new PosixFilePermission(new JavaString("GROUP_WRITE"), 4);

    /** Execute permission, others */
    public static readonly OTHERS_EXECUTE = new PosixFilePermission(new JavaString("OTHERS_EXECUTE"), 8);

    /** Read permission, others */
    public static readonly OTHERS_READ = new PosixFilePermission(new JavaString("OTHERS_READ"), 6);

    /** Write permission, others */
    public static readonly OTHERS_WRITE = new PosixFilePermission(new JavaString("OTHERS_WRITE"), 7);

    /** Execute permission, owner */
    public static readonly OWNER_EXECUTE = new PosixFilePermission(new JavaString("OWNER_EXECUTE"), 2);

    /** Read permission, owner */
    public static readonly OWNER_READ = new PosixFilePermission(new JavaString("OWNER_READ"), 0);

    /** Write permission, owner */
    public static readonly OWNER_WRITE = new PosixFilePermission(new JavaString("OWNER_WRITE"), 1);
}
