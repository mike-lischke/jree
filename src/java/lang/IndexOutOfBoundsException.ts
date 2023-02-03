/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { java } from "../..";
import { RuntimeException } from "./RuntimeException";

export class IndexOutOfBoundsException extends RuntimeException {
    public constructor(message?: java.lang.String) {
        super(message ?? S`The given index is not within the bounds`);
    }
}
