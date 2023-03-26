/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java } from "../..";
import { JavaObject } from "../lang/Object";

export class DateFormatSymbols extends JavaObject {
    public constructor();
    public constructor(locale: java.util.Locale);
    public constructor(locale?: java.util.Locale) {
        super();
    }
}
