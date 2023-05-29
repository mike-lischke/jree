/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NotImplementedError } from "../../NotImplementedError";
import { Serializable } from "../io/Serializable";
import { JavaObject } from "../lang/Object";
import { JavaString } from "../lang/String";
import { JavaMap } from "../util/Map";
import { CharacterIterator } from "./CharacterIterator";

export interface AttributedCharacterIterator extends CharacterIterator {
    /** Returns the keys of all attributes defined on the iterator's text range.*/
    getAllAttributeKeys(): Set<AttributedCharacterIterator.Attribute>;

    /** Returns the value of the named attribute for the character at the iterator's current index.*/
    getAttribute(attribute: AttributedCharacterIterator.Attribute): unknown;

    /** Returns a map with the attributes defined on the current character. */
    getAttributes(): JavaMap<AttributedCharacterIterator.Attribute, JavaObject>;

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
    getRunLimit<T extends AttributedCharacterIterator.Attribute>(attributes: Set<T>): number;

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
    getRunStart<T extends AttributedCharacterIterator.Attribute>(attributes: Set<T>): number;
}

export namespace AttributedCharacterIterator {
    export class Attribute extends JavaObject implements Serializable {
        public static INPUT_METHOD_SEGMENT = new Attribute(new JavaString("input_method_segment"));
        public static LANGUAGE = new Attribute(new JavaString("language"));
        public static READING = new Attribute(new JavaString("reading"));

        #name: JavaString;

        protected constructor(name: JavaString) {
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
        public override equals(obj: unknown): boolean {
            if (this === obj) {
                return true;
            }

            return false;
        }

        /** @returns a hash code value for the object.*/
        public override hashCode(): number {
            return super.hashCode();
        }

        /** @returns a string representation of the object.*/
        public override toString(): string {
            return `${this.constructor.name}(${this.#name})`;
        }

        /** @returns the name of the attribute.*/
        public getName(): JavaString {
            return this.#name;
        }

        /** Resolves instances being deserialized to the predefined constants.*/
        public readResolve(): JavaObject {
            throw new NotImplementedError();
        }

        public override clone(): JavaObject {
            return super.clone();
        }

        public [Symbol.toPrimitive](_hint: string): string {
            return `${this.toString()}`;
        }
    }
}
