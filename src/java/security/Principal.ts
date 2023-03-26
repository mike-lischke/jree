/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IReflection } from "../lang/Object";
import { JavaString } from "../lang/String";

/**
 * This interface represents the abstract notion of a principal, which can be used to represent any entity, such as
 * an individual, a corporation, and a login id.
 */
export interface Principal extends IReflection {
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
    getName(): JavaString;

    /**
     * @returns a hash code for this principal.
     */
    hashCode(): number;

    // implies(other: javax.security.auth.Subject): boolean;

    /**
     * @returns a string representation of this principal.
     */
    toString(): JavaString;
}
