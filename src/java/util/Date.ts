/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { S } from "../../templates";
import { Serializable } from "../io/Serializable";
import { Cloneable } from "../lang/Cloneable";
import { Comparable } from "../lang/Comparable";
import { Long } from "../lang/Long";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { Instant } from "../time/Instant";

export class JavaDate extends JavaObject implements Serializable, Cloneable<JavaDate>, Comparable<JavaDate> {

    #value: bigint;
    #d: InstanceType<typeof window.Date>;

    /**
     * As of JDK version 1.1, replaced by Calendar.set(year + 1900, month, date, hrs, min) or
     * GregorianCalendar(year + 1900, month, date, hrs, min).
     *
     * @deprecated
     */
    public constructor(year: number, month: number, date: number, hrs: number, min: number, sec?: number);
    /**
     * Allocates a Date object and initializes it to represent the specified number of milliseconds since the standard
     * base time known as "the epoch", namely January 1, 1970, 00: 00: 00 GMT.
     * OR
     * Allocates a Date object and initializes it so that it represents the time at which it was allocated, measured
     * to the nearest millisecond.
     */
    public constructor(date?: bigint);
    /**
     * As of JDK version 1.1, replaced by DateFormat.parse(String s).
     *
     * @deprecated
     */
    public constructor(s: String);
    public constructor(yearOrDateOrS?: number | bigint | String, month?: number, date?: number, hrs?: number,
        min?: number, sec?: number) {
        super();

        if (yearOrDateOrS === undefined) {
            this.#value = BigInt(window.Date.now());
        } else if (typeof yearOrDateOrS === "bigint") {
            this.#value = yearOrDateOrS;
        } else if (yearOrDateOrS instanceof String) {
            // Note: TS only supports the ISO 8601 date format, while Java supports many more.
            const d = window.Date.parse(yearOrDateOrS.valueOf());
            this.#value = BigInt(d);
        } else {
            const d = window.Date.UTC(yearOrDateOrS, month ?? 0, date, hrs, min, sec);
            this.#value = BigInt(d);
        }

        this.#d = new window.Date();
        this.#d.setTime(Number(this.#value));
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(year + 1900, month, date, hrs, min, sec) or
     * GregorianCalendar(year + 1900, month, date, hrs, min, sec), using a UTC TimeZone, followed by
     * Calendar.getTime().getTime().;
     *
     * @param year tbd
     * @param month tbd
     * @param date tbd
     * @param hrs tbd
     * @param min tbd
     * @param sec tbd
     *
     * @deprecated
     *
     * @returns tbd
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static UTC(year: number, month: number, date: number, hrs: number, min: number, sec: number): bigint {
        const d = window.Date.UTC(year, month, date, hrs, min, sec);

        return BigInt(d);
    }

    /**
     * Obtains an instance of Date from an Instant object.
     *
     * @param _instant tbd
     */
    public static from(_instant: Instant): JavaDate {
        throw new NotImplementedError();
    }

    /**
     * As of JDK version 1.1, replaced by DateFormat.parse(String s).;
     *
     * @param s tbd
     *
     * @returns tbd
     *
     * @deprecated
     */
    public static parse(s: String): bigint {
        return new JavaDate(s).#value;
    }

    /**
     * Tests if this date is after the specified date.
     *
     * @param when tbd
     *
     * @returns tbd
     */
    public after(when: JavaDate): boolean {
        return this.#value < when.#value;
    }

    /**
     * Tests if this date is before the specified date.
     *
     * @param when tbd
     *
     * @returns tbd
     */
    public before(when: JavaDate): boolean {
        return this.#value > when.#value;
    }

    /** @returns a copy of this object. */
    public clone(): JavaDate {
        return new JavaDate(this.#value);
    }

    /**
     * Compares two Dates for ordering.
     *
     * @param anotherDate tbd
     *
     * @returns tbd
     */
    public compareTo(anotherDate: JavaDate): number {
        return Number(this.#value - anotherDate.#value);
    }

    /**
     * Compares two dates for equality.
     *
     * @param obj tbd
     *
     * @returns tbd
     */
    public equals(obj: unknown): boolean {
        if (obj === this) {
            return true;
        }

        if (!(obj instanceof JavaDate)) {
            return false;
        }

        return this.#value === obj.#value;
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.DAY_OF_MONTH).
     *
     * @deprecated
     *
     * @returns tbd
     */
    public getDate(): number {
        return this.#d.getDate();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.DAY_OF_WEEK).
     *
     * @deprecated
     *
     * @returns tbd
     */
    public getDay(): number {
        return this.#d.getDay();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.HOUR_OF_DAY).
     *
     * @deprecated
     *
     * @returns tbd
     */
    public getHours(): number {
        return this.#d.getHours();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.MINUTE).
     *
     * @returns tbd
     *
     * @deprecated
     */
    public getMinutes(): number {
        return this.#d.getMinutes();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.MONTH).
     *
     * @returns tbd
     *
     * @deprecated
     */
    public getMonth(): number {
        return this.#d.getMonth();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.SECOND).
     *
     * @returns tbd
     *
     * @deprecated
     */
    public getSeconds(): number {
        return this.#d.getSeconds();
    }

    /**
     * @returns the number of milliseconds since January 1, 1970, 00: 00: 00 GMT represented by this Date object.
     */
    public getTime(): bigint {
        return BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by
     *     (Calendar.get(Calendar.ZONE_OFFSET) + Calendar.get(Calendar.DST_OFFSET)) / (60 * 1000).
     *
     * @returns tbd
     *
     * @deprecated
     */
    public getTimezoneOffset(): number {
        return this.#d.getTimezoneOffset();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.get(Calendar.YEAR) - 1900.
     *
     * @returns tbd
     *
     * @deprecated
     */
    public getYear(): number {
        return this.#d.getFullYear();
    }

    /** @returns a hash code value for this object. */
    public hashCode(): number {
        return new Long(this.#value).hashCode();
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.DAY_OF_MONTH, int date).;
     *
     * @param date tbd
     *
     * @deprecated
     */
    public setDate(date: number): void {
        this.#d.setDate(date);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.HOUR_OF_DAY, int hours).;
     *
     * @param hours tbd
     *
     * @deprecated
     */
    public setHours(hours: number): void {
        this.#d.setHours(hours);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.MINUTE, int minutes).;
     *
     * @param minutes tbd
     *
     * @deprecated
     */
    public setMinutes(minutes: number): void {
        this.#d.setMinutes(minutes);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.MONTH, int month).;
     *
     * @param month tbd
     *
     * @deprecated
     */
    public setMonth(month: number): void {
        this.#d.setMonth(month);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.SECOND, int seconds).;
     *
     * @param seconds tbd
     *
     * @deprecated
     */
    public setSeconds(seconds: number): void {
        this.#d.setSeconds(seconds);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * Sets this Date object to represent a point in time that is time milliseconds after
     * January 1, 1970 00: 00: 00 GMT.;
     *
     * @param time tbd
     */
    public setTime(time: bigint): void {
        this.#d.setTime(Number(time));
        this.#value = time;
    }

    /**
     * As of JDK version 1.1, replaced by Calendar.set(Calendar.YEAR, year + 1900).
     *
     * @param year tbd
     *
     * @deprecated
     */
    public setYear(year: number): void {
        this.#d.setFullYear(year);
        this.#value = BigInt(this.#d.getTime());
    }

    /**
     * As of JDK version 1.1, replaced by DateFormat.format(Date date), using a GMT TimeZone.
     *
     * @returns tbd
     *
     * @deprecated tbd
     */
    public toGMTString(): JavaString {
        return S`${this.#d.toISOString()}`;
    }

    /** Converts this Date object to an Instant. */
    public toInstant(): Instant {
        throw new NotImplementedError();
    }

    /**
     * As of JDK version 1.1, replaced by DateFormat.format(Date date).
     *
     * @returns tbd
     *
     * @deprecated
     */
    public toLocaleString(): string {
        return `${this.#d.toLocaleDateString()}`;
    }

    /**
     * Converts this Date object to a String of the form:
     *
     * @returns tbd
     */
    public toString(): string {
        return `${this.#d.toString()}`;
    }

}
