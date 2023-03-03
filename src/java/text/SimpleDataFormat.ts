/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { NullPointerException } from "../lang/NullPointerException";
import { JavaString } from "../lang/String";
import { StringBuffer } from "../lang/StringBuffer";
import { JavaDate } from "../util/Date";
import { Locale } from "../util/Locale";
import { DateFormat } from "./DateFormat";
import { DateFormatSymbols } from "./DateFormatSymbols";
import { FieldPosition } from "./FieldPosition";
import { ParsePosition } from "./ParsePosition";

export class SimpleDateFormat extends DateFormat {
    #pattern: JavaString;
    #locale?: Locale;

    public constructor(pattern: JavaString);
    public constructor(pattern: JavaString, locale: Locale);
    public constructor(pattern: JavaString, locale?: Locale) {
        super();
        this.#pattern = pattern;
        this.#locale = locale;
    }

    /**
     * Applies the given localized pattern to this date format.
     *
     * @param pattern The localized pattern to apply.
     */
    public applyLocalizedPattern(pattern: JavaString | null): void {
        if (pattern === null) {
            throw new NullPointerException();
        }
        this.#pattern = pattern;
    }

    /**
     * Applies the given pattern to this date format.
     *
     * @param pattern The pattern to apply.
     */
    public applyPattern(pattern: JavaString | null): void {
        if (pattern === null) {
            throw new NullPointerException();
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
    public override equals(obj: unknown): boolean {
        if (obj instanceof SimpleDateFormat) {
            return this.#pattern === obj.#pattern;
        }

        return false;
    }

    public format(obj: JavaDate): JavaString;
    public format(date: JavaDate, toAppendTo: StringBuffer,
        pos: FieldPosition): StringBuffer;
    public format(date: JavaDate, toAppendTo?: StringBuffer,
        pos?: FieldPosition): StringBuffer | JavaString {
        throw new NotImplementedError();
    }

    public get2DigitYearStart(): JavaDate {
        throw new NotImplementedError();
    }

    public getDateFormatSymbols(): DateFormatSymbols {
        throw new NotImplementedError();
    }

    public override hashCode(): number {
        throw new NotImplementedError();
    }

    public parse(source: JavaString, pos: ParsePosition): JavaDate {
        throw new NotImplementedError();
    }

    public set2DigitYearStart(start: JavaDate): void {
        throw new NotImplementedError();
    }

    public setDateFormatSymbols(newFormatSymbols: DateFormatSymbols): void {
        throw new NotImplementedError();
    }

    public toLocalizedPattern(): JavaString {
        throw new NotImplementedError();
    }

    public toPattern(): JavaString {
        throw new NotImplementedError();
    }
}
