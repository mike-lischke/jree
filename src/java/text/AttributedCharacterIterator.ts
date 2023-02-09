/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError, S } from "../..";
import { JavaObject } from "../lang/Object";

export interface AttributedCharacterIterator extends java.text.CharacterIterator {
    /** Returns the keys of all attributes defined on the iterator's text range.*/
    getAllAttributeKeys(): java.util.Set<AttributedCharacterIterator.Attribute>;

    /** Returns the value of the named attribute for the character at the iterator's current index.*/
    getAttribute(attribute: AttributedCharacterIterator.Attribute): unknown;

    /** Returns a map with the attributes defined on the current character. */
    getAttributes(): java.util.Map<AttributedCharacterIterator.Attribute, unknown>;

    /**
     * Returns the index of the first character following the run with respect to all attributes containing the
     * current character.
     */
    getRunLimit(): number;

    /**
     * Returns the index of the first character following the run with respect to the given attribute containing the
     * current character.
     */
    getRunLimit(attribute: AttributedCharacterIterator.Attribute): number;

    /**
     * Returns the index of the first character following the run with respect to the given attributes containing the
     * current character.
     */
    getRunLimit<T extends AttributedCharacterIterator.Attribute>(attributes: java.util.Set<T>): number;

    /**
     * Returns the index of the first character of the run with respect to all attributes containing the current
     * character.
     */
    getRunStart(): number;

    /**
     * Returns the index of the first character of the run with respect to the given attribute containing the current
     * character.
     */
    getRunStart(attribute: AttributedCharacterIterator.Attribute): number;

    /**
     * Returns the index of the first character of the run with respect to the given attributes containing the
     * current character.
     */
    getRunStart<T extends AttributedCharacterIterator.Attribute>(attributes: java.util.Set<T>): number;
}

export namespace AttributedCharacterIterator {
    export class Attribute extends JavaObject implements java.io.Serializable {
        public static INPUT_METHOD_SEGMENT = new Attribute(S`input_method_segment`);
        public static LANGUAGE = new Attribute(S`language`);
        public static READING = new Attribute(S`reading`);

        #name: java.lang.String;

        protected constructor(name: java.lang.String) {
            super();
            this.#name = name;
        }

        /**
         * Compares two objects for equality.
         *
         * @param obj tbd
         *
         * @returns tbd
         */
        public equals(obj: unknown): boolean {
            if (this === obj) {
                return true;
            }

            return false;
        }

        /** @returns a hash code value for the object.*/
        public hashCode(): number {
            return super.hashCode();
        }

        /** @returns a string representation of the object.*/
        public toString(): java.lang.String {
            return S`${this.constructor.name}(${this.#name})`;
        }

        /** @returns the name of the attribute.*/
        public getName(): java.lang.String {
            return this.#name;
        }

        /** Resolves instances being deserialized to the predefined constants.*/
        public readResolve(): java.lang.Object {
            throw new NotImplementedError();
        }

        public clone(): JavaObject {
            return super.clone();
        }

        public [Symbol.toPrimitive](_hint: string): string {
            return `${this.toString()}`;
        }
    }
}
