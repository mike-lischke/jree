/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import * as path from "path";

import { JavaString } from "../src/java/lang/String.js";

/**
 * Loads the given file and runs the entry method.
 *
 * @param fileName The file to load.
 * @param entry The entry method to run.
 * @param parameters The parameters to pass to the entry method. This is an array of arrays, where each
 *                   sub-array contains the parameters for one call.
 *
 * @throws Error if the file does not contain exactly one class or the entry method is not found.
 * @throws Error if the entry method throws an error.
 */
export const runTest = async (fileName: string, entry: string, parameters?: JavaString[][]): Promise<void> => {
    // Load the given file and check if it contains a class with the entry method.
    const module = await import(path.resolve(fileName)) as { [key: string]: { [key: string]: Function; }; };
    const keys = Object.keys(module);
    if (keys.length !== 1) {
        throw new Error("File must contain exactly one exported class.");
    }

    const clazz = module[keys[0]] as { [key: string]: Function; };
    if (clazz[entry] instanceof Function) {
        // Run the entry method.
        if (parameters) {
            for (const parameter of parameters) {
                await clazz[entry](parameter);
            }
        } else {
            clazz[entry]();
        }
    } else {
        throw new Error(`No method ${entry} found in file ${fileName}.`);
    }
};
