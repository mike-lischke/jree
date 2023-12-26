/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../../lang/Object.js";

import { NotImplementedError } from "../../../NotImplementedError.js";
import { JavaString } from "../../lang/String.js";
import { Pattern } from "./Pattern.js";
import { StringBuffer } from "../../lang/StringBuffer.js";
import { IllegalStateException } from "../../lang/IllegalStateException.js";
import { IndexOutOfBoundsException } from "../../lang/IndexOutOfBoundsException.js";
import { MatchResult } from "./MatchResult.js";

export class Matcher extends JavaObject implements MatchResult {

    private regexResults: RegExpExecArray | null;
    private appendPosition = 0;

    public constructor(private owner: Pattern, private regex: RegExp, private input: JavaString) {
        super();

        this.regexResults = regex.exec(input.valueOf());
    }

    /**
     * Returns a literal replacement String for the specified String.
     *
     * @param _s tbd
     */
    public static quoteReplacement = (_s: JavaString): JavaString => {
        throw new NotImplementedError();
    };

    /**
     * Implements a non-terminal append-and-replace step.
     *
     * @param sb tbd
     * @param replacement tbd
     *
     * @returns tbd
     */
    public appendReplacement = (sb: StringBuffer, replacement: JavaString): Matcher => {

        // Note: in Java the replacement value may contain references to groups in the last match.
        //       However, here we ignore those currently.
        sb.append(this.input.substring(this.appendPosition, this.start()));
        sb.append(replacement);
        this.appendPosition = this.end();

        return this;
    };

    /**
     * Implements a terminal append-and-replace step.
     *
     * @param sb tbd
     *
     * @returns tbd
     */
    public appendTail = (sb: StringBuffer): StringBuffer => {
        sb.append(this.input.substring(this.appendPosition));

        return sb;
    };

    public end(): number;
    public end(group: number): number;
    public end(group?: number): number {
        // group === 0 is the same as no group.
        if (!group || this.regexResults === null) {
            return this.regex.lastIndex;
        }

        if (this.regexResults === null) {
            throw new IllegalStateException();
        }

        if (group < 0 || group >= this.regexResults.length) {
            throw new IndexOutOfBoundsException();
        }

        throw new NotImplementedError();
    }

    /**
     * Resets this matcher and then attempts to find the next subsequence of the input sequence that matches
     * the pattern, starting at the specified index.
     *
     * @param _start tbd
     */
    public find = (_start?: number): boolean => {
        throw new NotImplementedError();
    };

    /** Returns the input subsequence captured by the given group during the previous match operation. */
    public group(group?: number): JavaString;
    /**
     * Returns the input subsequence captured by the given named-capturing group during the previous match operation.
     */
    public group(name: JavaString): JavaString;
    public group(_groupOrName?: number | JavaString): JavaString {
        throw new NotImplementedError();
    }

    /**
     *  @returns the number of capturing groups in this matcher's pattern.
     */
    public groupCount = (): number => {
        if (this.regexResults === null) {
            throw new IllegalStateException();
        }

        return this.regexResults.length - 1;
    };

    /** Queries the anchoring of region bounds for this matcher. */
    public hasAnchoringBounds = (): boolean => {
        throw new NotImplementedError();
    };

    /** Queries the transparency of region bounds for this matcher. */
    public hasTransparentBounds = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * @returns true if the end of input was hit by the search engine in the last match operation performed
     * by this matcher.
     */
    public hitEnd = (): boolean => {
        if (this.regexResults === null) {
            throw new IllegalStateException();
        }

        return this.regex.lastIndex >= this.input.length() - 1;
    };

    /** Attempts to match the input sequence, starting at the beginning of the region, against the pattern. */
    public lookingAt = (): boolean => {
        throw new NotImplementedError();
    };

    /** Attempts to match the entire region against the pattern. */
    public matches = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * @returns the pattern that is interpreted by this matcher.
     */
    public pattern = (): Pattern => {
        return this.owner;
    };

    /**
     * Sets the limits of this matcher's region.
     *
     * @param _start tbd
     * @param _end tbd
     */
    public region = (_start: number, _end: number): Matcher => {
        throw new NotImplementedError();
    };

    /** Reports the end index (exclusive) of this matcher's region. */
    public regionEnd = (): number => {
        throw new NotImplementedError();
    };

    /** Reports the start index of this matcher's region. */
    public regionStart = (): number => {
        throw new NotImplementedError();
    };

    /**
     * Replaces every subsequence of the input sequence that matches the pattern with the given replacement string.
     *
     * @param _replacement tbd
     */
    public replaceAll = (_replacement: JavaString): JavaString => {
        throw new NotImplementedError();
    };

    /**
     * Replaces the first subsequence of the input sequence that matches the pattern with the given replacement string.
     *
     * @param _replacement tbd
     */
    public replaceFirst = (_replacement: JavaString): JavaString => {
        throw new NotImplementedError();
    };

    /** Returns true if more input could change a positive match into a negative one. */
    public requireEnd = (): boolean => {
        throw new NotImplementedError();
    };

    /**
     * Resets this matcher with a new input sequence.
     *
     * @param _input tbd
     */
    public reset = (_input?: JavaString): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Returns the start index of the subsequence captured by the given group during the previous match operation.
     *
     * @param _group tbd
     */
    public start = (_group?: number): number => {
        throw new NotImplementedError();
    };

    /** @returns the match state of this matcher as a MatchResult. */
    public toMatchResult = (): MatchResult => {
        return this;
    };

    /**
     * Sets the anchoring of region bounds for this matcher.
     *
     * @param _b tbd
     */
    public useAnchoringBounds = (_b: boolean): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Changes the Pattern that this Matcher uses to find matches with.
     *
     * @param _newPattern tbd
     */
    public usePattern = (_newPattern: Pattern): Matcher => {
        throw new NotImplementedError();
    };

    /**
     * Sets the transparency of region bounds for this matcher.
     *
     * @param _b tbd
     */
    public useTransparentBounds = (_b: boolean): Matcher => {
        throw new NotImplementedError();
    };

}
