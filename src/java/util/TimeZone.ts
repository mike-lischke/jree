/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";
import { JavaObject } from "../lang/Object";

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
    public static getAvailableIDs(): java.lang.String[];
    /**
     * Gets the available IDs according to the given time zone offset in milliseconds.
     *
     * @param rawOffset the given time zone GMT offset in milliseconds.
     */
    public static getAvailableIDs(rawOffset: number): java.lang.String[];
    public static getAvailableIDs(rawOffset?: number): java.lang.String[] {
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
    public getDisplayName(): java.lang.String;
    /**
     * Returns a name in the specified style of this TimeZone suitable for presentation to the user in the default
     * locale.
     */
    public getDisplayName(daylight: boolean, style: number, locale: java.util.Locale): java.lang.String;
    /**
     * Returns a long standard time name of this TimeZone suitable for presentation to the user in the specified
     * locale.
     */
    public getDisplayName(locale: java.util.Locale): java.lang.String;
    public getDisplayName(daylightOrLocale?: boolean | java.util.Locale, style?: number,
        locale?: java.util.Locale): java.lang.String {
        throw new NotImplementedError();
    }

}
