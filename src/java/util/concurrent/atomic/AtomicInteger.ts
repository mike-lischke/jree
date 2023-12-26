/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { double, float, int, long } from "../../../../types.js";

import { JavaNumber } from "../../../lang/Number.js";
import { JavaObject } from "../../../lang/Object.js";
import { JavaString } from "../../../lang/String.js";
import { IntBinaryOperator } from "../../function/IntBinaryOperator.js";
import { IntUnaryOperator } from "../../function/IntUnaryOperator.js";

/**
 * An int value that may be updated atomically. See the VarHandle specification for descriptions of the properties of
 * atomic accesses. An AtomicInteger is used in applications such as atomically incremented counters, and cannot be
 * used as a replacement for an Integer. However, this class does extend Number to allow uniform access by tools and
 * utilities that deal with numerically-based classes.
 */
export class AtomicInteger extends JavaNumber {
    #value: int;

    /**
     * Creates a new AtomicInteger with the given initial value.
     *
     * @param initialValue the initial value
     */
    public constructor(initialValue?: int) {
        super();
        this.#value = initialValue ?? 0;
    }

    /**
     * Atomically updates (with memory effects as specified by VarHandle.compareAndSet(java.lang.Object...)) the
     * current value with the results of applying the given function to the current and given values, returning the
     * updated value.
     *
     * @param operand the value to be combined with the current value
     * @param accumulatorFunction a side-effect-free function of two arguments
     *
     * @returns the updated value
     */
    public accumulateAndGet(operand: int, accumulatorFunction: IntBinaryOperator): int {
        this.#value = accumulatorFunction(this.#value, operand);

        return this.#value;
    }

    /**
     * Atomically adds the given value to the current value, with memory effects as specified by
     * VarHandle.getAndAdd(java.lang.Object...).
     *
     * @param delta the value to add
     *
     * @returns the updated value
     */
    public addAndGet(delta: int): int {
        this.#value += delta;

        return this.#value;
    }

    /**
     * Atomically decrements by one the current value, with memory effects as specified by
     * VarHandle.getAndDecrement(java.lang.Object...).
     *
     * @param expected the expected value
     * @param newValue the new value
     *
     * @returns the witness value, which will be the same as the expected value if successful
     */
    public compareAndExchange(expected: int, newValue: int): int {
        if (this.#value === expected) {
            this.#value = newValue;

            return expected;
        }

        return this.#value;
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
    public compareAndExchangeAcquire(expected: int, newValue: int): int {
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
    public compareAndExchangeRelease(expected: int, newValue: int): int {
        return this.compareAndExchange(expected, newValue);
    }

    /**
     * Atomically sets the value to the given updated value if the current value == the expected value, with memory
     * effects as specified by VarHandle.compareAndSet(java.lang.Object...).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful. False return indicates that the actual value was not equal to the expected value.
     */
    public compareAndSet(expect: int, update: int): boolean {
        return this.compareAndExchange(expect, update) === expect;
    }

    /**
     * Atomically decrements by one the current value, with memory effects as specified by
     * VarHandle.getAndDecrement(java.lang.Object...).
     *
     * @returns the updated value
     */
    public decrementAndGet(): int {
        return --this.#value;
    }

    public override doubleValue(): double {
        return this.#value;
    }

    public override floatValue(): float {
        return this.#value;
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getVolatile(java.lang.Object...).
     */
    public get(): int {
        return this.#value;
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getOpaque(java.lang.Object...).
     */
    public getAcquire(): int {
        return this.#value;
    }

    /**
     * Atomically updates (with memory effects as specified by VarHandle.compareAndSet(java.lang.Object...)) the
     * current value with the results of applying the given function to the current and given values, returning the
     * previous value.
     *
     * @param operand the value to be combined with the current value
     * @param accumulatorFunction a side-effect-free function of two arguments
     *
     * @returns the previous value
     */
    public getAndAccumulate(operand: int, accumulatorFunction: IntBinaryOperator): int {
        const oldValue = this.#value;
        this.#value = accumulatorFunction(oldValue, operand);

        return oldValue;
    }

    /**
     * Atomically adds the given value to the current value, with memory effects as specified by
     * VarHandle.getAndAdd(java.lang.Object...).
     *
     * @param delta the value to add
     *
     * @returns the previous value
     */
    public getAndAdd(delta: int): int {
        const oldValue = this.#value;
        this.#value += delta;

        return oldValue;
    }

    /**
     * Atomically decrements by one the current value, with memory effects as specified by
     * VarHandle.getAndDecrement(java.lang.Object...).
     *
     * @returns the previous value
     */
    public getAndDecrement(): int {
        return this.#value--;
    }

    /**
     * Atomically increments by one the current value, with memory effects as specified by
     * VarHandle.getAndIncrement(java.lang.Object...).
     *
     * @returns the previous value
     */
    public getAndIncrement(): int {
        return this.#value++;
    }

    /**
     * Atomically sets the value to newValue and returns the old value, with memory effects as specified by
     * VarHandle.getAndSet(java.lang.Object...).
     *
     * @param newValue the new value
     *
     * @returns the previous value
     */
    public getAndSet(newValue: int): int {
        const oldValue = this.#value;
        this.#value = newValue;

        return oldValue;
    }

    /**
     * Atomically updates (with memory effects as specified by VarHandle.compareAndSet(java.lang.Object...)) the
     * current value with the results of applying the given function, returning the previous value.
     *
     * @param updaterFunction a side-effect-free function
     *
     * @returns the previous value
     */
    public getAndUpdate(updaterFunction: IntUnaryOperator): int {
        const oldValue = this.#value;
        this.#value = updaterFunction(oldValue);

        return oldValue;
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getOpaque(java.lang.Object...).
     */
    public getOpaque(): int {
        return this.#value;
    }

    /**
     * @returns the current value, with memory effects as specified by VarHandle.getOpaque(java.lang.Object...).
     */
    public getPlain(): int {
        return this.#value;
    }

    /**
     * Atomically increments the current value, with memory effects as specified by
     * VarHandle.getAndAdd(java.lang.Object...).
     *
     * @returns the updated value
     */
    public incrementAndGet(): int {
        return ++this.#value;
    }

    /**
     * @returns the current value of this AtomicInteger as an int, with memory effects as specified by
     * VarHandle.getVolatile(java.lang.Object...).
     */
    public intValue(): int {
        return this.#value;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setRelease(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public lazySet(newValue: int): void {
        this.#value = newValue;
    }

    /**
     * @returns the current value of this AtomicInteger as a long after a widening primitive conversion, with memory
     * effects as specified by VarHandle.getVolatile(java.lang.Object...).
     */
    public longValue(): long {
        return BigInt(this.#value);
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setVolatile(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public set(newValue: int): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setOpaque(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public setOpaque(newValue: int): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory semantics of setting as if the variable was declared non-volatile
     * and non-final.
     *
     * @param newValue the new value
     */
    public setPlain(newValue: int): void {
        this.#value = newValue;
    }

    /**
     * Sets the value to newValue, with memory effects as specified by VarHandle.setRelease(java.lang.Object...).
     *
     * @param newValue the new value
     */
    public setRelease(newValue: int): void {
        this.#value = newValue;
    }

    public override toString(): JavaString {
        return JavaString.valueOf(this.#value);
    }

    /**
     * Atomically updates the current value with the results of applying the given function, returning the updated
     * value, with memory effects as specified by VarHandle.updateAndGet(java.lang.Object...).
     *
     * @param updaterFunction a side-effect-free function
     *
     * @returns the updated value
     */
    public updateAndGet(updaterFunction: IntUnaryOperator): int {
        this.#value = updaterFunction(this.#value);

        return this.#value;
    }

    /**
     * @deprecated
     * This method has plain memory effects but the method name implies volatile memory effects (see methods such as
     * compareAndExchange(int, int) and compareAndSet(int, int)).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful
     */
    public weakCompareAndSet(expect: int, update: int): boolean {
        return this.compareAndSet(expect, update);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetAcquire(java.lang.Object...).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful
     */
    public weakCompareAndSetAcquire(expect: int, update: int): boolean {
        return this.compareAndSet(expect, update);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetPlain(java.lang.Object...).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful
     */
    public weakCompareAndSetPlain(expect: int, update: int): boolean {
        return this.compareAndSet(expect, update);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetRelease(java.lang.Object...).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful
     */
    public weakCompareAndSetRelease(expect: int, update: int): boolean {
        return this.compareAndSet(expect, update);
    }

    /**
     * Possibly atomically sets the value to newValue if the current value == expectedValue, with memory effects as
     * specified by VarHandle.weakCompareAndSetVolatile(java.lang.Object...).
     *
     * @param expect the expected value
     * @param update the new value
     *
     * @returns true if successful
     */
    public weakCompareAndSetVolatile(expect: int, update: int): boolean {
        return this.compareAndSet(expect, update);
    }

    public override byteValue(): number {
        return this.#value & 0xFF;
    }

    public override shortValue(): number {
        return this.#value & 0xFFFF;
    }

    public override clone(): JavaObject {
        return new AtomicInteger(this.#value);
    }

    public override equals(obj: unknown): boolean {
        if (obj instanceof AtomicInteger) {
            return this.#value === obj.#value;
        }

        if (obj instanceof JavaNumber) {
            return this.#value === obj.intValue();
        }

        if (typeof obj === "number") {
            return this.#value === obj;
        }

        return false;
    }

    public [Symbol.toPrimitive](): number {
        return this.#value;
    }
}
