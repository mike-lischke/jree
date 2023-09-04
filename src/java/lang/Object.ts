/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import type { int } from "../../types";

/** Helper interface to add the implicit reflection stuff to each translated interface. */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IReflection {
    // getClass<T extends JavaObject>(): Class<T>;
}

// JavaObject and Class depend directly on each other, so we need to define them in the same file.

/** Implements the Java Object semantics. */
export class JavaObject implements IReflection {
    static #nextId = 0;

    // Represents the default hash code of a Java object. Using a running number here.
    readonly #id;

    public constructor() {
        this.#id = JavaObject.#nextId++;
    }

    /*public static get class(): Class<JavaObject> {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return Class.fromConstructor(this.constructor as typeof JavaObject);
    }*/

    /**
     * Indicates whether some other object is "equal to" this one.
     *
     * @param obj The object to compare this instance to.
     *
     * @returns True if the given object is the same as this object.
     */
    public equals(obj: unknown): boolean {
        return obj === this; // Identity or reference equality, by default.
    }

    /** @returns the runtime class of this JavaObject. */
    /*public getClass<T extends JavaObject>(): Class<T> {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return Class.fromConstructor(this.constructor as typeof JavaObject);
    }*/

    /** @returns a hash code value for the object. */
    public hashCode(): int {
        return this.#id;
    }

    /** Wakes up a single thread that is waiting on this object's monitor. */
    public notify(): void {
        // No implementation needed.
    }

    /** Wakes up all threads that are waiting on this object's monitor. */
    public notifyAll(): void {
        // No implementation needed.
    }

    /**
     * Causes the current thread to wait until either another thread invokes the notify() method or the notifyAll()
     * method for this object, or a specified amount of time has elapsed.
     *
     * @param timeout tbd
     * @param nanos tbd
     */
    public wait(timeout?: number, nanos?: number): void {
        // No implementation needed.
    }

    /** Creates and returns a copy of this object. */
    protected clone(): JavaObject {
        // Cannot throw the exception directly, as that would create a circular dependency.
        throw new Error("CloneNotSupportedException");
    }

    protected [Symbol.toPrimitive](_hint: string): bigint | number | boolean | string | null {
        return `${this.constructor.name}@${this.#id.toString(16)}`;
    }
}

/** A partial implementation of Java's Class type. */
export class Class<T> extends JavaObject {
    // This is the class registry in the library and is used to return a Class object for a given fully qualified
    // class name.
    static #classes = new Map<string, Class<JavaObject>>();

    private constructor(private c: typeof JavaObject) {
        super();
    }

    /**
     * Returns the Class object associated with the class or interface with the given string name.
     * It looks for a class file with the given name (using the individual parts as folder names) and loads it
     * with a dynamic import.
     *
     * @param name The fully qualified name of the desired class.
     *
     * @returns A promise resolving to the class object for the requested class or null, if the class cannot be loaded.
     */
    public async forName<T extends JavaObject>(name: string): Promise<Class<T> | null> {
        let clazz = Class.#classes.get(name);
        if (clazz) {
            return clazz as Class<T>;
        }

        const parts = name.split(".");
        const fileName = parts.join("/") + ".js";
        const module = await import(fileName);
        if (module) {
            clazz = new Class(module.default as typeof JavaObject);
            Class.#classes.set(name, clazz);

            return clazz as Class<T>;
        }

        return null;
    }

    public getName(): string {
        return this.c.name;
    }

    public getSimpleName(): string {
        return this.c.name;
    }

    /**
     * Determines if the class or interface represented by this Class object is either the same as, or is a superclass
     * or super interface of, the class or interface represented by the specified Class parameter.
     *
     * @param cls The class to check against.
     *
     * @returns the boolean value indicating whether objects of the type cls can be assigned to objects of this class.
     */
    public isAssignableFrom(cls: Class<unknown>): boolean {
        // Same type?
        if (this.c.prototype === cls.c.prototype) {
            return true;
        }

        // Is cls a subclass of this.c?
        return this.c.prototype instanceof cls.c;
    }

    public isInstance(o: unknown): boolean {
        return o instanceof this.c;
    }

    public newInstance(): T {
        return new this.c() as T;
    }
}
