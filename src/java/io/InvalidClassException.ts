/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { S } from "../../templates.js";
import { JavaString } from "../lang/String.js";
import { ObjectStreamException } from "./ObjectStreamException.js";

export class InvalidClassException extends ObjectStreamException {
    public constructor(className: JavaString, reason: JavaString) {
        super(S`Invalid class "${className}: ${reason}"`);
    }
}
