/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object.js";
import { JavaString } from "../../lang/String.js";
import { Matcher } from "./Matcher.js";

export class Pattern extends JavaObject {
    /** Enables canonical equivalence. */
    public static readonly CANON_EQ = 1 >> 0;

    /** Enables case-insensitive matching. */
    public static readonly CASE_INSENSITIVE = 1 >> 1;

    /** Permits whitespace and comments in pattern. */
    public static readonly COMMENTS = 1 >> 2;

    /** Enables dot-all mode. */
    public static readonly DOTALL = 1 >> 3;

    /** Enables literal parsing of the pattern. */
    public static readonly LITERAL = 1 >> 4;

    /** Enables multiline mode. */
    public static readonly MULTILINE = 1 >> 5;

    /** Enables Unicode-aware case folding. */
    public static readonly UNICODE_CASE = 1 >> 6;

    /** Enables the Unicode version of predefined character classes and POSIX character classes. */
    public static readonly UNICODE_CHARACTER_CLASS = 1 >> 7;

    /** Enables Unix lines mode. */
    public static readonly UNIX_LINES = 1 >> 8;

    #regex: RegExp;

    private constructor(private source: JavaString, private sourceFlags: number) {
        super();

        let flags = "dy"; // Sticky indexes are used, not a global search, to better match Java's regex behavior.
        if (sourceFlags & Pattern.DOTALL) {
            flags += "s";
        }

        if (sourceFlags & Pattern.CASE_INSENSITIVE) {
            flags += "i";
        }

        if (sourceFlags & Pattern.MULTILINE) {
            flags += "m";
        }

        if (sourceFlags & Pattern.UNICODE_CASE) {
            flags += "u";
        }

        this.#regex = new RegExp(source.valueOf(), flags);
    }

    /**
     * Returns a literal pattern string for the specified string.
     *
     * @param s The string to be literalized
     *
     * @returns A literal pattern string for the specified string
     */
    public static quote = (s: JavaString): JavaString => {
        const escaped = s.valueOf().replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");

        return new JavaString(`^${escaped}$`);
    };

    /**
     *  Compiles the given regular expression and attempts to match the given input against it.
     *
     * @param regex The expression to compile.
     * @param input The input to match against.
     *
     * @returns true if, and only if, the entire region sequence matches this matcher's pattern
     */
    public static matches = (regex: JavaString, input: JavaString): boolean => {
        return new RegExp(regex.valueOf()).test(input.valueOf());
    };

    /**
     * Compiles the given regular expression into a pattern.
     *
     * @param regex The expression to compile.
     * @param flags Match flags, a bit mask that may include CASE_INSENSITIVE, MULTILINE, DOTALL, UNICODE_CASE,
     *              CANON_EQ, UNIX_LINES, LITERAL, and COMMENTS.
     *
     * @returns The given regular expression compiled into a pattern.
     */
    public static compile = (regex: JavaString, flags?: number): Pattern => {
        return new Pattern(regex, flags ?? 0);
    };

    /** @returns this pattern's match flags. */
    public flags = (): number => {
        return this.sourceFlags;
    };

    /**
     * Creates a matcher that will match the given input against this pattern.
     *
     * @param input The character sequence to be matched
     *
     * @returns A new matcher for this pattern
     */
    public matcher = (input: JavaString): Matcher => {
        return new Matcher(this, this.#regex, input);
    };

    /** @returns the regular expression from which this pattern was compiled. */
    public pattern(): JavaString {
        return this.source;
    }

    /**
     * Splits the given input sequence around matches of this pattern.
     *
     * @param input The character sequence to be split
     * @param limit The result threshold, as described above (default 0)
     *
     * @returns The array of strings computed by splitting the input around matches of this pattern
     */
    public split = (input: JavaString, limit?: number): JavaString[] => {
        return input.split(new JavaString(this.#regex.toString()), limit);
    };

    /** @returns the string representation of this pattern. */
    public override toString(): JavaString {
        return this.source;
    }

}
