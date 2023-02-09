/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, NotImplementedError } from "../..";
import { JavaObject } from "../lang/Object";

export abstract class Format extends JavaObject implements java.io.Serializable, java.lang.Cloneable<Format> {
    /**
     * Defines the field constants that are used as attribute keys in the
     * AttributedCharacterIterator returned from Format.formatToCharacterIterator and as
     * field identifiers in FieldPosition.
     */
    public static Field = class Field extends java.text.AttributedCharacterIterator.Attribute {
        public constructor(name: java.lang.String, dummy = 0) {
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
    public formatToCharacterIterator(_obj: java.lang.Object): java.text.AttributedCharacterIterator {
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
    public parseObject(source: java.lang.String, pos?: java.text.ParsePosition): java.lang.Object | null {
        if (pos !== undefined) {
            // Simulate the abstract method.
            throw new NotImplementedError("abstract");
        }

        return this.parseObject(source, new java.text.ParsePosition(0));
    }

    /**
     * Creates and returns a copy of this object.
     *
     * @returns tbd
     */
    public abstract clone(): Format;

    /** Formats an object to produce a string. */
    public abstract format(obj: unknown): java.lang.String;
    /** Formats an object and appends the resulting text to a given string buffer. */
    public abstract format(obj: unknown, toAppendTo: java.lang.StringBuffer,
        pos: java.text.FieldPosition): java.lang.String;

}

export namespace Format {
    export type Field = InstanceType<typeof Format.Field>;
}
