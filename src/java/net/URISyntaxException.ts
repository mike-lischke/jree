/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import type { JavaString } from "../lang/String";
import { Exception } from "../lang/Exception";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";

export class URISyntaxException extends Exception {
    #index: number;
    #input: string;
    #reason: string;

    public constructor(input: JavaString | string, reason: JavaString | string);
    public constructor(input: JavaString | string, reason: JavaString | string, index: number);
    public constructor(...args: unknown[]) {
        let input: JavaString | string;
        let reason: JavaString | string;
        let index = -1;
        switch (args.length) {
            case 2: {
                [input, reason] = args as [JavaString | string, JavaString | string];

                break;
            }

            case 3: {
                [input, reason, index] = args as [JavaString | string, JavaString | string, number];
                break;
            }

            default: {
                throw new IllegalArgumentException("Invalid number of arguments");
            }
        }

        const message = `The input "${input}" could not be parsed: ${reason}`;

        super(message);

        this.#index = index;
        this.#input = typeof input === "string" ? input : input.valueOf();
        this.#reason = typeof reason === "string" ? reason : reason.valueOf();
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
    public getInput(): string {
        return this.#input;
    }

    /**
     * @returns The reason why the input string could not be parsed.
     */
    public getReason(): string {
        return this.#reason;
    }

}
