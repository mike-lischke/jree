/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { NotImplementedError } from "../../../NotImplementedError";
import { char } from "../../lang";
import { CharSequence } from "../../lang/CharSequence";
import { JavaObject } from "../../lang/Object";
import { ByteBuffer } from "../ByteBuffer";
import { CharBuffer } from "../CharBuffer";
import { Charset } from "./Charset";
import { CoderResult } from "./CoderResult";
import { CodingErrorAction } from "./CodingErrorAction";

export class CharsetEncoder extends JavaObject {
    #cs: Charset;
    #averageBytesPerChar: number;
    #maxBytesPerChar: number;

    #malformedInputAction = CodingErrorAction.REPORT;
    #unmappableCharacterAction = CodingErrorAction.REPORT;

    #replacement: Uint8Array = new Uint8Array(0);

    /** Initializes a new encoder. */
    protected constructor(cs: Charset, averageBytesPerChar: number, maxBytesPerChar: number);
    /** Initializes a new encoder. */
    protected constructor(cs: Charset, averageBytesPerChar: number, maxBytesPerChar: number, replacement: Uint8Array);
    protected constructor(...args: unknown[]) {
        super();

        const [cs, averageBytesPerChar, maxBytesPerChar] = args as [Charset, number, number];
        this.#cs = cs;
        this.#averageBytesPerChar = averageBytesPerChar;
        this.#maxBytesPerChar = maxBytesPerChar;

        if (args.length > 3) {
            this.#replacement = args[3] as Uint8Array;
        }
    }

    /**
     * Helper method to create a new encoder for the given charset.
     *
     * @param cs The charset to use.
     *
     * @returns A new encoder for the given charset.
     */
    public static create(cs: Charset): CharsetEncoder {
        return new CharsetEncoder(cs, 1, 1);
    }

    /** @returns the average number of bytes that will be produced for each character of input. */
    public averageBytesPerChar(): number {
        return this.#averageBytesPerChar;
    }

    /** Tells whether or not this encoder can encode the given character. */
    public canEncode(c: char): boolean;
    /** Tells whether or not this encoder can encode the given character sequence. */
    public canEncode(c: CharSequence): boolean;
    public canEncode(c: char | CharSequence): boolean {
        throw new NotImplementedError();
    }

    /** @returns the charset that created this encoder. */
    public charset(): Charset {
        return this.#cs;
    }

    /**
     * Convenience method that encodes the remaining content of a single input character buffer into a
     * newly-allocated byte buffer.
     */
    public encode(input: CharBuffer): ByteBuffer;
    /**
     * Encodes as many characters as possible from the given input buffer, writing the results to the given output
     * buffer.
     */
    public encode(input: CharBuffer, out: ByteBuffer, endOfInput: boolean): CoderResult;
    public encode(...args: unknown[]): ByteBuffer | CoderResult {
        if (args.length === 1) {
            const input = args[0] as CharBuffer;
            const buffer = Buffer.from(input, this.#cs.name().valueOf() as BufferEncoding);

            return ByteBuffer.wrap(buffer);

        } else {
            const [input, output, _] = [args[0] as CharBuffer, args[1] as ByteBuffer, args[2] as boolean];
            const buffer = Buffer.from(input, this.#cs.name().valueOf() as BufferEncoding);
            output.put(buffer);

            return CoderResult.success();
        }
    }

    /**
     * Flushes this encoder.
     *
     * @param out The output buffer.
     */
    public flush(out: ByteBuffer): CoderResult {
        throw new NotImplementedError();
    }

    /**
     * Tells whether or not the given byte array is a legal replacement value for this encoder.
     *
     * @param replacement The replacement value to test.
     */
    public isLegalReplacement(replacement: Uint8Array): boolean {
        throw new NotImplementedError();
    }

    /** @returns this encoder's current action for malformed-input errors. */
    public malformedInputAction(): CodingErrorAction {
        return this.#malformedInputAction;
    }

    /** @returns the maximum number of bytes that will be produced for each character of input. */
    public maxBytesPerChar(): number {
        return this.#maxBytesPerChar;
    }

    /**
     * Changes this encoder's action for malformed-input errors.
     *
     * @param newAction The new action; must not be null.
     *
     * @returns This encoder.
     */
    public onMalformedInput(newAction: CodingErrorAction): CharsetEncoder {
        this.#malformedInputAction = newAction;

        return this;
    }

    /**
     * Changes this encoder's action for unmappable-character errors.
     *
     * @param newAction The new action; must not be null.
     *
     * @returns This encoder.
     */
    public onUnmappableCharacter(newAction: CodingErrorAction): CharsetEncoder {
        this.#unmappableCharacterAction = newAction;

        return this;
    }

    /** @returns this encoder's current replacement value. */
    public replacement(): Uint8Array {
        return this.#replacement;
    }

    /**
     * Replaces this encoder's current replacement value with the given new replacement.
     *
     * @param newReplacement The new replacement; must be a legal replacement, and must not be null.
     *
     * @returns This encoder.
     */
    public replaceWith(newReplacement: Uint8Array): CharsetEncoder {
        this.#replacement = newReplacement;

        return this;
    }

    /**
     * Resets this encoder, clearing any internal state.
     *
     * @returns This encoder.
     */
    public reset(): CharsetEncoder {
        return this;
    }

    /** @returns this encoder's current action for unmappable-character errors. */
    public unmappableCharacterAction(): CodingErrorAction {
        return this.#unmappableCharacterAction;
    }
}
