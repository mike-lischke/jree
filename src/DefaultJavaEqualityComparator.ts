/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { isEquatable } from "./type-guards";
import { Arrays } from "./java/util/Arrays";
import { JavaEqualityComparator } from "./JavaEqualityComparator";

import { MurmurHash } from "./MurmurHash";

/**
 * A class implementing Java's comparison semantics, which are based on object equality, that is, equality based on
 * hash codes generated for an object. Simple types are compared directly (value/reference comparison), with
 * NaN !== NaN and null !== undefined.
 */
export class DefaultJavaEqualityComparator<T> implements JavaEqualityComparator<T> {
    public static readonly instance = new DefaultJavaEqualityComparator();

    public hashCode = (obj?: unknown): number => {
        // This method uses `hashCode()` of the given object if that actually supports this.
        return MurmurHash.hashCode(obj);
    };

    public equals = (a: T, b: T): boolean => {
        if (a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        if (isEquatable(a)) {
            return a.equals(b);
        }

        if (Array.isArray(a) && Array.isArray(b)) {
            return Arrays.equals(a, b);
        }

        return this.hashCode(a) === this.hashCode(b);
    };

}
