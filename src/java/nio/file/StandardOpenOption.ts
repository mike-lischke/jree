/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { S } from "../../../templates";
import { Enum } from "../../lang/Enum";
import { OpenOption } from "./OpenOption";

export class StandardOpenOption extends Enum<StandardOpenOption> implements OpenOption {
    /**
     * If the file is opened for WRITE access then bytes will be written to the end of the file rather than the
     * beginning.
     */
    public static readonly APPEND = new StandardOpenOption(S`APPEND`, 2);

    /** Create new file if it does not exist. */
    public static readonly CREATE = new StandardOpenOption(S`CREATE`, 4);

    /** Create new file, failing if the file already exists. */
    public static readonly CREATE_NEW = new StandardOpenOption(S`CREATE_NEW`, 5);

    /** Delete on close. */
    public static readonly DELETE_ON_CLOSE = new StandardOpenOption(S`DELETE_ON_CLOSE`, 6);

    /**
     * Requires that every update to the file's content or metadata be written synchronously to the underlying storage
     * device.
     */
    public static readonly DSYNC = new StandardOpenOption(S`DSYNC`, 9);

    /** Open for read access. */
    public static readonly READ = new StandardOpenOption(S`READ`, 0);

    /** Sparse file. */
    public static readonly SPARSE = new StandardOpenOption(S`SPARSE`, 7);

    /** Requires that every update to the file's content be written synchronously to the underlying storage device. */
    public static readonly SYNC = new StandardOpenOption(S`SYNC`, 8);

    /** If the file already exists and it is opened for WRITE access then its length is truncated to 0. */
    public static readonly TRUNCATE_EXISTING = new StandardOpenOption(S`TRUNCATE_EXISTING`, 3);

    /** Open for write access, creating the file if it doesn't exist. */
    public static readonly WRITE = new StandardOpenOption(S`WRITE`, 1);
}
