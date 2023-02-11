/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { S } from "../../templates";

import { IndexOutOfBoundsException } from "./IndexOutOfBoundsException";

/**
 * Thrown to indicate that an array has been accessed with an illegal index. The index is either negative or greater
 * than or equal to the size of the array.
 */
export class ArrayIndexOutOfBoundsException extends IndexOutOfBoundsException {
    public constructor();
    public constructor(index: number);
    public constructor(message?: java.lang.String);
    public constructor(indexOrMessage?: number | java.lang.String) {
        let message;
        if (typeof indexOrMessage === "number") {
            message = S`Array index out of range: ${indexOrMessage}`;
        } else {
            message = indexOrMessage;
        }

        super(message);
    }
}
