/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";
import { JavaObject } from "../lang/Object";

export class Calendar extends JavaObject {
    public static readonly ERA = 0;
    public static readonly YEAR = 1;
    public static readonly MONTH = 2;
    public static readonly WEEK_OF_YEAR = 3;
    public static readonly WEEK_OF_MONTH = 4;
    public static readonly DATE = 5;
    public static readonly DAY_OF_MONTH = 5;
    public static readonly DAY_OF_YEAR = 6;
    public static readonly DAY_OF_WEEK = 7;
    public static readonly DAY_OF_WEEK_IN_MONTH = 8;
    public static readonly AM_PM = 9;
    public static readonly HOUR = 10;
    public static readonly HOUR_OF_DAY = 11;
    public static readonly MINUTE = 12;
    public static readonly SECOND = 13;
    public static readonly MILLISECOND = 14;
    public static readonly ZONE_OFFSET = 15;
    public static readonly DST_OFFSET = 16;
    public static readonly FIELD_COUNT = 17;
    public static readonly SUNDAY = 1;
    public static readonly MONDAY = 2;
    public static readonly TUESDAY = 3;
    public static readonly WEDNESDAY = 4;
    public static readonly THURSDAY = 5;
    public static readonly FRIDAY = 6;
    public static readonly SATURDAY = 7;
    public static readonly JANUARY = 0;
    public static readonly FEBRUARY = 1;
    public static readonly MARCH = 2;
    public static readonly APRIL = 3;
    public static readonly MAY = 4;
    public static readonly JUNE = 5;
    public static readonly JULY = 6;
    public static readonly AUGUST = 7;
    public static readonly SEPTEMBER = 8;
    public static readonly OCTOBER = 9;
    public static readonly NOVEMBER = 10;
    public static readonly DECEMBER = 11;
    public static readonly UNDECIMBER = 12;
    public static readonly AM = 0;
    public static readonly PM = 1;
    public static readonly ALL_STYLES = 0;
    public static readonly SHORT = 1;
    public static readonly LONG = 2;
    public static readonly NARROW_FORMAT = 4;
    public static readonly NARROW_STANDALONE = 32772;
    public static readonly SHORT_FORMAT = 1;
    public static readonly SHORT_STANDALONE = 32769;
    public static readonly LONG_FORMAT = 2;
    public static readonly LONG_STANDALONE = 32770;

    public static Builder = class Builder extends JavaObject {
        public constructor() {
            super();
        }

        /** Returns a Calendar built from the parameters set by the setter methods.*/
        public build(): Calendar {
            throw new NotImplementedError();
        }

        /**
         * Sets the field parameter to the given value.
         *
         * @param field the field to set
         * @param value the value to set the field to
         */
        public set(field: number, value: number): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the calendar type parameter to the given type.
         *
         * @param type the calendar type to set
         */
        public setCalendarType(type: string): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the date field parameters to the values given by year, month, and dayOfMonth.
         *
         * @param year the year to set
         * @param month the month to set
         * @param dayOfMonth the day of month to set
         */
        public setDate(year: number, month: number, dayOfMonth: number): this {
            throw new NotImplementedError();
        }

        /**
         * Sets field parameters to their values given by fieldValuePairs that are pairs of a field and its value.
         *
         * @param fieldValuePairs the field-value pairs to set
         */
        public setFields(...fieldValuePairs: number[]): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the instant parameter to the given instant value that is a millisecond offset from the Epoch.
         *
         * @param instant the instant to set
         */
        public setInstant(instant: number): this;
        /**
         * Sets the instant parameter to the instant value given by a Date.
         *
         * @param date the Date to set
         */
        public setInstant(date: Date): this;
        public setInstant(instantOrDate: number | Date): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the lenient mode parameter to the value given by lenient.
         *
         * @param lenient the lenient mode to set
         */
        public setLenient(lenient: boolean): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the locale parameter to the given locale.
         *
         * @param locale the locale to set
         */
        public setLocale(locale: string): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the time of day field parameters to the values given by hourOfDay, minute, and second.
         *
         * @param hourOfDay the hour of day to set
         * @param minute the minute to set
         * @param second the second to set
         */
        public setTimeOfDay(hourOfDay: number, minute: number, second: number): this;
        /**
         * Sets the time of day field parameters to the values given by hourOfDay, minute, second, and millis.
         *
         * @param hourOfDay the hour of day to set
         * @param minute the minute to set
         * @param second the second to set
         * @param millis the millisecond to set
         */
        public setTimeOfDay(hourOfDay: number, minute: number, second: number, millis: number): this;
        public setTimeOfDay(hourOfDay: number, minute: number, second: number, millis?: number): this {
            throw new NotImplementedError();
        }

        /**
         * Sets the time zone parameter to the given zone.
         *
         * @param zone the time zone to set
         */
        public setTimeZone(zone: java.util.TimeZone): this {
            throw new NotImplementedError();
        }

        public clone(): JavaObject {
            return super.clone();
        }

        public [Symbol.toPrimitive](_hint: string): string {
            return `${this.toString()}`;
        }
    };
}

export namespace Calendar {
    export type Builder = InstanceType<typeof Calendar.Builder>;
}
