/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { S } from "../../templates";
import { Exception } from "../lang/Exception";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaString } from "../lang/String";

export class URISyntaxException extends Exception {
    #index: number;
    #input: JavaString;
    #reason: JavaString;

    public constructor(input: JavaString, reason: JavaString);
    public constructor(input: JavaString, reason: JavaString, index: number);
    public constructor(...args: unknown[]) {
        let input: JavaString;
        let reason: JavaString;
        let index = -1;
        switch (args.length) {
            case 2: {
                [input, reason] = args as [JavaString, JavaString];

                break;
            }

            case 3: {
                [input, reason, index] = args as [JavaString, JavaString, number];
                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString("Invalid number of arguments"));
            }
        }

        const message = S`The input "${input}" could not be parsed: ${reason}`;

        super(message);

        this.#index = index;
        this.#input = input;
        this.#reason = reason;
    }

    /**
     * @returns The input string.
     */
    public getIndex(): number {
        return this.#index;
    }

    /**
     * @returns The input string.
     */
    public getInput(): JavaString {
        return this.#input;
    }

    /**
     * @returns The reason why the input string could not be parsed.
     */
    public getReason(): JavaString {
        return this.#reason;
    }

}
