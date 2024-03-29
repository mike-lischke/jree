/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Long } from "../../../src/java/lang/Long.js";
import { NumberFormatException } from "../../../src/java/lang/NumberFormatException.js";
import { S } from "../../../src/templates.js";

describe("Long Tests", () => {
    it("Base", () => {
        const i = new Long(0);
        expect(i.equals(new Long(0))).toBe(true);
        expect(i.equals(new Long("0"))).toBe(true);
        expect(i.equals(new Long(1))).toBe(false);

        expect(Long.MAX_VALUE).toBe(9223372036854775807n);
        expect(Long.MIN_VALUE).toBe(-9223372036854775808n);

        expect(() => { new Long(1.2); }).toThrow();
    });

    it("bitCount", () => {
        expect(Long.bitCount(0n)).toBe(0);
        expect(Long.bitCount(-1n)).toBe(64);
        expect(Long.bitCount(6n)).toBe(2);
        expect(Long.bitCount(1025n)).toBe(2);
    });

    it("compare", () => {
        expect(Long.compare(1n, 1n)).toBe(0);
        expect(Long.compare(1n, 2n)).toBeLessThan(0);
        expect(Long.compare(10000000000n, 2n)).toBeGreaterThan(0);
    });

    it("decode", () => {
        expect(() => { Long.decode(S``); }).toThrow();
        expect(() => { Long.decode(S` .  \n`); }).toThrow();

        expect(() => { Long.decode(S`abc`); }).toThrow();

        expect(Long.decode(S`0`).intValue()).toBe(0);
        expect(Long.decode(S`00000`).intValue()).toBe(0);
        expect(Long.decode(S`123`).intValue()).toBe(123);
        expect(Long.decode(S`0123`).intValue()).toBe(83);
        expect(Long.decode(S`0x123`).intValue()).toBe(291);

        expect(Long.decode(S`-0`).intValue()).toBe(0);
        expect(Long.decode(S`-00000`).intValue()).toBe(0);
        expect(Long.decode(S`-123`).intValue()).toBe(-123);
        expect(Long.decode(S`-0123`).intValue()).toBe(-83);
        expect(Long.decode(S`-0x123`).intValue()).toBe(-291);
    });

    it("getLong", (done) => {
        setImmediate(() => {
            // Need to delay execution one run loop, as system properties loading is delayed as well.
            expect(Long.getLong(S``)).toBeNull();
            expect(Long.getLong(S`Lorem Ipsum`)).toBeNull();
            expect(Long.getLong(S`Lorem Ipsum`, 11)?.intValue()).toBe(11);
            expect(Long.getLong(S`java.version`, 17)?.intValue()).toBe(11);
            expect(Long.getLong(S`java. version`, 17)?.intValue()).toBe(17);

            done();
        });
    });

    it("reverse", () => {
        expect(Long.reverse(0n)).toBe(0n);
        expect(Long.reverse(86n)).toBe(7638104968020361216n);
        expect(Long.reverse(0x1n)).toBe(0x8000000000000000n);
        expect(Long.reverse(0x7000000000000000n)).toBe(14n);
        expect(Long.reverse(-2n)).toBe(9223372036854775807n);
        expect(Long.reverse(0x34343434n)).toBe(0x2C2C2C2C00000000n);
    });

    it("numberOfLeadingZeros", () => {
        expect(Long.numberOfLeadingZeros(0n)).toBe(64);
        expect(Long.numberOfLeadingZeros(86n)).toBe(57);
        expect(Long.numberOfLeadingZeros(-10n)).toBe(0);
        expect(Long.numberOfLeadingZeros(0x7FFFFFFFFFFFFFFFn)).toBe(1);
    });

    it("numberOfTrailingZeros", () => {
        expect(Long.numberOfTrailingZeros(0n)).toBe(64);
        expect(Long.numberOfTrailingZeros(-10n)).toBe(1);
        expect(Long.numberOfTrailingZeros(0x7FFFFFF0n)).toBe(4);
        expect(Long.numberOfTrailingZeros(0x8888n)).toBe(3);
        expect(Long.numberOfTrailingZeros(0x56n)).toBe(1);

        expect(Long.numberOfTrailingZeros(0x4n)).toBe(2);
        expect(Long.numberOfTrailingZeros(0x40n)).toBe(6);
        expect(Long.numberOfTrailingZeros(0x400n)).toBe(10);
        expect(Long.numberOfTrailingZeros(0x4000n)).toBe(14);
        expect(Long.numberOfTrailingZeros(0x40000n)).toBe(18);
    });

    it("highestOneBit", () => {
        expect(Long.highestOneBit(0n)).toBe(0n);
        expect(Long.highestOneBit(86n)).toBe(64n);
        expect(Long.highestOneBit(-1n)).toBe(9223372036854775808n);
        expect(Long.highestOneBit(-1n)).toBe(0x8000000000000000n);
        expect(Long.highestOneBit(16532164n)).toBe(8388608n);
    });

    it("lowestOneBit", () => {
        expect(Long.lowestOneBit(0n)).toBe(0n);
        expect(Long.lowestOneBit(86n)).toBe(2n);
        expect(Long.lowestOneBit(-1n)).toBe(1n);
        expect(Long.lowestOneBit(16532164n)).toBe(4n);
    });

    it("reverseBytes", () => {
        expect(Long.reverseBytes(0n)).toBe(0n);
        expect(Long.reverseBytes(86n)).toBe(6196953087261802496n);
        expect(Long.reverseBytes(0x1n)).toBe(72057594037927936n);

        // Specifying signed integers in hex format is sometimes tricky. Keep in mind these numbers are stored
        // in two's complement.
        expect(Long.reverseBytes(0x70000000n)).toBe(0x7000000000n);
        expect(Long.reverseBytes(-2n)).toBe(0xFEFFFFFFFFFFFFFFn);
        expect(Long.reverseBytes(0x34343434n)).toBe(0x3434343400000000n);
    });

    it("rotateLeft", () => {
        expect(Long.rotateLeft(0n, 0)).toBe(0n);
        expect(Long.rotateLeft(86n, 0)).toBe(86n);
        expect(Long.rotateLeft(86n, -2)).toBe(9223372036854775829n);
        expect(Long.rotateLeft(86n, 10)).toBe(88064n);
        expect(Long.rotateLeft(86n, 30)).toBe(92341796864n);
        expect(Long.rotateLeft(86n, 100)).toBe(5909874999296n);
    });

    it("rotateRight", () => {
        expect(Long.rotateRight(0n, 0)).toBe(0n);
        expect(Long.rotateRight(86n, 0)).toBe(86n);
        expect(Long.rotateRight(86n, -2)).toBe(344n);
        expect(Long.rotateRight(86n, 10)).toBe(1549238271815450624n);
        expect(Long.rotateRight(86n, 30)).toBe(1477468749824n);
        expect(Long.rotateRight(86n, 100)).toBe(23085449216n);
    });

    it("signum", () => {
        expect(() => { Long.signum(BigInt(NaN)); }).toThrow(RangeError);
        expect(Long.signum(0n)).toBe(0);
        expect(Long.signum(-123n)).toBe(-1);
        expect(Long.signum(86n)).toBe(1);
        expect(Long.signum(BigInt(Number.MIN_SAFE_INTEGER))).toBe(-1);
        expect(Long.signum(BigInt(Number.MAX_SAFE_INTEGER))).toBe(1);
    });

    it("To string", () => {
        expect(() => { Long.toString(BigInt(NaN), 3); }).toThrow();

        expect(`${Long.toString(1234n)}`).toBe("1234");
        expect(`${Long.toString(77n)}`).toBe("77");
        expect(`${Long.toString(77n, 2)}`).toBe("1001101");
        expect(`${Long.toString(77n, 3)}`).toBe("2212");
        expect(`${Long.toString(77n, 8)}`).toBe("115");
        expect(`${Long.toString(77n, 16)}`).toBe("4d");

        expect(`${Long.toBinaryString(77n)}`).toBe("1001101");
        expect(`${Long.toOctalString(77n)}`).toBe("115");
        expect(`${Long.toHexString(77n)}`).toBe("4d");

        const i = new Long(77n);
        expect(`${i.toString()}`).toBe("77");
    });

    it("Parsing numbers", () => {
        let i = Long.valueOf(88n);
        expect(i).toBeInstanceOf(Long);
        expect(i.intValue()).toBe(88);

        i = Long.valueOf("88");
        expect(i).toBeInstanceOf(Long);
        expect(i.intValue()).toBe(88);

        i = Long.valueOf("88", 10);
        expect(i).toBeInstanceOf(Long);
        expect(i.intValue()).toBe(88);

        expect(() => { Long.valueOf("88", 2); }).toThrow();
        i = Long.valueOf("12332", 5);
        expect(i).toBeInstanceOf(Long);
        expect(i.intValue()).toBe(967);

        expect(Long.parseLong("88").longValue()).toBe(88n);
        expect(Long.parseLong("0", 10).longValue()).toBe(0n);
        expect(Long.parseLong("473", 10).longValue()).toBe(473n);
        expect(Long.parseLong("+42", 10).longValue()).toBe(42n);
        expect(Long.parseLong("-0", 10).longValue()).toBe(0n);
        expect(Long.parseLong("-FF", 16).longValue()).toBe(-255n);
        expect(Long.parseLong("1100110", 2).longValue()).toBe(102n);
        expect(Long.parseLong("2147483647", 10).longValue()).toBe(2147483647n);
        expect(Long.parseLong("-2147483648", 10).longValue()).toBe(-2147483648n);

        const n = (Long.MAX_VALUE + 1n).toString();
        expect(() => { Long.parseLong(n, 10); }).toThrow(NumberFormatException);
        expect(() => { Long.parseLong("99", 8); }).toThrow(NumberFormatException);
        expect(() => { Long.parseLong("Kona", 10); }).toThrow(NumberFormatException);
        expect(Long.parseLong("Kona", 27).longValue()).toBe(411787n);
    });

    it("Miscellaneous", () => {
        expect(new Long(88).byteValue()).toBe(88);
        expect(new Long(8888).byteValue()).toBe(-72);
        expect(new Long(-88).byteValue()).toBe(-88);
        expect(new Long(-8888).byteValue()).toBe(72);

        expect(new Long(88).shortValue()).toBe(88);
        expect(new Long(8888).shortValue()).toBe(8888);
        expect(new Long(-88).shortValue()).toBe(-88);
        expect(new Long(-8888).shortValue()).toBe(-8888);

        expect(new Long(88).intValue()).toBe(88);
        expect(new Long(8888).intValue()).toBe(8888);
        expect(new Long(-88).intValue()).toBe(-88);
        expect(new Long(-8888).intValue()).toBe(-8888);

        expect(new Long(88).longValue()).toBe(88n);
        expect(new Long(8888).longValue()).toBe(8888n);
        expect(new Long(-88).longValue()).toBe(-88n);
        expect(new Long(-8888).longValue()).toBe(-8888n);

        expect(new Long(88).floatValue()).toBe(88);
        expect(new Long(8888).floatValue()).toBe(8888);
        expect(new Long(-88).floatValue()).toBe(-88);
        expect(new Long(-8888).floatValue()).toBe(-8888);

        expect(new Long(88).doubleValue()).toBe(88);
        expect(new Long(8888).doubleValue()).toBe(8888);
        expect(new Long(-88).doubleValue()).toBe(-88);
        expect(new Long(-8888).doubleValue()).toBe(-8888);

        const i1 = new Long(123);
        const i2 = new Long(123);
        const i3 = new Long(-123);

        expect(i1.compareTo(i2)).toBe(0);
        expect(i1.compareTo(i3)).toBeGreaterThan(0);
        expect(i1.compareTo(i1)).toBe(0);
        expect(i3.compareTo(i2)).toBeLessThan(0);
        expect(i2.compareTo(i3)).toBeGreaterThan(0);

        const c = i1.getClass();
        expect(c.isInstance(i2)).toBe(true);
        expect(c.getName()).toBe("Long");

        // Unboxing/explicit coercion.
        // @ts-ignore
        expect(3n - i1).toBe(-120n);
        expect("3" + String(i1)).toBe("3123");
    });
});
