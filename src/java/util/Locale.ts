/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { final } from "../..";
import { Serializable } from "../io/Serializable";
import { Cloneable } from "../lang/Cloneable";
import { JavaObject } from "../lang/Object";

/** A Locale object represents a specific geographical, political, or cultural region. */
@final
export class Locale extends JavaObject implements Cloneable<Locale>, Serializable {
    /**
     * Gets the current value of the default locale for this instance of the Java Virtual Machine.
     *
     * @returns The current default locale.
     */
    public static getDefault(): Locale {
        return new Locale();
    }

    public override clone(): Locale {
        return this;
    }
}
