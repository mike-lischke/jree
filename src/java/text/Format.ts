/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "./../lang/String";
import { JavaObject } from "../lang/Object";
import { AttributedCharacterIterator } from "./AttributedCharacterIterator";
import { Cloneable } from "../lang/Cloneable";
import { NotImplementedError } from "../../NotImplementedError";
import { ParsePosition } from "./ParsePosition";
import { StringBuffer } from "../lang/StringBuffer";
import { FieldPosition } from "./FieldPosition";
import { Serializable } from "../io/Serializable";

export abstract class Format extends JavaObject implements Serializable, Cloneable<Format> {
    /**
     * Defines the field constants that are used as attribute keys in the
     * AttributedCharacterIterator returned from Format.formatToCharacterIterator and as
     * field identifiers in FieldPosition.
     */
    public static Field = class Field extends AttributedCharacterIterator.Attribute {
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
