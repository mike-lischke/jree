/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

const surrogateOffset = 0x10000 - (0xD800 << 10) - 0xDC00;

/**
 * Takes a UTF-16 char code array and returns the code point at the given index.
 * If the char code at the given index is a high surrogate, the next char code is
 * also considered. If the next char code is not a low surrogate, the high surrogate
 * is returned as code point.
 *
 * @param data The UTF-16 char code array.
 * @param index The index of the char code to return the code point for.
 *
 * @returns The code point at the given index.
 */
export const codePointFromUTF16 = (data: Uint16Array, index: number): number => {
    if (index < 0 || index >= data.length) {
        throw new Error("Index out of bounds");
    }

    const code = data[index];
    if (code >= 0xD800 && code <= 0xDBFF) {
        // Got a high surrogate value. See if there's a low one and compute the actual code point from that.
        if (index === data.length) {
            // Not enough data. Return just the high surrogate.
            return code;
        }

        const lowSurrogate = data[index + 1];
        if (lowSurrogate < 0xDC00 || lowSurrogate > 0xDFFF) {
            // Invalid low surrogate.
            return code;
        }

        return (code << 10) + lowSurrogate + surrogateOffset;
    }

    return code;

};

/**
 * Takes a UTF-16 char code array and returns the code point before the given index.
 * If the char code before the given index is a low surrogate, the char code before that
 * is also considered. If the char code before that is not a high surrogate, the low surrogate
 * is returned as code point.
 *
 * @param data The UTF-16 char code array.
 * @param index The index of the char code to return the code point for.
 *
 * @returns The code point before the given index.
 */
export const codePointBeforeFromUTF16 = (data: Uint16Array, index: number): number => {
    if (index < 1 || index >= data.length) {
        throw new Error("Index out of bounds");
    }

    const code = data[index - 1];
    if (code >= 0xDC00 && code <= 0xDFFF) {
        // Found a low surrogate. Can we create a full code point from that?
        if (index - 2 >= 0) {
            const highSurrogate = data[index - 2];
            if (highSurrogate >= 0xD800 && highSurrogate <= 0xDBFF) {
                return (highSurrogate << 10) + code + surrogateOffset;
            }
        }
    }

    return code;
};

/**
 * Converts a UTF-32 code point array to a UTF-16 char code array.
 *
 * @param data The UTF-32 code point array.
 *
 * @returns The UTF-16 char code array.
 */
export const convertUF32ToUTF16 = (data: Int32Array): Uint16Array => {
    const result = new Uint16Array(data.length * 2);
    let resultIndex = 0;
    for (const codePoint of data) {
        if (codePoint <= 0xFFFF) {
            result[resultIndex++] = codePoint;
        } else {
            const offset = codePoint - 0x10000;
            result[resultIndex++] = 0xD800 + (offset >> 10);
            result[resultIndex++] = 0xDC00 + (offset & 0x3FF);
        }
    }

    return result.subarray(0, resultIndex);
};

/**
 * Converts a Typescript string to a UTF-16 char code array. The string uses UTF-16 internally
 * so there's no need to handle surrogate pairs.
 *
 * @param data The Typescript string.
 *
 * @returns The UTF-16 char code array.
 */
export const convertStringToUTF16 = (data: string): Uint16Array => {
    const result = new Uint16Array(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = data.charCodeAt(i);
    }

    return result;
};

/**
 * Converts a UTF-16 char code array to a Typescript string. The string uses UTF-16 internally
 * so there's no need to handle surrogate pairs.
 *
 * @param data The UTF-16 char code array.
 *
 * @returns The Typescript string.
 */
export const convertUTF16ToString = (data: Uint16Array): string => {
    const decoder = new TextDecoder("utf-16");

    return decoder.decode(data);
};

/**
 * Searches the given array for the first occurrence of the given substring starting at the given index.
 *
 * @param data The array to search in.
 * @param searchValue The array to search for.
 * @param start The index to start the search at.
 *
 * @returns The index of the first char of the substring or -1 if not found.
 */
export const indexOfSubArray = (data: Uint16Array, searchValue: Uint16Array, start?: number): number => {
    start ??= 0;
    if (start < 0) {
        start = 0;
    }

    if (start + searchValue.length >= data.length) {
        return -1;
    }

    const firstCode = searchValue[0];
    for (let i = start; i < data.length; ++i) {
        if (i + searchValue.length >= data.length) {
            return -1;
        }

        if (data[i] === firstCode) {
            // Found the first char, now check the rest.
            let j = 1;
            for (; j < searchValue.length; ++j) {
                if (data[i + j] !== searchValue[j]) {
                    break;
                }
            }

            if (j === searchValue.length) {
                return i;
            }
        }
    }

    return -1;
};

/**
 * Searches the given array for the last occurrence of the given sub array starting at the given index.
 * The search starts at the end of the array and goes backwards.
 *
 * @param data The array to search in.
 * @param searchValue The array to search for.
 * @param start The index to start the search at.
 *
 * @returns The index of the first char of the substring or -1 if not found.
 */
export const lastIndexOfSubArray = (data: Uint16Array, searchValue: Uint16Array, start?: number): number => {
    start ??= data.length - 1;
    if (start < 0) {
        start = 0;
    }

    if (start + searchValue.length >= data.length) {
        start = data.length - searchValue.length;
    }

    const firstCode = searchValue[0];
    for (let i = start; i >= 0; --i) {
        if (data[i] === firstCode) {
            // Found the first char, now check the rest.
            let j = 1;
            for (; j < searchValue.length; ++j) {
                if (data[i + j] !== searchValue[j]) {
                    break;
                }
            }

            if (j === searchValue.length) {
                return i;
            }
        }
    }

    return -1;
};
