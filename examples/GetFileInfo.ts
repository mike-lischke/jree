/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, S } from "../src";

// Example taken from https://www.w3schools.com/java/showjava.asp?filename=demo_files_get.
export class GetFileInfo {
    public static main(args: java.lang.String[]): void {
        const myObj = new java.io.File(S`package.json`);
        if (myObj.exists()) {
            java.lang.System.out.println(S`File name: ${myObj.getName()}`);
            java.lang.System.out.println(S`Absolute path: ${myObj.getAbsolutePath()}`);
            java.lang.System.out.println(S`Executable: ${myObj.canExecute()}`);
            java.lang.System.out.println(S`Writeable: ${myObj.canWrite()}`);
            java.lang.System.out.println(S`Readable: ${myObj.canRead()}`);
            java.lang.System.out.println(S`File size in bytes: ${myObj.length()}`);
        } else {
            java.lang.System.out.println(S`The file does not exist.`);
        }
    }
}
