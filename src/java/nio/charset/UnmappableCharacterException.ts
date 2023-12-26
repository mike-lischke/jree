/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { CharacterCodingException } from "./CharacterCodingException.js";

export class UnmappableCharacterException extends CharacterCodingException {
    #length: number;

    /**
     * Constructs an UnmappableCharacterException with the given length.
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
