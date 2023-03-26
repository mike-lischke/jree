/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { JavaObject } from "../lang/Object";

/**
 * ParsePosition is a simple class used by Format and its subclasses to keep track of the current position during
 * parsing. The parseObject method in the various Format classes requires a ParsePosition object as an argument.
 */
export class ParsePosition extends JavaObject {
    #index: number;
    #errorIndex = -1;

    public constructor(index: number) {
        super();

        this.#index = index;
    }

    /**
     * Overrides equals
     *
     * @param obj The object to compare with.
     *
     * @returns true if the objects are equal; false otherwise.
     */
    public override equals(obj: JavaObject): boolean {
        if (obj instanceof ParsePosition) {
            return this.#index === obj.#index;
        }

        return false;
    }

    /**
     * Retrieve the index at which an error occurred, or -1 if the error index has not been set.
     *
     * @returns The error index.
     */
    public getErrorIndex(): number {
        return this.#errorIndex;
    }

    /**
     * @returns The current parse position.
     */
    public getIndex(): number {
        return this.#index;
    }

    /**
     * @returns A hash code value for this object.
     */
    public override hashCode(): number {
        return this.#index;
    }

    /**
     * Set the index at which a parse error occurred.
     *
     * @param errorIndex The error index.
     */
    public setErrorIndex(errorIndex: number): void {
        this.#errorIndex = errorIndex;
    }

    /**
     * Set the current parse position.
     *
     * @param index The current parse position.
     */
    public setIndex(index: number): void {
        this.#index = index;
    }

    /**
     * @returns A string representation of this ParsePosition.
     */
    public override toString(): string {
        return `ParsePosition(index=${this.#index}, errorIndex=${this.#errorIndex})`;
    }
}
