/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { java, S } from "../src";

export class HelloWorld {
    public static main(args: java.lang.String[]): void {
        java.lang.System.out.println(S`\nHello World!\n`);
    }
}
