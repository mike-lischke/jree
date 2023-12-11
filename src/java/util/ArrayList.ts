/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { AbstractList, ISubList } from "./AbstractList.js";
import { Cloneable } from "../lang/Cloneable.js";
import { RandomAccess } from "./RandomAccess.js";
import { Serializable } from "../io/Serializable.js";
import { Collection } from "./Collection.js";
import { IllegalArgumentException } from "../lang/IllegalArgumentException.js";
import { NullPointerException } from "../lang/NullPointerException.js";
import { JavaString } from "../lang/String.js";

/**
 * Resizable-array implementation of the List interface. Implements all optional list operations, and permits all
 * elements (including null).
 */
export class ArrayList<T> extends AbstractList<T> implements Cloneable<ArrayList<T>>, RandomAccess, Serializable {

    public constructor();
    public constructor(initialCapacity: number);
    public constructor(c: Collection<T>);
    /** This constructor is not part of the Java API, but helps creating lists from Typescript arrays. */
    public constructor(array: T[]);
    public constructor(...args: unknown[]) {
        let backend: ISubList<T> | undefined;

        switch (args.length) {
            case 0: {
                backend = {
                    data: [],
                    start: 0,
                    end: 0,
                };

                break;
            }

            case 1: {
                let end;
                let input: Collection<T> | T[];
                const arg = args[0] as number | Collection<T> | T[];
                if (typeof arg === "number") {
                    end = 0;
                    input = new Array<T>(arg);
                    input.fill(null as T);
                } else if (Array.isArray(arg)) {
                    end = arg.length;
                    input = arg;

                    input.every((element) => {
                        if (element == null) {
                            throw new NullPointerException();
                        }

                        return true;
                    });
                } else {
                    end = arg.size();
                    input = arg.toArray();
                }

                backend = {
                    data: input,
                    start: 0,
                    end,
                };

                break;
            }

            default: {
                throw new IllegalArgumentException(new JavaString(`Wrong number of arguments`));
            }
        }

        super(backend);
    }

    public override clone(): ArrayList<T> {
        return this.createClone(ArrayList) as ArrayList<T>;
    }

    /**
      Trims the capacity of this ArrayList instance to be the list's current size.
     */
    public trimToSize(): void {
        // Nothing to do here.
    }
}
