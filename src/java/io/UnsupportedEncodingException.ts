/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../lang/String";
import { IOException } from "./IOException";

export class UnsupportedEncodingException extends IOException {
    public constructor(name: JavaString) {
        super(new JavaString(`The encoding ${name} is not supported.`));
    }
}
