/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, S } from "../..";
import { Exception } from "../lang";

export class URISyntaxException extends Exception {
    #index: number;
    #input: java.lang.String;
    #reason: java.lang.String;

    public constructor(input: java.lang.String, reason: java.lang.String);
    public constructor(input: java.lang.String, reason: java.lang.String, index: number);
    public constructor(...args: unknown[]) {
        let input: java.lang.String;
        let reason: java.lang.String;
        let index = -1;
        switch (args.length) {
            case 2: {
                [input, reason] = args as [java.lang.String, java.lang.String];

                break;
            }

            case 3: {
                [input, reason, index] = args as [java.lang.String, java.lang.String, number];
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
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
    public getInput(): java.lang.String {
        return this.#input;
    }

    /**
     * @returns The reason why the input string could not be parsed.
     */
    public getReason(): java.lang.String {
        return this.#reason;
    }

}
