/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE file for more info.
 */

/**
 * Helper method to convert Unicode 21 bit code points to a string, using the built-in TS string type.
 *
 * @param codePoints The codepoints to convert.
 *
 * @returns The string containing the values from the input.
 */
export const codePointsToString = (codePoints: Uint32Array): string => {
    return String.fromCodePoint(...codePoints);
};

/**
 * Helper method to convert Unicode 16 bit values to a string, using the built-in TS string type.
 * This conversion supports surrogate pairs.
 *
 * @param charCodes The codepoints to convert.
 *
 * @returns The string containing the values from the input.
 */
export const charCodesToString = (charCodes: Uint16Array): string => {
    return String.fromCharCode(...charCodes);
};
