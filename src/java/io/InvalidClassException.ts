/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../..";

import { S } from "../../templates";
import { ObjectStreamException } from "./ObjectStreamException";

export class InvalidClassException extends ObjectStreamException {
    public constructor(className: java.lang.String, reason: java.lang.String) {
        super(S`Invalid class "${className}: ${reason}"`);
    }
}
