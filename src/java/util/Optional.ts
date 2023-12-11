/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { MurmurHash } from "../../MurmurHash.js";
import { NotImplementedError } from "../../NotImplementedError.js";
import { int } from "../../types.js";

import { JavaObject } from "../lang/Object.js";
import { Runnable } from "../lang/Runnable.js";
import { Supplier } from "./function/Supplier.js";
import { Consumer } from "./function/Consumer.js";
import { JavaFunction } from "./function/Function.js";
import { Predicate } from "./function/Predicate.js";
import { NoSuchElementException } from "./NoSuchElementException.js";
import { JavaString } from "../lang/String.js";
import { Throwable } from "../lang/Throwable.js";
import { Stream } from "./stream/Stream.js";

/**
 * A container object which may or may not contain a non-null value. If a value is present, {@code isPresent()} will
 * return {@code true} and {@code get()} will return the value.
 */
export class Optional<T> extends JavaObject {
    #value?: T;

    private constructor(value?: T) {
        super();
        this.#value = value;
    }

    /** @returns an empty Optional instance. */
    public static empty<T>(): Optional<T> {
        return new Optional<T>();
    }

    /**
     * @param value the value to be present, which must be non-null.
     *
     * @returns an Optional with the specified present non-null value.
     */
    public static of<T>(value: T): Optional<T> {
        return new Optional<T>(value);
    }

    /**
     * @param value the possibly-null value to describe.
     *
     * @returns an Optional describing the specified value, if non-null, otherwise returns an empty Optional.
     */
    public static ofNullable<T>(value?: T | null): Optional<T> {
        if (value === undefined || value === null) {
            return Optional.empty();
        }

        return new Optional<T>(value);
    }

    /**
     * Indicates whether some other object is "equal to" this Optional.
     *
     * @param obj an object to be tested for equality.
     *
     * @returns true if the other object is "equal to" this object.
     */
    public override equals(obj: unknown): boolean {
        if (this === obj) {
            return true;
        }

        if (!(obj instanceof Optional)) {
            return false;
        }

        const other = obj as Optional<T>;
        if (this.#value === undefined) {
            return other.#value === undefined;
        }

        return this.#value === other.#value;
    }

    /**
     * If a value is present, and the value matches the given predicate, returns an Optional describing the value,
     * otherwise returns an empty Optional.
     *
     * @param predicate a predicate to apply to the value, if present.
     *
     * @returns an Optional describing the value of this Optional if a value is present and the value matches the given
     *          predicate, otherwise an empty Optional.
     */
    public filter(predicate: Predicate<T>): Optional<T> {
        if (this.#value === undefined) {
            return this;
        }

        if (predicate(this.#value)) {
            return this;
        }

        return Optional.empty();
    }

    /**
     * If a value is present, returns the result of applying the given Optional-bearing mapping function to the value,
     * otherwise returns an empty Optional.
     *
     * @param mapper a mapping function to apply to the value, if present.
     *
     * @returns the result of applying an Optional-bearing mapping function to the value of this Optional, if a value is
     *          present, otherwise an empty Optional.
     */
    public flatMap<U>(mapper: JavaFunction<T, Optional<U>>): Optional<U> {
        if (this.#value === undefined) {
            return Optional.empty();
        }

        return mapper(this.#value);
    }

    /**
     * If a value is present in this {@code Optional}, returns the value, otherwise throws
     * {@code NoSuchElementException}.
     *
     * @returns the non-null value held by this {@code Optional}
     */
    public get(): T {
        if (this.#value === undefined) {
            throw new NoSuchElementException();
        }

        return this.#value;
    }

    /**
     * Returns the hash code value of the present value, if any, or 0 (zero) if no value is present.
     *
     * @returns the hash code value of the present value or 0 if no value is present.
     */
    public override hashCode(): int {
        if (this.#value === undefined) {
            return 0;
        }

        return MurmurHash.hashCode(this.#value);
    }

    /**
     * If a value is present, performs the given action with the value, otherwise does nothing.
     *
     * @param consumer block to be executed if a value is present.
     */
    public ifPresent(consumer: Consumer<T>): void {
        if (this.#value !== undefined) {
            consumer(this.#value);
        }
    }

    /**
     * If a value is present, performs the given action with the value, otherwise performs the given empty-based action.
     *
     * @param consumer block to be executed if a value is present.
     * @param emptyAction block to be executed if no value is present.
     */
    public ifPresentOrElse(consumer: Consumer<T>, emptyAction: Runnable): void {
        if (this.#value !== undefined) {
            consumer(this.#value);
        } else {
            emptyAction.run();
        }
    }

    /**
     * If a value is not present, returns true, otherwise false.
     *
     * @returns true if there is no value present, otherwise false.
     */
    public isEmpty(): boolean {
        return this.#value === undefined;
    }

    /**
     * If a value is present, returns true, otherwise false.
     *
     * @returns true if there is a value present, otherwise false.
     */
    public isPresent(): boolean {
        return this.#value !== undefined;
    }

    /**
     * If a value is present, returns an Optional describing (as if by ofNullable(T)) the result of applying the given
     * mapping function to the value, otherwise returns an empty Optional.
     *
     * @param mapper a mapping function to apply to the value, if present.
     *
     * @returns an Optional describing the result of applying a mapping function to the value of this Optional, if a
     *          value is present, otherwise an empty Optional.
     */
    public map<U>(mapper: JavaFunction<T, U>): Optional<U> {
        if (this.#value === undefined) {
            return Optional.empty();
        }

        return Optional.of(mapper(this.#value));
    }

    /**
     * If a value is present, returns an Optional describing the value, otherwise returns an Optional produced by the
     * supplying function.
     *
     * @param supplier the supplying function that produces an Optional to be returned.
     *
     * @returns an Optional describing the value of this Optional, if a value is present, otherwise an Optional produced
     *          by the supplying function.
     */
    public or(supplier: Supplier<Optional<T>>): Optional<T> {
        if (this.#value !== undefined) {
            return this;
        }

        return supplier.get();
    }

    /**
     * If a value is present, returns the value, otherwise returns other.
     *
     * @param other the value to be returned if there is no value present, may be null.
     *
     * @returns the value, if present, otherwise other.
     */
    public orElse(other: T): T {
        if (this.#value !== undefined) {
            return this.#value;
        }

        return other;
    }

    /**
     * If a value is present, returns the value, otherwise returns the result produced by the supplying function.
     *
     * @param supplier the supplying function that produces a value to be returned.
     *
     * @returns the value, if present, otherwise the result produced by the supplying function.
     */
    public orElseGet(supplier: Supplier<T>): T {
        if (this.#value !== undefined) {
            return this.#value;
        }

        return supplier.get();
    }

    /** If a value is present, returns the value, otherwise throws NoSuchElementException. */
    public orElseThrow(): T;
    /**
     * If a value is present, returns the value, otherwise throws an exception produced by the exception supplying
     * function.
     */
    public orElseThrow<E extends Throwable>(exceptionSupplier: Supplier<E>): T;
    public orElseThrow<E extends Throwable>(exceptionSupplier?: Supplier<E>): T {
        if (this.#value !== undefined) {
            return this.#value;
        }

        if (exceptionSupplier) {
            throw exceptionSupplier.get();
        }

        throw new NoSuchElementException();
    }

    /**
     * If a value is present, returns a sequential Stream containing only that value, otherwise returns an empty Stream.
     */
    public stream(): Stream<T> {
        throw new NotImplementedError();
    }

    /** @returns a non-empty string representation of this Optional suitable for debugging. */
    public override toString(): JavaString {
        if (this.#value === undefined) {
            return new JavaString("Optional.empty");
        }

        return new JavaString(`Optional[${this.#value}]`);
    }
}
