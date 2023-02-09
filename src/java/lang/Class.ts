/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java, S } from "../..";
import { JavaObject } from "./Object";

/** A partial implementation of Java's Class type. */
export class Class<T> extends JavaObject {

    private static classes = new Map<unknown, Class<unknown>>();

    private constructor(private c: typeof JavaObject) {
        super();
    }

    public static fromConstructor<T extends JavaObject>(c: typeof JavaObject): Class<T> {
        let clazz = Class.classes.get(c);
        if (!clazz) {
            clazz = new Class(c);
            Class.classes.set(c, clazz);
        }

        return clazz as Class<T>;
    }

    public getName(): java.lang.String {
        return S`${this.c.name}`;
    }

    public getSimpleName(): java.lang.String {
        return S`${this.c.name}`;
    }

    public isInstance(o: unknown): boolean {
        return o instanceof this.c;
    }

    public cast(o: unknown): T {
        return o as T;
    }

    public newInstance(): T {
        return new this.c() as T;
    }
}
