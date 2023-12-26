/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaBoolean } from "./java/lang/Boolean.js";
import { Integer } from "./java/lang/Integer.js";
import { JavaString } from "./java/lang/String.js";

// Tagged templates for emulation of automatic boxing of primitive values.

/**
 * Tagged template function to convert a string literal to `java.lang.String`.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const S = (strings: TemplateStringsArray, ...values: unknown[]): JavaString => {
    const entries: string[] = [];
    let i = 0;
    while (true) {
        entries.push(strings[i]);
        if (i < values.length) {
            entries.push(`${values[i++]}`);
        } else {
            break;
        }
    }

    return new JavaString(entries.join(""));
};

/**
 * Tagged template function to convert a number primitive value or a number string literal to `java.lang.Integer`.
 * Note: only one argument must be given, either a string or a number.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const I = (strings: TemplateStringsArray, ...values: number[]): Integer => {
    if (values.length > 0) {
        return new Integer(values[0]);
    }

    return new Integer(strings[0]);
};

/**
 * Tagged template function to convert a boolean primitive value or a boolean string literal to `java.lang.Boolean`.
 * Note: only one argument must be given, either a string or a boolean.
 *
 * @param strings A list of strings in the string literal (all parts between expressions).
 * @param values The expressions used in string interpolation.
 *
 * @returns A `java.lang.String` instance with all strings concatenated.
 */
export const B = (strings: TemplateStringsArray, ...values: boolean[]): JavaBoolean => {
    if (values.length > 0) {
        return new JavaBoolean(values[0]);
    }

    return new JavaBoolean(strings[0]);
};
