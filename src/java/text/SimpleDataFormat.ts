/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";
import { DateFormat } from "./DateFormat";

export class SimpleDateFormat extends DateFormat {
    public constructor(pattern: string);
    public constructor(pattern: string, locale: java.util.Locale);
    public constructor(pattern: string, locale?: java.util.Locale) {
        super();
    }

    public applyLocalizedPattern(pattern: string): void {
        throw new NotImplementedError();
    }

    public applyPattern(pattern: string): void {
        throw new NotImplementedError();
    }

    public clone(): SimpleDateFormat {
        throw new NotImplementedError();
    }

    public equals(obj: java.lang.Object): boolean {
        throw new NotImplementedError();
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
