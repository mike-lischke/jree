/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../../lang/Object";
import { JavaString } from "../../lang/String";
import { UnsupportedOperationException } from "../../lang/UnsupportedOperationException";
import { ByteBuffer } from "../ByteBuffer";
import { CharBuffer } from "../CharBuffer";
import { Charset } from "./Charset";
import { CoderResult } from "./CoderResult";
import { CodingErrorAction } from "./CodingErrorAction";

export class CharsetDecoder extends JavaObject {
    #cs: Charset;
    #averageCharsPerByte: number;
    #maxCharsPerByte: number;

    #malformedInputAction = CodingErrorAction.REPORT;
    #unmappableCharacterAction = CodingErrorAction.REPORT;

    #replacement = new JavaString("");

    /**
     * Returns the average number of characters that will be produced for each byte of input.
     *
     * @param cs The charset to use.
     * @param averageCharsPerByte The average number of characters per byte.
     * @param maxCharsPerByte The maximum number of characters per byte.
     */
    protected constructor(cs: Charset, averageCharsPerByte: number, maxCharsPerByte: number) {
        super();

        this.#cs = cs;
        this.#averageCharsPerByte = averageCharsPerByte;
        this.#maxCharsPerByte = maxCharsPerByte;
    }

    /**
     * Helper method to create a new decoder for the given charset.
     *
     * @param cs The charset to use.
     *
     * @returns A new decoder for the given charset.
     */
    public static create(cs: Charset): CharsetDecoder {
        return new CharsetDecoder(cs, 1, 1);
    }

    /** @returns the average number of characters that will be produced for each byte of input. */
    public averageCharsPerByte(): number {
        return this.#averageCharsPerByte;
    }

    /** @returns the charset that created this decoder. */
    public charset(): Charset {
        return this.#cs;
    }

    /**
     * Convenience method that decodes the remaining content of a single input byte buffer into a newly-allocated
     * character buffer.
     *
     * @param input The input buffer.
     *
     * @returns A newly-allocated character buffer containing the decoded result.
     */
    public decode(input: ByteBuffer): CharBuffer;
    /**
     * Decodes as many bytes as possible from the given input buffer, writing the results to the given output buffer.
     *
     * @param input The input buffer.
     * @param output The output buffer.
     * @param endOfInput Indicates if this is the last input.
     *
     * @returns A coder result object describing the reason for termination.
     */
    public decode(input: ByteBuffer, output: CharBuffer, endOfInput: boolean): CoderResult;
    public decode(...args: unknown[]): CharBuffer | CoderResult {
        if (args.length === 1) {
            const input = args[0] as ByteBuffer;
            const buffer = Buffer.from(input.array());
            const text = buffer.toString(this.#cs.name().valueOf() as BufferEncoding);

            return CharBuffer.wrap(new JavaString(text));

        } else {
            const [input, output, _] = [args[0] as ByteBuffer, args[1] as CharBuffer, args[2] as boolean];
            const buffer = Buffer.from(input.array());
            const text = buffer.toString(this.#cs.name().valueOf() as BufferEncoding);

            output.put(new JavaString(text));

            return CoderResult.success();
        }
    }

    /** Retrieves the charset that was detected by this decoder */
    public detectCharset(): Charset {
        throw new UnsupportedOperationException();
    }

    /**
     * Flushes this decoder.
     *
     * @param output The output buffer.
     *
     * @returns A coder result object describing the reason for termination.
     */
    public flush(output: CharBuffer): CoderResult {
        return CoderResult.success();
    }

    /**
     * Tells whether or not this decoder implements an auto-detecting charset.
     *
     * @returns true if this decoder implements an auto-detecting charset, false otherwise.
     */
    public isAutoDetecting(): boolean {
        return false;
    }

    /**
     * Tells whether or not this decoder has yet detected a charset
     *
     * @returns true if this decoder has detected a charset, false otherwise.
     */
    public isCharsetDetected(): boolean {
        return false;
    }

    /** @returns this decoder's current action for malformed-input errors. */
    public malformedInputAction(): CodingErrorAction {
        return this.#malformedInputAction;
    }

    /** @returns the maximum number of characters that will be produced for each byte of input. */
    public maxCharsPerByte(): number {
        return this.#maxCharsPerByte;
    }

    /**
     * Changes this decoder's action for malformed-input errors.
     *
     * @param newAction The new action; must not be null.
     *
     * @returns This decoder.
     */
    public onMalformedInput(newAction: CodingErrorAction): CharsetDecoder {
        this.#malformedInputAction = newAction;

        return this;
    }

    /**
     * Changes this decoder's action for unmappable-character errors.
     *
     * @param newAction The new action; must not be null.
     *
     * @returns This decoder.
     */
    public onUnmappableCharacter(newAction: CodingErrorAction): CharsetDecoder {
        this.#unmappableCharacterAction = newAction;

        return this;
    }

    /** @returns the current replacement value. */
    public replacement(): JavaString {
        return this.#replacement;
    }

    /**
     * Changes this decoder's replacement value.
     *
     * @param newReplacement The new replacement; must not be null.
     *
     * @returns This decoder.
     */
    public replaceWith(newReplacement: JavaString): CharsetDecoder {
        this.#replacement = newReplacement;

        return this;
    }

    /**
     * Resets this decoder, clearing any internal state.
     *
     * @returns This decoder.
     */
    public reset(): CharsetDecoder {
        return this;
    }

    /** @returns this decoder's current action for unmappable-character errors. */
    public unmappableCharacterAction(): CodingErrorAction {
        return this.#unmappableCharacterAction;
    }
}
