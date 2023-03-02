/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { java } from "../..";
import { JavaObject } from "./Object";

import { MurmurHash } from "../../MurmurHash";
import { S } from "../../templates";

export class Enum<T extends Enum<T>> extends JavaObject {
    // Holds all created enum values for the class.
    private static members: unknown[] = [];

    #name: java.lang.String;
    #ordinal = 0;

    public constructor(name: java.lang.String, ordinal: number) {
        super();

        this.#name = name;
        this.#ordinal = ordinal;

        Enum.members.push(this);
    }

    /**
     * Returns the enum constant of the specified enum type with the specified name.
     *
     * @param name the name of the enum constant to be returned.
     *
     * @returns the enum constant with the specified name.
     *
     * @throws IllegalArgumentException if the specified enum type has no constant with the specified name.
     */
    public static valueOf<T extends Enum<T>>(name: java.lang.String): T {
        for (const value of Enum.members as T[]) {
            if (value.name() === name) {
                return value;
            }
        }

        throw new java.lang.IllegalArgumentException(S`No enum constant ${name}`);
    }

    /**
     * Returns an array containing the constants of this enum type, in the order they are declared.
     * This method may be used to iterate over the constants as follows:
     * ```
     * for (const c of Enum.values())
     *    System.out.println(c);
     * ```
     *
     * @returns an array containing the constants of this enum type, in the order they are declared.
     */
    public static values<T extends Enum<T>>(): T[] {
        return Enum.members as T[];
    }

    /** @returns a hash code for this enum constant. */
    public hashCode(): number {
        let result = MurmurHash.initialize(37);
        result = MurmurHash.update(result, this.#name);
        result = MurmurHash.update(result, this.#ordinal);

        return MurmurHash.finish(result, 2);
    }

    /** @returns the name of this enum constant, exactly as declared in its enum declaration. */
    public name(): java.lang.String {
        return this.#name;
    }

    /**
     * @returns the ordinal of this enumeration constant(its position in its enum declaration, where the initial
     * constant is assigned an ordinal of zero).
     */
    public ordinal(): number {
        return this.#ordinal;
    }

    /** @returns the name of this enum constant, as contained in the declaration. */
    public toString(): string {
        return `${this.#name}`;
    }

    protected [Symbol.toPrimitive](hint: string): number | string {
        if (hint === "string") {
            return this.#ordinal.toString();
        }

        return this.#ordinal;
    }

}
