/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";
import { DateFormat } from "./DateFormat";

export class SimpleDateFormat extends DateFormat {
    #pattern: java.lang.String;
    #locale?: java.util.Locale;

    public constructor(pattern: java.lang.String);
    public constructor(pattern: java.lang.String, locale: java.util.Locale);
    public constructor(pattern: java.lang.String, locale?: java.util.Locale) {
        super();
        this.#pattern = pattern;
        this.#locale = locale;
    }

    /**
     * Applies the given localized pattern to this date format.
     *
     * @param pattern The localized pattern to apply.
     */
    public applyLocalizedPattern(pattern: java.lang.String | null): void {
        if (pattern === null) {
            throw new java.lang.NullPointerException();
        }
        this.#pattern = pattern;
    }

    /**
     * Applies the given pattern to this date format.
     *
     * @param pattern The pattern to apply.
     */
    public applyPattern(pattern: java.lang.String | null): void {
        if (pattern === null) {
            throw new java.lang.NullPointerException();
        }
        this.#pattern = pattern;
    }

    /** @returns A copy of this object. */
    public clone(): SimpleDateFormat {
        if (!this.#locale) {
            return new SimpleDateFormat(this.#pattern);
        }

        return new SimpleDateFormat(this.#pattern, this.#locale);
    }

    /**
     * Compares the given object with this one for equality.
     *
     * @param obj The object to compare with.
     *
     * @returns true if the objects are equal; false otherwise.
     */
    public equals(obj: java.lang.Object): boolean {
        if (obj instanceof SimpleDateFormat) {
            return this.#pattern === obj.#pattern;
        }

        return false;
    }

    public format(obj: java.util.Date): java.lang.String;
    public format(date: java.util.Date, toAppendTo: java.lang.StringBuffer,
        pos: java.text.FieldPosition): java.lang.StringBuffer;
    public format(date: java.util.Date, toAppendTo?: java.lang.StringBuffer,
        pos?: java.text.FieldPosition): java.lang.StringBuffer | java.lang.String {
        throw new NotImplementedError();
    }

    public get2DigitYearStart(): java.util.Date {
        throw new NotImplementedError();
    }

    public getDateFormatSymbols(): java.text.DateFormatSymbols {
        throw new NotImplementedError();
    }

    public hashCode(): number {
        throw new NotImplementedError();
    }

    public parse(source: string, pos: java.text.ParsePosition): java.util.Date {
        throw new NotImplementedError();
    }

    public set2DigitYearStart(start: java.util.Date): void {
        throw new NotImplementedError();
    }

    public setDateFormatSymbols(newFormatSymbols: java.text.DateFormatSymbols): void {
        throw new NotImplementedError();
    }

    public toLocalizedPattern(): string {
        throw new NotImplementedError();
    }

    public toPattern(): string {
        throw new NotImplementedError();
    }
}
