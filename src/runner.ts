/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import path from "path";

import { JavaString } from "./java/lang/String.js";

/** Define the entry point of an executable TS class. */
interface IRunnable {
    main?: (args: JavaString[]) => void;
}

const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("Usage: ts-node runner <file>");
    process.exit(1);
}

(async () => {
    // Load the given file and check if it contains a class with a main method.
    const module = await import(path.resolve(args[0])) as { [key: string]: IRunnable; };
    const keys = Object.keys(module);
    if (keys.length !== 1) {
        console.error("File must contain exactly one class.");
        process.exit(1);
    }

    // We don't check the class name here, so it can be anything. The main method must be static though.
    // In production code you should check the class name and make sure it matches the file name.
    const clazz = module[keys[0]];
    if (clazz.main instanceof Function) {
        // Call the main method with the remaining arguments, converted to Java strings.
        clazz.main(args.slice(1).map((arg) => { return new JavaString(arg); }));
    } else {
        console.error("No main method found in file.");
    }
})().catch((e: Error) => {
    console.error("\nCannot load file: " + (e.stack ?? ""));
});
