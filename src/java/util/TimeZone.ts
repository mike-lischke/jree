/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError.js";
import { JavaObject } from "../lang/Object.js";
import { JavaString } from "../lang/String.js";
import { Locale } from "./Locale.js";

export class TimeZone extends JavaObject {
    public static readonly SHORT = 0;
    public static readonly LONG = 1;

    public constructor() {
        super();
    }

    /**
     * Gets all the available IDs supported.
     *
     * @returns an array of IDs.
     */
    public static getAvailableIDs(): JavaString[];
    /**
     * Gets the available IDs according to the given time zone offset in milliseconds.
     *
     * @param rawOffset the given time zone GMT offset in milliseconds.
     */
    public static getAvailableIDs(rawOffset: number): JavaString[];
    public static getAvailableIDs(rawOffset?: number): JavaString[] {
        return [];
    }

    /**
     * Gets the default TimeZone of the Java virtual machine.
     *
     * @returns the default TimeZone.
     */
    public static getDefault(): TimeZone {
        return new TimeZone();
    }

    /**
     * Returns a long standard time name of this TimeZone suitable for presentation to the user in the default locale.
     */
    public getDisplayName(): JavaString;
    /**
     * Returns a name in the specified style of this TimeZone suitable for presentation to the user in the default
     * locale.
     */
    public getDisplayName(daylight: boolean, style: number, locale: Locale): JavaString;
    /**
     * Returns a long standard time name of this TimeZone suitable for presentation to the user in the specified
     * locale.
     */
    public getDisplayName(locale: Locale): JavaString;
    public getDisplayName(daylightOrLocale?: boolean | Locale, style?: number,
        locale?: Locale): JavaString {
        throw new NotImplementedError();
    }

}
