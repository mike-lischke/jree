/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Serializable } from "../io/Serializable.js";
import { Cloneable } from "../lang/Cloneable.js";
import { JavaObject } from "../lang/Object.js";

/** A Locale object represents a specific geographical, political, or cultural region. */
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
