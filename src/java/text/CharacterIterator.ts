/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Cloneable } from "../lang/Cloneable.js";
import { JavaString } from "../lang/String.js";

/**
 * This interface defines a protocol for bidirectional iteration over text. The iterator iterates over a bounded
 * sequence of characters. Characters are indexed with values beginning with the value returned by getBeginIndex()
 * and continuing through the value returned by getEndIndex()-1.
 */
export interface CharacterIterator extends Cloneable<CharacterIterator> {
    /** Gets the character at the current position (as returned by getIndex()). */
    current(): JavaString;

    /** Sets the position to getBeginIndex() and returns the character at that position. */
    first(): JavaString;

    /** Returns the start index of the text. */
    getBeginIndex(): number;

    /** Returns the end index of the text. */
    getEndIndex(): number;

    /** Returns the current index. */
    getIndex(): number;

    /**
     * Sets the position to getEndIndex()-1 (getEndIndex() if the text is empty) and returns the character at that
     * position.
     */
    last(): JavaString;

    /** Increments the iterator's index by one and returns the character at the new index. */
    next(): JavaString;

    /** Decrements the iterator's index by one and returns the character at the new index. */
    previous(): JavaString;

    /**
     * Sets the position to the specified position in the text and returns that character.
     *
     * @param position the position within the text. Valid values range from getBeginIndex() to getEndIndex().
     * An IllegalArgumentException is thrown if an invalid value is supplied.
     *
     * @returns the character at the specified position or DONE if the specified position is equal to getEndIndex().
     */
    setIndex(position: number): JavaString;
}

export namespace CharacterIterator {
    /**
     * Constant that is returned when the previous or next method has reached either end of the text.
     * The value is '\uFFFF', the "not a character" value which should not normally appear in any valid Unicode
     * string.
     */
    export const DONE = 0xFFFF;
}
