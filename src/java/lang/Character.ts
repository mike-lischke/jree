/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import unicode from "unicode-properties";

import { final } from "../../Decorators";

import { java } from "../..";
import { JavaObject } from "./Object";

/**
 * The Character class wraps a value of the primitive type char in an object. An object of type Character contains a
 * single field whose type is char.
 * In addition, this class provides several methods for determining a character's category (lowercase letter, digit,
 * etc.) and for converting characters from uppercase to lowercase and vice versa.
 *
 * Character information is based on the Unicode Standard, version 12.0.0.
 */
@final
export class Character extends JavaObject {
    /** General category "Cn" in the Unicode specification. */
    public static readonly UNASSIGNED = 0;

    /** General category "Lu" in the Unicode specification. */
    public static readonly UPPERCASE_LETTER = 1;

    /** General category "Ll" in the Unicode specification. */
    public static readonly LOWERCASE_LETTER = 2;

    /** General category "Lt" in the Unicode specification. */
    public static readonly TITLECASE_LETTER = 3;

    /** General category "Lm" in the Unicode specification. */
    public static readonly MODIFIER_LETTER = 4;

    /** General category "Lo" in the Unicode specification. */
    public static readonly OTHER_LETTER = 5;

    /** General category "Mn" in the Unicode specification. */
    public static readonly NON_SPACING_MARK = 6;

    /** General category "Me" in the Unicode specification. */
    public static readonly ENCLOSING_MARK = 7;

    /** General category "Mc" in the Unicode specification. */
    public static readonly COMBINING_SPACING_MARK = 8;

    /** General category "Nd" in the Unicode specification. */
    public static readonly DECIMAL_DIGIT_NUMBER = 9;

    /** General category "Nl" in the Unicode specification. */
    public static readonly LETTER_NUMBER = 10;

    /** General category "No" in the Unicode specification. */
    public static readonly OTHER_NUMBER = 11;

    /** General category "Zs" in the Unicode specification. */
    public static readonly SPACE_SEPARATOR = 12;

    /** General category "Zl" in the Unicode specification. */
    public static readonly LINE_SEPARATOR = 13;

    /** General category "Zp" in the Unicode specification. */
    public static readonly PARAGRAPH_SEPARATOR = 14;

    /** General category "Cc" in the Unicode specification. */
    public static readonly CONTROL = 15;

    /** General category "Cf" in the Unicode specification. */
    public static readonly FORMAT = 16;

    /** General category "Co" in the Unicode specification. */
    public static readonly PRIVATE_USE = 18;

    /** General category "Cs" in the Unicode specification. */
    public static readonly SURROGATE = 19;

    /** General category "Pd" in the Unicode specification. */
    public static readonly DASH_PUNCTUATION = 20;

    /** General category "Ps" in the Unicode specification. */
    public static readonly START_PUNCTUATION = 21;

    /** General category "Pe" in the Unicode specification. */
    public static readonly END_PUNCTUATION = 22;

    /** General category "Pc" in the Unicode specification. */
    public static readonly CONNECTOR_PUNCTUATION = 23;

    /** General category "Po" in the Unicode specification. */
    public static readonly OTHER_PUNCTUATION = 24;

    /** General category "Sm" in the Unicode specification. */
    public static readonly MATH_SYMBOL = 25;

    /** General category "Sc" in the Unicode specification. */
    public static readonly CURRENCY_SYMBOL = 26;

    /** General category "Sk" in the Unicode specification. */
    public static readonly MODIFIER_SYMBOL = 27;

    /** General category "So" in the Unicode specification. */
    public static readonly OTHER_SYMBOL = 28;

    /** General category "Pi" in the Unicode specification. */
    public static readonly INITIAL_QUOTE_PUNCTUATION = 29;

    /** General category "Pf" in the Unicode specification. */
    public static readonly FINAL_QUOTE_PUNCTUATION = 30;

    /** Error flag. Use int (code point) to avoid confusion with U+FFFF. */
    public static readonly ERROR = 0xFFFFFFFF;

    /**
     * Undefined bidirectional character type. Undefined {@code char} * values have undefined directionality in
     * the Unicode specification.
     */
    public static readonly DIRECTIONALITY_UNDEFINED = -1;

    /** Strong bidirectional character type "L" in the Unicode specification. */
    public static readonly DIRECTIONALITY_LEFT_TO_RIGHT = 0;

    /** Strong bidirectional character type "R" in the Unicode specification. */
    public static readonly DIRECTIONALITY_RIGHT_TO_LEFT = 1;

    /** Strong bidirectional character type "AL" in the Unicode specification. */
    public static readonly DIRECTIONALITY_RIGHT_TO_LEFT_ARABIC = 2;

    /** Weak bidirectional character type "EN" in the Unicode specification. */
    public static readonly DIRECTIONALITY_EUROPEAN_NUMBER = 3;

    /** Weak bidirectional character type "ES" in the Unicode specification. */
    public static readonly DIRECTIONALITY_EUROPEAN_NUMBER_SEPARATOR = 4;

    /** Weak bidirectional character type "ET" in the Unicode specification. */
    public static readonly DIRECTIONALITY_EUROPEAN_NUMBER_TERMINATOR = 5;

    /** Weak bidirectional character type "AN" in the Unicode specification. */
    public static readonly DIRECTIONALITY_ARABIC_NUMBER = 6;

    /** Weak bidirectional character type "CS" in the Unicode specification. */
    public static readonly DIRECTIONALITY_COMMON_NUMBER_SEPARATOR = 7;

    /** Weak bidirectional character type "NSM" in the Unicode specification. */
    public static readonly DIRECTIONALITY_NONSPACING_MARK = 8;

    /** Weak bidirectional character type "BN" in the Unicode specification. */
    public static readonly DIRECTIONALITY_BOUNDARY_NEUTRAL = 9;

    /** Neutral bidirectional character type "B" in the Unicode specification. */
    public static readonly DIRECTIONALITY_PARAGRAPH_SEPARATOR = 10;

    /** Neutral bidirectional character type "S" in the Unicode specification. */
    public static readonly DIRECTIONALITY_SEGMENT_SEPARATOR = 11;

    /** Neutral bidirectional character type "WS" in the Unicode specification. */
    public static readonly DIRECTIONALITY_WHITESPACE = 12;

    /** Neutral bidirectional character type "ON" in the Unicode specification. */
    public static readonly DIRECTIONALITY_OTHER_NEUTRALS = 13;

    /** Strong bidirectional character type "LRE" in the Unicode specification. */
    public static readonly DIRECTIONALITY_LEFT_TO_RIGHT_EMBEDDING = 14;

    /** Strong bidirectional character type "LRO" in the Unicode specification. */
    public static readonly DIRECTIONALITY_LEFT_TO_RIGHT_OVERRIDE = 15;

    /** Strong bidirectional character type "RLE" in the Unicode specification. */
    public static readonly DIRECTIONALITY_RIGHT_TO_LEFT_EMBEDDING = 16;

    /** Strong bidirectional character type "RLO" in the Unicode specification. */
    public static readonly DIRECTIONALITY_RIGHT_TO_LEFT_OVERRIDE = 17;

    /** Weak bidirectional character type "PDF" in the Unicode specification. */
    public static readonly DIRECTIONALITY_POP_DIRECTIONAL_FORMAT = 18;

    /** Weak bidirectional character type "LRI" in the Unicode specification. */
    public static readonly DIRECTIONALITY_LEFT_TO_RIGHT_ISOLATE = 19;

    /** Weak bidirectional character type "RLI" in the Unicode specification. */
    public static readonly DIRECTIONALITY_RIGHT_TO_LEFT_ISOLATE = 20;

    /** Weak bidirectional character type "FSI" in the Unicode specification. */
    public static readonly DIRECTIONALITY_FIRST_STRONG_ISOLATE = 21;

    /** Weak bidirectional character type "PDI" in the Unicode specification. */
    public static readonly DIRECTIONALITY_POP_DIRECTIONAL_ISOLATE = 22;

    /**
     * The minimum value of a <a href="http://www.unicode.org/glossary/#high_surrogate_code_unit">
     * Unicode high-surrogate code unit</a> in the UTF-16 encoding.
     * A high-surrogate is also known as a <i>leading-surrogate</i>.
     */
    public static readonly MIN_HIGH_SURROGATE = 0xD800;

    /**
     * The maximum value of a <a href="http://www.unicode.org/glossary/#high_surrogate_code_unit">
     * Unicode high-surrogate code unit</a> in the UTF-16 encoding.
     * A high-surrogate is also known as a <i>leading-surrogate</i>.
     */
    public static readonly MAX_HIGH_SURROGATE = 0xDBFF;

    /**
     * The minimum value of a * <a href="http://www.unicode.org/glossary/#low_surrogate_code_unit">
     * Unicode low-surrogate code unit</a> in the UTF-16 encoding.
     * A low-surrogate is also known as a <i>trailing-surrogate</i>.
     */
    public static readonly MIN_LOW_SURROGATE = 0xDC00;

    /**
     * The maximum value of a * <a href="http://www.unicode.org/glossary/#low_surrogate_code_unit">
     * Unicode low-surrogate code unit</a> in the UTF-16 encoding.
     * A low-surrogate is also known as a <i>trailing-surrogate</i>.
     */
    public static readonly MAX_LOW_SURROGATE = 0xDFFF;

    /** The minimum value of a Unicode surrogate code unit in the * UTF-16 encoding. */
    public static readonly MIN_SURROGATE = 0xD800;

    /** The maximum value of a Unicode surrogate code unit in the * UTF-16 encoding. */
    public static readonly MAX_SURROGATE = 0xDFFF;

    /**
     * The minimum value of a * <a href="http://www.unicode.org/glossary/#supplementary_code_point">
     * Unicode supplementary code point</a>.
     */
    public static readonly MIN_SUPPLEMENTARY_CODE_POINT = 0x10000;

    /**
     * The minimum value of a * <a href="http://www.unicode.org/glossary/#code_point">
     * Unicode code point</a>.
     */
    public static readonly MIN_CODE_POINT = 0x000000;

    /**
     * The maximum value of a * <a href="http://www.unicode.org/glossary/#code_point">
     * Unicode code point</a>.
     */
    public static readonly MAX_CODE_POINT = 0X10FFFF;

    public static readonly Subset = class {
        protected constructor(public name: string) { }

        public equals(obj: unknown): boolean {
            return obj === this;
        }
    };

    public static readonly UnicodeBlock = class {
        public static readonly BASIC_LATIN = 1;

        public static of = (_c: java.lang.char): number => {
            return 0;
        };

    };

    public static readonly UnicodeScript = class {
        public static readonly BASIC_LATIN = 1;

        public static of = (_c: java.lang.char): number => {
            return 0;
        };
    };

    private static readonly CategoryMapper = new Map<string, number>();

    public constructor() {
        super();
    }

    /**
     * Returns a value indicating a character's general category.
     *
     * @param c The character to check.
     *
     * @returns The character's general category.
     *
     * Note: In typescript we cannot differentiate between char and number (java.lang.char is a type alias for number).
     *       That means there's only one method for the two Java getType methods.
     */
    public static getType(c: java.lang.char | number): number {
        const category = unicode.getCategory(c);

        return Character.CategoryMapper.get(category) ?? Character.UNASSIGNED;
    }

    public static isDigit(c: java.lang.char): boolean {
        return unicode.isDigit(c);
    }

    /**
     * Determines if the given char value is a Unicode high-surrogate code unit (also known as leading-surrogate
     * code unit).
     *
     * @param ch The character to check.
     *
     * @returns True, if the character is a high surrogate, otherwise false.
     */
    public static isHighSurrogate(ch: java.lang.char): boolean {
        return Character.MIN_HIGH_SURROGATE <= ch && ch <= Character.MAX_HIGH_SURROGATE;
    }

    /**
     * Determines if the specified character (Unicode code point) is an lowercase character.
     *
     * @param c The character to check.
     *
     * @returns True, if the character is an lowercase character, otherwise false.
     */
    public static isLowerCase(c: java.lang.char): boolean {
        return unicode.isLowerCase(c);
    }

    /**
     * Determines if the given char value is a Unicode low-surrogate code unit (also known as trailing-surrogate
     * code unit).
     *
     * @param c The character to check.
     *
     * @returns True, if the character is a low surrogate, otherwise false.
     */
    public static isLowSurrogate(c: java.lang.char): boolean {
        return Character.MIN_LOW_SURROGATE <= c && c <= Character.MAX_LOW_SURROGATE;
    }

    /**
     * Determines if the specified character (Unicode code point) may be part of a Unicode identifier as other than
     * the first character.
     *
     * @param c The character to check.
     *
     * @returns True, if the character may be part of a Unicode identifier, otherwise false.
     */
    public static isUnicodeIdentifierPart(c: java.lang.char): boolean {
        return this.isUnicodeIdentifierStart(c);
    }

    /**
     * Determines if the specified character is permissible as the first character in a Unicode identifier.
     * A character may start a Unicode identifier if and only if one of the following is true:
     *
     * @param c The character to check.
     *
     * @returns True, if the character is permissible as the first character in a Unicode identifier, otherwise false.
     */
    public static isUnicodeIdentifierStart(c: java.lang.char): boolean {
        const type = this.getType(c);

        // In UnicodeSet notation:
        // [\p{L}\p{Nl}\p{Other_ID_Start}-\p{Pattern_Syntax}-\p{Pattern_White_Space}]
        return type === Character.UPPERCASE_LETTER || type === Character.LOWERCASE_LETTER ||
            type === Character.TITLECASE_LETTER || type === Character.MODIFIER_LETTER ||
            type === Character.OTHER_LETTER || // p{L}

            type === Character.LETTER_NUMBER; // p{Nl}

        // TODO: add support for the other sets.
    }

    /**
     * Determines if the specified character (Unicode code point) is an uppercase character.
     *
     * @param c The character to check.
     *
     * @returns True, if the character is an uppercase character, otherwise false.
     */
    public static isUpperCase(c: java.lang.char): boolean {
        return unicode.isUpperCase(c);
    }

    /**
     * Converts the specified surrogate pair to its supplementary code point value.
     *
     * @param high The leading surrogate.
     * @param low The trailing surrogate.
     *
     * @returns The computed Unicode codepoint.
     */
    public static toCodePoint(high: java.lang.char, low: java.lang.char): number {
        return (high << 10) + low + Character.MIN_SUPPLEMENTARY_CODE_POINT - (Character.MIN_HIGH_SURROGATE << 10) -
            Character.MIN_LOW_SURROGATE;
    }

    public static toString(c: java.lang.char): string {
        return String.fromCodePoint(c);
    }

    public static toUpperCase(s: string): string {
        return s.toUpperCase();
    }

    public static toLowerCase(s: string): string {
        return s.toLowerCase();
    }

    static {
        setTimeout(() => {
            // @ts-ignore
            this.CategoryMapper = new Map<string, number>([
                ["Cc", Character.CONTROL],
                ["Cf", Character.FORMAT],
                ["Cn", Character.UNASSIGNED],
                ["Co", Character.PRIVATE_USE],
                ["Cs", Character.SURROGATE],
                ["Ll", Character.LOWERCASE_LETTER],
                ["Lm", Character.MODIFIER_LETTER],
                ["Lo", Character.OTHER_LETTER],
                ["Lt", Character.TITLECASE_LETTER],
                ["Lu", Character.UPPERCASE_LETTER],
                ["Mc", Character.COMBINING_SPACING_MARK],
                ["Me", Character.ENCLOSING_MARK],
                ["Mn", Character.NON_SPACING_MARK],
                ["Nd", Character.DECIMAL_DIGIT_NUMBER],
                ["Nl", Character.LETTER_NUMBER],
                ["No", Character.OTHER_NUMBER],
                ["Pc", Character.CONNECTOR_PUNCTUATION],
                ["Pd", Character.DASH_PUNCTUATION],
                ["Pe", Character.END_PUNCTUATION],
                ["Pf", Character.FINAL_QUOTE_PUNCTUATION],
                ["Pi", Character.INITIAL_QUOTE_PUNCTUATION],
                ["Po", Character.OTHER_PUNCTUATION],
                ["Ps", Character.START_PUNCTUATION],
                ["Sc", Character.CURRENCY_SYMBOL],
                ["Sk", Character.MODIFIER_SYMBOL],
                ["Sm", Character.MATH_SYMBOL],
                ["So", Character.OTHER_SYMBOL],
                ["Zl", Character.LINE_SEPARATOR],
                ["Zp", Character.PARAGRAPH_SEPARATOR],
                ["Zs", Character.SPACE_SEPARATOR],
            ]);
        }, 0);
    }
}
