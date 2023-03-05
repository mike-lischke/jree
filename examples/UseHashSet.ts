/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { I, java, S } from "../src";

// Example taken from https://www.w3schools.com/java/tryjava.asp?filename=demo_hashset_integer.
export class UseHashSet {
    public static main(args: java.lang.String[]): void {
        // Create a HashSet object called numbers
        const numbers = new java.util.HashSet<java.lang.Integer>();

        // Add values to the set. Use the I`...` template literal to create a Java integer instance.
        numbers.add(I`4`);
        numbers.add(I`${7}`);
        numbers.add(I`8`);

        // Show which numbers between 1 and 10 are in the set
        for (let i = 1; i <= 10; i++) {
            if (numbers.contains(I`${i}`)) {
                java.lang.System.out.println(S`${i} was found in the set.`);
            } else {
                java.lang.System.out.println(S`${i} was not found in the set.`);
            }
        }
    }
}
