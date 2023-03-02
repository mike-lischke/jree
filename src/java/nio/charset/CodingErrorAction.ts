/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "../../lang/Object";

/** A typesafe enumeration for coding-error actions. */
export class CodingErrorAction extends JavaObject {
    /**
     * Action indicating that a coding error is to be handled by dropping the erroneous input and resuming the
     * coding operation.
     */
    public static readonly IGNORE = new CodingErrorAction("IGNORE");

    /**
     * Action indicating that a coding error is to be handled by dropping the erroneous input, appending the coder's
     * replacement value to the output buffer, and resuming the coding operation.
     */
    public static readonly REPLACE = new CodingErrorAction("REPLACE");

    /**
     * Action indicating that a coding error is to be reported, either by returning a CoderResult object or by
     * throwing a CharacterCodingException, whichever is appropriate for the method implementing the coding process.
     */
    public static readonly REPORT = new CodingErrorAction("REPORT");

    #name: string;

    private constructor(name: string) {
        super();

        this.#name = name;
    }

    public toString(): string {
        return this.#name;
    }
}
