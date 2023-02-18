/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";

import { java, S } from "../..";

import { IListBackend } from "./ListIteratorImpl";
import { AbstractList } from "./AbstractList";

/**
 * Resizable-array implementation of the List interface. Implements all optional list operations, and permits all
 * elements (including null).
 */
export class ArrayList<T> extends AbstractList<T>
    implements java.lang.Cloneable<ArrayList<T>>, java.util.RandomAccess, java.io.Serializable {

    public constructor();
    public constructor(initialCapacity: number);
    public constructor(c: java.util.Collection<T>);
    /** This constructor is not part of the Java API, but helps creating lists from Typescript arrays. */
    public constructor(array: T[]);
    public constructor(...args: unknown[]) {
        let backend: IListBackend<T> | undefined;

        switch (args.length) {
            case 0: {
                // Use default.
                break;
            }

            case 1: {
                const end = Array.isArray(args[0]) ? args[0].length : (args[0] as java.util.Collection<T>).size();
                const input = args[0] as java.util.Collection<T> | T[];
                backend = {
                    list: List(input),
                    start: 0,
                    end,
                    updateEnd: (delta: number) => {
                        // Nothing to do here.
                    },
                };
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Wrong number of arguments`);
            }
        }

        super(backend);
    }

    public clone(): ArrayList<T> {
        return this.createClone(ArrayList) as ArrayList<T>;
    }

    /**
      Trims the capacity of this ArrayList instance to be the list's current size.
     */
    public trimToSize(): void {
        // Nothing to do here.
    }
}
