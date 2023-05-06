/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { double, float, int, long } from "../../types";
import { IllegalArgumentException } from "../lang/IllegalArgumentException";
import { JavaObject } from "../lang/Object";

/**
 * An instance of this class is used to generate a stream of pseudorandom numbers. The class uses a 48-bit seed, which
 * is modified using a linear congruential formula. (See Donald Knuth, The Art of Computer Programming, Volume 2,
 * Section 3.2.1.)
 */
export class Random extends JavaObject {
    #seed: long = 0n;
    #haveNextNextGaussian = false;
    #nextNextGaussian: double = 0;

    public constructor();
    public constructor(seed: long);
    public constructor(seed?: long) {
        super();

        this.setSeed(seed ?? BigInt(new Date().getTime()));
    }

    /**
     * Generates random bytes and places them into a user-supplied byte array. The number of random bytes produced is
     * equal to the length of the byte array.
     *
     * @param bytes The byte array to fill with random bytes.
     */
    public nextBytes(bytes: Uint8Array): void {
        for (let i = 0; i < bytes.length; i++) {
            for (let rnd = this.nextInt(), n = Math.min(bytes.length - i, 4); n-- > 0; rnd >>= 8) {
                bytes[i++] = rnd;
            }
        }
    }

    /** @returns the next pseudorandom, uniformly distributed int value from this random number generator's sequence. */
    public nextInt(): int;
    /**
     * Returns a pseudorandom, uniformly distributed int value between 0 (inclusive) and the specified value
     * (exclusive), drawn from this random number generator's sequence.
     */
    public nextInt(bound: int): int;
    public nextInt(bound?: int): int {
        if (bound === undefined) {
            return this.next(32);
        }

        if (bound <= 0) {
            throw new IllegalArgumentException("bound must be positive");
        }

        if ((bound & -bound) === bound) { // i.e., bound is a power of 2
            return bound * Number(BigInt(this.next(31)) >> 31n);
        }

        let bits: int;
        let val: int;
        do {
            bits = this.next(31);
            val = bits % bound;
        } while (bits - val + (bound - 1) < 0);

        return val;
    }

    /**
     * @returns the next pseudorandom, uniformly distributed long value from this random number generator's sequence.
     */
    public nextLong(): long {
        return ((BigInt(this.next(32) & 0xffffffff)) << 32n) | (BigInt(this.next(32) & 0xffffffff));
    }

    /**
     * @returns the next pseudorandom, uniformly distributed boolean value from this random number generator's sequence.
     */
    public nextBoolean(): boolean {
        return this.next(1) !== 0;
    }

    /**
     * @returns the next pseudorandom, uniformly distributed float value between 0.0 and 1.0 from this random number
     * generator's sequence.
     */
    public nextFloat(): float {
        return this.next(24) / (1 << 24);
    }

    /**
     * @returns the next pseudorandom, uniformly distributed double value between 0.0 and 1.0 from this random number
     * generator's sequence.
     */
    public nextDouble(): double {
        return Number((((BigInt(this.next(26)) << 27n) + BigInt(this.next(27))) / (1n << 53n)));
    }

    /**
     * @returns the next pseudorandom, Gaussian ("normally") distributed double value with mean 0.0 and standard
     * deviation 1.0 from this random number generator's sequence.
     */
    public nextGaussian(): double {
        if (this.#haveNextNextGaussian) {
            this.#haveNextNextGaussian = false;

            return this.#nextNextGaussian;
        } else {
            let v1: double;
            let v2: double;
            let s: double;
            do {
                v1 = 2 * this.nextDouble() - 1;   // between -1.0 and 1.0
                v2 = 2 * this.nextDouble() - 1;   // between -1.0 and 1.0
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);

            // TODO: once we have StrictMath replace the Math calls with it.
            const multiplier = Math.sqrt(-2 * Math.log(s) / s);
            this.#nextNextGaussian = v2 * multiplier;
            this.#haveNextNextGaussian = true;

            return v1 * multiplier;
        }
    }

    /**
     * Sets the seed of this random number generator using a single seed.
     *
     * @param newSeed The new seed.
     */
    public setSeed(newSeed: long): void {
        this.#seed = (newSeed ^ 0x5DEECE66Dn) & ((1n << 48n) - 1n);
    }

    /**
     * Generates the next pseudorandom number.
     * The general contract of next is that it returns an int value and if the argument bits is between 1 and 32
     * (inclusive), then that many low-order bits of the returned value will be (approximately) independently chosen
     * bit values, each of which is (approximately) equally likely to be 0 or 1.
     *
     * @param bits The number of bits to return.
     *
     * @returns The next pseudorandom value from this random number generator's sequence.
     */
    protected next(bits: int): int {
        this.#seed = (this.#seed * 0x5DEECE66Dn + 0xBn) & ((1n << 48n) - 1n);

        return Number(this.#seed) >>> (48 - bits);
    }
}
