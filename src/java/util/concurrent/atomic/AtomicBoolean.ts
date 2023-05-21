/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../../lang/Object";
import { JavaString } from "../../../lang/String";

/**
 * A boolean value that may be updated atomically. See the VarHandle specification for descriptions of the properties
 * of atomic accesses. An AtomicBoolean is used in applications such as atomically updated flags, and cannot be used
 * as a replacement for a Boolean.
 */
export class AtomicBoolean extends JavaObject {
    #value: boolean;

    /**
     * Creates a new AtomicBoolean with the given initial value.
     *
     * @param initialValue the initial value
     */
    public constructor(initialValue?: boolean) {
        super();
        this.#value = initialValue ?? false;
    }

    /**
     * Atomically sets the value to newValue if the current value, referred to as the witness value, == expectedValue,
     * with memory effects as specified by VarHandle.compareAndExchange(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns the witness value, which will be the same as the expected value if successful
     */
    public compareAndExchange(expected: boolean, newValue: boolean): boolean {
        if (this.#value === expected) {
            this.#value = newValue;

            return true;
        }

        return false;
    }

    /**
     * Atomically sets the value to newValue if the current value, referred to as the witness value, == expectedValue,
     * with memory effects as specified by VarHandle.compareAndExchangeAcquire(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns the witness value, which will be the same as the expected value if successful
     */
    public compareAndExchangeAcquire(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Atomically sets the value to newValue if the current value, referred to as the witness value, == expectedValue,
     * with memory effects as specified by VarHandle.compareAndExchangeRelease(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns the witness value, which will be the same as the expected value if successful
     */
    public compareAndExchangeRelease(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Atomically sets the value to newValue if the current value, referred to as the witness value, == expectedValue,
     * with memory effects as specified by VarHandle.compareAndSet(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public compareAndSet(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getVolatile(java.lang.Object...).
     */
    public get(): boolean {
        return this.#value;
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getAcquire(java.lang.Object...).
     */
    public getAcquire(): boolean {
        return this.#value;
    }

    /**
     * Atomically sets the value to newValue and returns the old value, with memory effects as specified by
     * VarHandle.getAndSet(java.lang.Object...).
     *
     * @param newValue the new value
     *
     * @returns the previous value
     */
    public getAndSet(newValue: boolean): boolean {
        const oldValue = this.#value;
        this.#value = newValue;

        return oldValue;
    }

    /** @returns the current value, with memory effects as specified by VarHandle.getOpaque(java.lang.Object...). */
    public getOpaque(): boolean {
        return this.#value;
    }

    /** @returns the current value, with memory semantics of reading as if the variable was declared non-volatile. */
    public getPlain(): boolean {
        return this.#value;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setRelease(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public lazySet(newValue: boolean): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setVolatile(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public set(newValue: boolean): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setOpaque(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public setOpaque(newValue: boolean): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory semantics of setting as if the variable was declared non-volatile and
     * non-final.
     *
     * @param newValue the new value
     */
    public setPlain(newValue: boolean): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setRelease(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public setRelease(newValue: boolean): void {
        this.#value = newValue;
    }

    /** @returns the String representation of the current value. */
    public override toString(): JavaString {
        return new JavaString(this.#value ? "true" : "false");
    }

    /**
     * @deprecated
     *
     * This method has plain memory effects but the method name implies volatile memory effects (see methods such as
     * compareAndExchange(boolean, boolean) and compareAndSet(boolean, boolean)).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public weakCompareAndSet(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetAcquire(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public weakCompareAndSetAcquire(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetPlain(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public weakCompareAndSetPlain(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetRelease(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public weakCompareAndSetRelease(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSet(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public weakCompareAndSetVolatile(expected: boolean, newValue: boolean): boolean {
        return this.compareAndExchange(expected, newValue);
    }

    public [Symbol.toPrimitive](): boolean {
        return this.#value;
    }
}
