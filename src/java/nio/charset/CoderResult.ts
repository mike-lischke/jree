/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../../lang/String.js";
import { JavaObject } from "../../lang/Object.js";
import { BufferOverflowException } from "../BufferOverflowException.js";
import { BufferUnderflowException } from "../BufferUnderflowException.js";
import { MalformedInputException } from "./MalformedInputException.js";
import { UnmappableCharacterException } from "./UnmappableCharacterException.js";

export class CoderResult extends JavaObject {
    /** Result object indicating overflow, meaning that there is insufficient room in the output buffer. */
    public static readonly OVERFLOW = new CoderResult("OVERFLOW");

    /**
     * Result object indicating underflow, meaning that either the input buffer has been completely consumed or, if
     * the input buffer is not yet empty, that additional input is required.
     */
    public static readonly UNDERFLOW = new CoderResult("UNDERFLOW");

    #name: string;
    #length = 0;

    private constructor(name: string) {
        super();

        this.#name = name;
    }

    /**
     * Helper method to construct a successful coder result.
     * This is not part of the Java API.
     *
     * @returns a successful coder result
     */
    public static success(): CoderResult {
        return new CoderResult("SUCCESS");
    }

    /**
     * Static factory method that returns the unique object describing a malformed-input error of the given length.
     *
     * @param length the length of the erroneous input
     *
     * @returns a coder-result object indicating an input error of the given type and the given length
     */
    public static malformedForLength(length: number): CoderResult {
        const result = new CoderResult("MALFORMED");
        result.#length = length;

        return result;
    }

    /**
     * Static factory method that returns the unique result object describing an unmappable-character error of the
     * given length.
     *
     * @param length the length of the erroneous input
     *
     * @returns a coder-result object indicating an input error of the given type and the given length
     */
    public static unmappableForLength(length: number): CoderResult {
        const result = new CoderResult("UNMAPPABLE");
        result.#length = length;

        return result;
    }

    /**
     * Tells whether or not this object describes an error condition.
     *
     * @returns true if, and only if, this object describes an error condition
     */
    public isError(): boolean {
        return this.#name !== "SUCCESS";
    }

    /**
     * Tells whether or not this object describes a malformed-input error.
     *
     * @returns true if, and only if, this object describes a malformed-input error
     */
    public isMalformed(): boolean {
        return this.#name === "MALFORMED";
    }

    /**
     * Tells whether or not this object describes an overflow condition.
     *
     * @returns true if, and only if, this object describes an overflow condition
     */
    public isOverflow(): boolean {
        return this === CoderResult.OVERFLOW;
    }

    /**
     * Tells whether or not this object describes an underflow condition.
     *
     * @returns true if, and only if, this object describes an underflow condition
     */
    public isUnderflow(): boolean {
        return this === CoderResult.UNDERFLOW;
    }

    /**
     * Tells whether or not this object describes an unmappable-character error.
     *
     * @returns true if, and only if, this object describes an unmappable-character error
     */
    public isUnmappable(): boolean {
        return this.#name === "UNMAPPABLE";
    }

    /**
     * Returns the length of the erroneous input described by this object.
     *
     * @returns the length of the erroneous input, a positive integer
     */
    public length(): number {
        return this.#length;
    }

    /**
     * Throws an exception appropriate to the result described by this object.
     *
     * @throws BufferOverflowException if this object describes an overflow condition
     * @throws BufferUnderflowException if this object describes an underflow condition
     * @throws MalformedInputException if this object describes a malformed-input error
     * @throws UnmappableCharacterException if this object describes an unmappable-character error
     */
    public throwException(): void {
        if (this.isUnderflow()) {
            throw new BufferUnderflowException();
        } else if (this.isOverflow()) {
            throw new BufferOverflowException();
        } else if (this.isMalformed()) {
            throw new MalformedInputException(this.length());
        } else if (this.isUnmappable()) {
            throw new UnmappableCharacterException(this.length());
        }
    }

    public override toString(): JavaString {
        return new JavaString(this.#name);
    }
}
