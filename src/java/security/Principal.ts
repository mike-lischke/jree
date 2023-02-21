/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/**
 * This interface represents the abstract notion of a principal, which can be used to represent any entity, such as
 * an individual, a corporation, and a login id.
 */
export interface Principal {
    /**
     * Compares this principal to the specified object.
     *
     * @param other the object to compare with.
     *
     * @returns true if the object passed in represents the same principal as this principal, and false otherwise.
     */
    equals(other: unknown): boolean;

    /**
     * @returns a string representation of this principal.
     */
    getName(): string;

    /**
     * @returns a hash code for this principal.
     */
    hashCode(): number;

    // implies(other: javax.security.auth.Subject): boolean;

    /**
     * @returns a string representation of this principal.
     */
    toString(): string;
}
