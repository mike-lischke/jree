/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { java, S } from "../src";

export class PrintArguments {
    public static main(args: java.lang.String[]): void {
        if (args.length === 0) {
            java.lang.System.out.println(S`\nNo arguments have been passed.\n`);
        } else {
            java.lang.System.out.println(S`\nFollowing arguments have been passed:\n`);
            for (let i = 0; i < args.length; i++) {
                // This line shows how to use the S`...` template literal to format strings and create
                // a Java string instance.
                java.lang.System.out.println(S`Argument ${i}: ${args[i]}`);
            }

            // Or alternatively:
            // args.forEach((arg, i) => {
            //    java.lang.System.out.println(S`Argument ${i}: ${arg}`);
            // });
        }
    }
}
