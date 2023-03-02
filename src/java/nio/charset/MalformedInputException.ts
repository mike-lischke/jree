/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { CharacterCodingException } from "./CharacterCodingException";

export class MalformedInputException extends CharacterCodingException {
    #length: number;

    /**
     * Constructs an MalformedInputException with the given length.
     *
     * @param length the length of the input
     */
    public constructor(length: number) {
        super();
        this.#length = length;
    }

    /** @returns the length of the input */
    public getInputLength(): number {
        return this.#length;
    }
}
