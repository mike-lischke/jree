/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { JavaObject } from "../lang/Object";

export class FieldPosition extends JavaObject {
    #beginIndex = 0;
    #endIndex = 0;

    public constructor(field: number);
    public constructor(field: number, fieldAttribute: java.text.Format.Field);
    public constructor(field: number, fieldAttribute?: java.text.Format.Field) {
        super();
    }

    /** Returns the field identifier. */
    public getField(): number;
    public getField(): java.text.Format.Field;
    public getField(): number | java.text.Format.Field {
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
