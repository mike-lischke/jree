/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../lang/Object.js";
import { Format } from "./Format.js";

export class FieldPosition extends JavaObject {
    #beginIndex = 0;
    #endIndex = 0;

    public constructor(field: number);
    public constructor(field: number, fieldAttribute: Format.Field);
    public constructor(field: number, fieldAttribute?: Format.Field) {
        super();
    }

    /** Returns the field identifier. */
    public getField(): number;
    public getField(): Format.Field;
    public getField(): number | Format.Field {
        return 0;
    }

    /**
     * Returns the begin index of the field.
     *
     * @returns the begin index of the field
     */
    public getBeginIndex(): number {
        return 0;
    }

    /**
     * Returns the end index of the field.
     *
     * @returns the end index of the field
     */
    public getEndIndex(): number {
        return 0;
    }

    /**
     * Sets the begin index of the field.
     *
     * @param bi the begin index of the field
     */
    public setBeginIndex(bi: number): void {
        this.#beginIndex = bi;
    }

    /**
     * Sets the end index of the field.
     *
     * @param ei the end index of the field
     */
    public setEndIndex(ei: number): void {
        this.#endIndex = ei;
    }
}
