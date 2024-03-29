/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "./../lang/String.js";
import { JavaObject } from "../lang/Object.js";
import { AttributedCharacterIterator } from "./AttributedCharacterIterator.js";
import { Cloneable } from "../lang/Cloneable.js";
import { NotImplementedError } from "../../NotImplementedError.js";
import { ParsePosition } from "./ParsePosition.js";
import { StringBuffer } from "../lang/StringBuffer.js";
import { FieldPosition } from "./FieldPosition.js";
import { Serializable } from "../io/Serializable.js";

export abstract class Format extends JavaObject implements Serializable, Cloneable<Format> {
    /**
     * Defines the field constants that are used as attribute keys in the
     * AttributedCharacterIterator returned from Format.formatToCharacterIterator and as
     * field identifiers in FieldPosition.
     */
    public static Field = class extends AttributedCharacterIterator.Attribute {

        public constructor(name: JavaString) {
            super(name);
        }
    };

    protected constructor() {
        super();
    }

    /**
     * Formats an Object producing an AttributedCharacterIterator.
     *
     * @param _obj The Object to format.
     */
    public formatToCharacterIterator(_obj: Object): AttributedCharacterIterator {
        throw new NotImplementedError();
    }

    /**
     * Parses text from the beginning of the given string to produce an object.
     *
     * @param source A String, part of which should be parsed.
     * @param pos A ParsePosition object with index and error index information as described above.
     *
     * @returns An Object parsed from the string. In case of error, returns null.
     */
    public parseObject(source: JavaString, pos?: ParsePosition): Object | null {
        if (pos !== undefined) {
            // Simulate the abstract method.
            throw new NotImplementedError("abstract");
        }

        return this.parseObject(source, new ParsePosition(0));
    }

    /**
     * Creates and returns a copy of this object.
     *
     * @returns tbd
     */
    public abstract override clone(): Format;

    /** Formats an object to produce a string. */
    public abstract format(obj: unknown): JavaString;
    /** Formats an object and appends the resulting text to a given string buffer. */
    public abstract format(obj: unknown, toAppendTo: StringBuffer,
        pos: FieldPosition): JavaString;

}

export namespace Format {
    export type Field = InstanceType<typeof Format.Field>;
}
