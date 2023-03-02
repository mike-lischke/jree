/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../lang/String";
import { IOException } from "./IOException";

export class UnsupportedEncodingException extends IOException {
    public constructor(name: JavaString) {
        super(new JavaString(`The encoding ${name} is not supported.`));
    }
}
