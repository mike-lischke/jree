/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, S } from "../src";

// Example taken from https://www.w3schools.com/java/tryjava.asp?filename=demo_iterator_loop.
export class IteratorLoop {
    public static main(args: java.lang.String[]): void {
        // Make a collection.
        // Use the S`...` template literal to create a Java string instance.
        const cars = new java.util.ArrayList<java.lang.String>();
        cars.add(S`Volvo`);
        cars.add(new java.lang.String("BMW")); // The Java string accepts Typescript strings as well.
        cars.add(S`Ford`);
        cars.add(S`Mazda`);

        // Get the iterator
        const it = cars.iterator();

        // Loop through a collection
        while (it.hasNext()) {
            java.lang.System.out.println(it.next());
        }
    }
}
