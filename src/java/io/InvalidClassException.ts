/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";

import { S } from "../../templates";
import { ObjectStreamException } from "./ObjectStreamException";

export class InvalidClassException extends ObjectStreamException {
    public constructor(className: java.lang.String, reason: java.lang.String) {
        super(S`Invalid class "${className}: ${reason}"`);
    }
}
