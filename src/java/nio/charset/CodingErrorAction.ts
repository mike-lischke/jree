/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../../lang/String";
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

    #name: string; // Need TS string here to avoid circular dependency on JavaString.

    private constructor(name: string) {
        super();

        this.#name = name;
    }

    public override toString(): JavaString {
        return new JavaString(this.#name);
    }
}
