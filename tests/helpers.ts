/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import * as path from "path";

/**
 * Loads the given file and runs the entry method.
 *
 * @param fileName The file to load.
 * @param entry The entry method to run.
 *
 * @throws Error if the file does not contain exactly one class or the entry method is not found.
 * @throws Error if the entry method throws an error.
 */
export const runTest = async (fileName: string, entry: string): Promise<void> => {
    // Load the given file and check if it contains a class with the entry method.
    const module = await import(path.resolve(fileName)) as { [key: string]: { [key: string]: Function; }; };
    const keys = Object.keys(module);
    if (keys.length !== 1) {
        throw new Error("File must contain exactly one exported class.");
    }

    const clazz = module[keys[0]] as { [key: string]: Function; };
    if (clazz[entry] instanceof Function) {
        clazz[entry]();
    } else {
        throw new Error(`No method ${entry} found in file ${fileName}.`);
    }
};
