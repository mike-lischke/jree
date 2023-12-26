/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "../lang/Object.js";
import { Locale } from "../util/Locale.js";

export class DateFormatSymbols extends JavaObject {
    public constructor();
    public constructor(locale: Locale);
    public constructor(locale?: Locale) {
        super();
    }
}
