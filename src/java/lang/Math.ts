/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { double, float, int, long } from "../../types";

import { ArithmeticException } from "./ArithmeticException";
import { IllegalArgumentException } from "./IllegalArgumentException";

import { JavaObject } from "./Object";

/**
 * The class Math contains methods for performing basic numeric operations such as the elementary exponential,
 * logarithm, square root, and trigonometric functions.
 */
export class JavaMath extends JavaObject {
    /** The double value that is closer than any other to e, the base of the natural logarithms. */
    public static readonly E = Math.E;
    /**
     * The double value that is closer than any other to pi, the ratio of the circumference of a circle to its
     * diameter.
     */
    public static readonly PI = Math.PI;

    /** Returns the absolute value of a double value. */
    public static abs(d: double): double;
    /** Returns the absolute value of a float value. */
    public static abs(a: float): float;
    /** Returns the absolute value of an int value. */
    public static abs(a: int): int;
    /** Returns the absolute value of a long value. */
    public static abs(a: long): long;
    public static abs(a: double | float | int | long): double | float | int | long {
        return (a < 0) ? -a : a;
    }

    /**
     * @param d the value whose arc cosine is to be returned.
     *
     * @returns the arc cosine of a value; the returned angle is in the range 0.0 through pi.
     */
    public static acos(d: double): double {
        return Math.acos(d);
    }

    /** Returns the sum of its arguments, throwing an exception if the result overflows an int. */
    public static addExact(a: int, b: int): int;
    /** Returns the sum of its arguments, throwing an exception if the result overflows a long. */
    public static addExact(a: long, b: long): long;
    public static addExact(...args: unknown[]): int | long {
        if (args.length === 2) {
            if (typeof args[0] === "number") {
                const [a, b] = args as [int, int];
                const result = a + b;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a, b] = args as [long, long];
                const result = a + b;
                const asInt = BigInt.asIntN(64, result);
                if (result !== asInt) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * @param d the value whose arc sine is to be returned.
     *
     * @returns the arc tangent of a value; the returned angle is in the range -pi/2 through pi/2.
     */
    public static asin(d: double): double {
        return Math.asin(d);
    }

    /**
     * @param d the value whose arc tangent is to be returned.
     *
     * @returns the arc tangent of a value; the returned angle is in the range -pi/2 through pi/2.
     */
    public static atan(d: double): double {
        return Math.atan(d);
    }

    /**
     * @param y the ordinate coordinate
     * @param x the abscissa coordinate
     *
     * @returns the angle theta from the conversion of rectangular coordinates (x, y) to polar coordinates (r, theta).
     */
    public static atan2(y: double, x: double): double {
        return Math.atan2(y, x);
    }

    /**
     * @param d the value whose cube root is to be returned.
     *
     * @returns the cube root of a value.
     */
    public static cbrt(d: double): double {
        return Math.cbrt(d);
    }

    /**
     * @param d the value whose ceiling is to be returned.
     *
     * @returns the smallest (closest to negative infinity) double value that is greater than or equal to the argument
     *         and is equal to a mathematical integer.
     */
    public static ceil(d: double): double {
        return Math.ceil(d);
    }

    /** Returns the first floating-point argument with the sign of the second floating-point argument. */
    public static copySign(magnitude: double, sign: double): double;
    /** Returns the first floating-point argument with the sign of the second floating-point argument. */
    public static copySign(magnitude: float, sign: float): float;
    public static copySign(magnitude: double | float, sign: double | float): double | float {
        return (sign < 0) ? -magnitude : magnitude;
    }

    /**
     * @param d the value whose cosine is to be returned.
     *
     * @returns the cosine of an angle.
     */
    public static cos(d: double): double {
        return Math.cos(d);
    }

    /**
     * @param d the value whose hyperbolic cosine is to be returned.
     *
     * @returns the hyperbolic cosine of a value.
     */
    public static cosh(d: double): double {
        return Math.cosh(d);
    }

    /** Returns the argument decremented by one, throwing an exception if the result overflows an int. */
    public static decrementExact(a: int): int;
    /** Returns the argument decremented by one, throwing an exception if the result overflows a long. */
    public static decrementExact(a: long): long;
    public static decrementExact(...args: unknown[]): int | long {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                const [a] = args as [int];
                const result = a - 1;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a] = args as [long];
                const result = a - 1n;
                const asInt = BigInt.asIntN(64, result);
                if (result !== asInt) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * @param d the value whose exponential is to be returned.
     *
     * @returns Euler's number e raised to the power of a double value.
     */
    public static exp(d: double): double {
        return Math.exp(d);
    }

    /**
     * @param d the value whose exponential minus one is to be returned.
     *
     * @returns e^x -1.
     */
    public static expm1(d: double): double {
        return Math.expm1(d);
    }

    /**
     * @param d the value whose floor is to be returned.
     *
     * @returns the largest (closest to positive infinity) double value that is less than or equal to the argument and
     *        is equal to a mathematical integer.
     */
    public static floor(d: double): double {
        return Math.floor(d);
    }

    /**
     * Returns the largest (closest to positive infinity) int value that is less than or equal to the algebraic
     * quotient.
     */
    public static floorDiv(a: int, b: int): int;
    /**
     * Returns the largest (closest to positive infinity) long value that is less than or equal to the algebraic
     * quotient.
     */
    public static floorDiv(a: long, b: int): int;
    /**
     * Returns the largest (closest to positive infinity) long value that is less than or equal to the algebraic
     * quotient.
     */
    public static floorDiv(a: long, b: long): long;
    public static floorDiv(...args: unknown[]): int | long {
        if (args.length === 2) {
            if (typeof args[0] === "number") {
                const [a, b] = args as [int, int];

                return Math.floor(a / b);
            } else {
                const [a, b] = args as [long, long | int];

                return a / BigInt(b); // bigint has no fractional part.
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /** Returns the floor modulus of the int arguments. */
    public static floorMod(a: int, b: int): int;
    /** Returns the floor modulus of the long arguments. */
    public static floorMod(a: long, b: int): int;
    /** Returns the floor modulus of the long arguments. */
    public static floorMod(a: long, b: long): long;
    public static floorMod(...args: unknown[]): int | long {
        if (args.length === 2) {
            if (typeof args[0] === "number") {
                const [a, b] = args as [int, int];

                return (a % b + b) % b;
            } else {
                const [a, b] = args as [long, long | int];
                const bb = BigInt(b);

                return (a % bb + bb) % bb;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * Returns the fused multiply add of the three arguments; that is, returns the exact product of the first two
     * arguments summed with the third argument and then rounded once to the nearest double.
     */
    public static fma(d: double, b: double, c: double): double;
    /**
     * Returns the fused multiply add of the three arguments; that is, returns the exact product of the first two
     * arguments summed with the third argument and then rounded once to the nearest float.
     */
    public static fma(a: float, b: float, c: float): float;
    public static fma(a: float | double, b: float | double, c: float | double): float | double {
        return Math.round(a * b + c);
    }

    /** Returns the unbiased exponent used in the representation of a double. */
    public static getExponent(d: double): int;
    /** Returns the unbiased exponent used in the representation of a float. */
    public static getExponent(a: float): int;
    public static getExponent(a: float | double): int {
        return Math.floor(Math.log10(a));
    }

    /**
     * @param x the first value
     * @param y the second value
     * @returns sqrt(x^2 +y^2) without intermediate overflow or underflow.
     */
    public static hypot(x: double, y: double): double {
        return Math.hypot(x, y);
    }

    /**
     * Computes the remainder operation on two arguments as prescribed by the IEEE 754 standard.
     *
     * @param f1 the dividend
     * @param f2 the divisor
     *
     * @returns the remainder when x is divided by y
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static IEEEremainder(f1: double, f2: double): double {
        return f1 % f2;
    }

    /** Returns the argument incremented by one, throwing an exception if the result overflows an int. */
    public static incrementExact(a: int): int;
    /** Returns the argument incremented by one, throwing an exception if the result overflows a long. */
    public static incrementExact(a: long): long;
    public static incrementExact(...args: unknown[]): int | long {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                const [a] = args as [int];
                const result = a + 1;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a] = args as [long];
                const result = a + 1n;
                const asInt = BigInt.asIntN(64, result);
                if (result !== asInt) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * @param d the value
     *
     * @returns the natural logarithm (base e) of a double value.
     */
    public static log(d: double): double {
        return Math.log(d);
    }

    /**
     * @param d the value
     *
     * @returns the base 10 logarithm of a double value.
     */
    public static log10(d: double): double {
        return Math.log10(d);
    }

    /**
     * @param d the value
     *
     * @returns the natural logarithm of the sum of the argument and 1.
     */
    public static log1p(d: double): double {
        return Math.log1p(d);
    }

    /** Returns the larger of two double values. */
    public static max(a: double, b: double): double;
    /** Returns the larger of two float values. */
    public static max(a: float, b: float): float;
    /** Returns the larger of two int values. */
    public static max(a: int, b: int): int;
    /** Returns the larger of two long values. */
    public static max(a: long, b: long): long;
    public static max(...args: unknown[]): int | long | float | double {
        if (args.length === 2) {
            const [a, b] = args as [int | long | float | double, int | long | float | double];

            return a > b ? a : b;
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /** Returns the smaller of two double values. */
    public static min(a: double, b: double): double;
    /** Returns the smaller of two float values. */
    public static min(a: float, b: float): float;
    /** Returns the smaller of two int values. */
    public static min(a: int, b: int): int;
    /** Returns the smaller of two long values. */
    public static min(a: long, b: long): long;
    public static min(...args: unknown[]): int | long | float | double {
        if (args.length === 2) {
            const [a, b] = args as [int | long | float | double, int | long | float | double];

            return a < b ? a : b;
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /** Returns the product of the arguments, throwing an exception if the result overflows an int. */
    public static multiplyExact(a: int, b: int): int;
    /** Returns the product of the arguments, throwing an exception if the result overflows a long. */
    public static multiplyExact(a: long, b: int): long;
    /** Returns the product of the arguments, throwing an exception if the result overflows a long. */
    public static multiplyExact(a: long, b: long): long;
    public static multiplyExact(...args: unknown[]): int | long {
        if (args.length === 2) {
            if (typeof args[0] === "number") {
                const [a, b] = args as [int, int];
                const result = a * b;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a, b] = args as [long, long | int];
                const result = a * BigInt(b);
                const asInt = BigInt.asIntN(64, result);
                if (result !== asInt) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * @param a first operand
     * @param b second operand
     *
     * @returns the exact mathematical product of the arguments.
     */
    public static multiplyFull(a: int, b: int): long {
        return BigInt(a) * BigInt(b);
    }

    /**
     * @param a first operand
     * @param b second operand
     *
     * @returns as a long the most significant 64 bits of the 128-bit product of two 64-bit factors.
     */
    public static multiplyHigh(a: long, b: long): long {
        return (a * b) >> 64n;
    }

    /** Returns the negation of the argument, throwing an exception if the result overflows an int. */
    public static negateExact(a: int): int;
    /** Returns the negation of the argument, throwing an exception if the result overflows a long. */
    public static negateExact(a: long): long;
    public static negateExact(...args: unknown[]): int | long {
        if (args.length === 1) {
            if (typeof args[0] === "number") {
                const [a] = args as [int];
                const result = -a;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a] = args as [long];
                const result = -a;
                const asInt = BigInt.asIntN(64, result);
                if (result !== asInt) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /** Returns the floating-point number adjacent to the first argument in the direction of the second argument. */
    public static nextAfter(start: double, direction: double): double;
    /** Returns the floating-point number adjacent to the first argument in the direction of the second argument. */
    public static nextAfter(start: float, direction: float): float;
    public static nextAfter(start: number, direction: number): number {
        // Taken from https://stackoverflow.com/questions/72185266/.
        const f64 = new Float64Array(1);
        const b64 = new BigInt64Array(f64.buffer);

        // Branch to descending case first as it is more costly than ascending
        // case due to start != 0.0d conditional.
        if (start > direction) {
            // descending
            if (start !== 0) {
                f64[0] = start;
                const transducer = b64[0];
                b64[0] = transducer + (transducer > 0n ? -1n : 1n);

                return f64[0];
            } else {
                // start == 0.0d && direction < 0.0d
                return -Number.MIN_VALUE;
            }
        } else if (start < direction) {
            // ascending
            // Add +0.0 to get rid of a -0.0 (+0.0 + -0.0 => +0.0)
            // then bitwise convert start to integer.
            f64[0] = start + 0;
            const transducer = b64[0];
            b64[0] = transducer + (transducer >= 0n ? 1n : -1n);

            return f64[0];
        } else if (start === direction) {
            return direction;
        } else {
            // isNaN(start) || isNaN(direction)
            return start + direction;
        }
    }

    /** Returns the floating-point value adjacent to d in the direction of negative infinity. */
    public static nextDown(d: double): double;
    /** Returns the floating-point value adjacent to f in the direction of negative infinity. */
    public static nextDown(f: float): float;
    public static nextDown(a: number): number {
        if (a === Number.NEGATIVE_INFINITY) {
            return Number.NEGATIVE_INFINITY;
        } else if (a === Number.POSITIVE_INFINITY) {
            return Number.MAX_VALUE;
        } else if (a === Number.MAX_VALUE) {
            return Number.MAX_VALUE - Number.MIN_VALUE;
        } else if (a === Number.MIN_VALUE) {
            return -Number.MIN_VALUE;
        } else if (a === 0) {
            return -Number.MIN_VALUE;
        } else if (a === -0) {
            return -Number.MIN_VALUE;
        } else if (a < 0) {
            return a + Number.MIN_VALUE;
        } else {
            return a - Number.MIN_VALUE;
        }
    }

    /** Returns the floating-point value adjacent to d in the direction of positive infinity. */
    public static nextUp(d: double): double;
    /** Returns the floating-point value adjacent to f in the direction of positive infinity. */
    public static nextUp(f: float): float;
    public static nextUp(a: number): number {
        if (a === Number.NEGATIVE_INFINITY) {
            return -Number.MAX_VALUE;
        } else if (a === Number.POSITIVE_INFINITY) {
            return Number.POSITIVE_INFINITY;
        } else if (a === Number.MAX_VALUE) {
            return Number.POSITIVE_INFINITY;
        } else if (a === Number.MIN_VALUE) {
            return Number.MIN_VALUE;
        } else if (a === 0) {
            return Number.MIN_VALUE;
        } else if (a === -0) {
            return Number.MIN_VALUE;
        } else if (a < 0) {
            return a - Number.MIN_VALUE;
        } else {
            return a + Number.MIN_VALUE;
        }
    }

    /**
     * @param a the base.
     * @param b the exponent.
     *
     * @returns the value of the first argument raised to the power of the second argument.
     */
    public static pow(a: double, b: double): double {
        return Math.pow(a, b);
    }

    /** @returns a double value with a positive sign, greater than or equal to 0.0 and less than 1.0. */
    public static random(): double {
        return Math.random();
    }

    /**
     * @param d a double value
     *
     * @returns the double value that is closest in value to the argument and is equal to a mathematical integer.
     */
    public static rint(d: double): double {
        return Math.round(d);
    }

    /** Returns the closest long to the argument, with ties rounding to positive infinity. */
    public static round(d: double): long;
    /** Returns the closest int to the argument, with ties rounding to positive infinity. */
    public static round(f: float): int;
    public static round(a: number): int | long {
        return Math.round(a);
    }

    /**
     * Returns d × 2^scaleFactor rounded as if performed by a single correctly rounded floating-point multiply to a
     * member of the double value set.
     */
    public static scalb(d: double, scaleFactor: int): double;
    /**
     * Returns f × 2^scaleFactor rounded as if performed by a single correctly rounded floating-point multiply to a
     * member of the float value set.
     */
    public static scalb(f: float, scaleFactor: int): float;
    public static scalb(a: number, scaleFactor: int): number {
        return Math.round(a * Math.pow(2, scaleFactor));
    }

    /**
     * Returns the signum function of the argument; zero if the argument is zero, 1.0 if the argument is greater than
     * zero, -1.0 if the argument is less than zero.
     */
    public static signum(d: double): double;
    /**
     * Returns the signum function of the argument; zero if the argument is zero, 1.0 if the argument is greater than
     * zero, -1.0 if the argument is less than zero.
     */
    public static signum(f: float): float;
    public static signum(a: number): number {
        return Math.sign(a);
    }

    /**
     * @param d the value whose sine is to be returned.
     *
     * @returns the trigonometric sine of an angle.
     */
    public static sin(d: double): double {
        return Math.sin(d);
    }

    /**
     * @param d the value whose hyperbolic sine is to be returned.
     *
     * @returns the hyperbolic sine of a double value.
     */
    public static sinh(d: double): double {
        return Math.sinh(d);
    }

    /**
     * @param d a value
     *
     * @returns the correctly rounded positive square root of a double value.
     */
    public static sqrt(d: double): double {
        return Math.sqrt(d);
    }

    /** Returns the difference of the arguments, throwing an exception if the result overflows an int. */
    public static subtractExact(a: int, b: int): int;
    /** Returns the difference of the arguments, throwing an exception if the result overflows a long. */
    public static subtractExact(a: long, b: long): long;
    public static subtractExact(...args: unknown[]): int | long {
        if (args.length === 2) {
            if (typeof args[0] === "number") {
                const [a, b] = args as [int, int];
                const result = a - b;
                this.checkIntOverflow(result);

                return result;
            } else {
                const [a, b] = args as [long, long];
                const result = a - b;
                if (a > 0 && b < 0 && result < 0) {
                    throw new ArithmeticException("long overflow");
                } else if (a < 0 && b > 0 && result > 0) {
                    throw new ArithmeticException("long overflow");
                }

                return result;
            }
        } else {
            throw new IllegalArgumentException("Wrong number of arguments");
        }
    }

    /**
     * @param d the value whose tangent is to be returned.
     *
     * @returns the trigonometric tangent of an angle.
     */
    public static tan(d: double): double {
        return Math.tan(d);
    }

    /**
     * @param d the value whose hyperbolic tangent is to be returned.
     *
     * @returns the hyperbolic tangent of a double value.
     */
    public static tanh(d: double): double {
        return Math.tanh(d);
    }

    /**
     * Converts an angle measured in radians to an approximately equivalent angle measured in degrees.
     *
     * @param d an angle, in radians
     *
     * @returns the measurement of the angle d in degrees.
     */
    public static toDegrees(d: double): double {
        return d * 180 / Math.PI;
    }

    /**
     * @param a the value to be converted to an int.
     *
     * @returns the value of the specified number as an int, which may involve rounding or truncation.
     */
    public static toIntExact(a: long): int {
        if (a > Number.MAX_SAFE_INTEGER || a < Number.MIN_SAFE_INTEGER) {
            throw new ArithmeticException("integer overflow");
        }

        return Number(BigInt.asIntN(32, a));
    }

    /**
     * Converts an angle measured in degrees to an approximately equivalent angle measured in radians.
     *
     * @param d an angle, in degrees
     *
     * @returns the measurement of the angle d in radians.
     */
    public static toRadians(d: double): double {
        return d * Math.PI / 180;
    }

    /** Returns the size of an ulp of the argument. */
    public static ulp(d: double): double;
    /** Returns the size of an ulp of the argument. */
    public static ulp(a: float): float;
    public static ulp(a: number): number {
        if (a === Number.POSITIVE_INFINITY || a === Number.NEGATIVE_INFINITY) {
            return Number.POSITIVE_INFINITY;
        } else if (isNaN(a)) {
            return Number.NaN;
        } else if (a === Number.MAX_VALUE) {
            return Math.pow(2, 971);
        } else if (a === Number.MIN_VALUE) {
            return Math.pow(2, -1074);
        } else if (a === 0) {
            return Math.pow(2, -1074);
        } else if (a === -0) {
            return Math.pow(2, -1074);
        } else if (a < 0) {
            return Math.pow(2, Math.floor(Math.log(a) / Math.LN2));
        } else {
            return Math.pow(2, Math.floor(Math.log(a) / Math.LN2));
        }
    }

    /**
     * Helper method to check if a number is a valid integer.
     *
     * @param a the number to check
     *
     * @throws ArithmeticException if the number is not a valid integer
     */
    private static checkIntOverflow(a: int): void {
        if (isNaN(a) || a > Number.MAX_SAFE_INTEGER || a < Number.MIN_SAFE_INTEGER) {
            throw new ArithmeticException("integer overflow");
        }
    }
}
