/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Integer } from "../../../src/java/lang/Integer.js";
import { NumberFormatException } from "../../../src/java/lang/NumberFormatException.js";
import { S } from "../../../src/templates.js";

describe("Integer Tests", () => {
    it("Base", () => {
        const i = new Integer(0);
        expect(i.equals(new Integer(0))).toBe(true);
        expect(i.equals(new Integer(S`0`))).toBe(true);
        expect(i.equals(new Integer(1))).toBe(false);

        expect(Integer.MAX_VALUE).toBe(2147483647);
        expect(Integer.MIN_VALUE).toBe(-2147483648);

        expect(() => { new Integer(1.2); }).toThrow();
    });

    it("bitCount", () => {
        expect(Integer.bitCount(0)).toBe(0);
        expect(Integer.bitCount(-1)).toBe(32);
        expect(Integer.bitCount(6)).toBe(2);
        expect(Integer.bitCount(1025)).toBe(2);

        expect(() => { Integer.bitCount(1.2); }).toThrow();
    });

    it("compare", () => {
        expect(Integer.compare(1, 1)).toBe(0);
        expect(Integer.compare(1, 2)).toBeLessThan(0);
        expect(Integer.compare(1e10, 2)).toBeGreaterThan(0);
        expect(() => { Integer.compare(1.2, 1); }).toThrow();
        expect(() => { Integer.compare(1, 1.10); }).toThrow();
        expect(() => { Integer.compare(1.2, 1.5); }).toThrow();
    });

    it("decode", () => {
        expect(() => { Integer.decode(S``); }).toThrow();
        expect(() => { Integer.decode(S` .  \n`); }).toThrow();

        expect(() => { Integer.decode(S`abc`); }).toThrow();

        expect(Integer.decode(S`0`).intValue()).toBe(0);
        expect(Integer.decode(S`00000`).intValue()).toBe(0);
        expect(Integer.decode(S`123`).intValue()).toBe(123);
        expect(Integer.decode(S`0123`).intValue()).toBe(83);
        expect(Integer.decode(S`0x123`).intValue()).toBe(291);

        expect(Integer.decode(S`-0`).intValue()).toBe(-0);
        expect(Integer.decode(S`-00000`).intValue()).toBe(-0);
        expect(Integer.decode(S`-123`).intValue()).toBe(-123);
        expect(Integer.decode(S`-0123`).intValue()).toBe(-83);
        expect(Integer.decode(S`-0x123`).intValue()).toBe(-291);
    });

    it("getInteger", (done) => {
        setImmediate(() => {
            // Need to delay execution one run loop, as system properties loading is delayed as well.
            expect(Integer.getInteger(S``)).toBeNull();
            expect(Integer.getInteger(S`Lorem Ipsum`)).toBeNull();
            expect(Integer.getInteger(S`Lorem Ipsum`, 11)?.intValue()).toBe(11);
            expect(Integer.getInteger(S`java.version`, 17)?.intValue()).toBe(11);
            expect(Integer.getInteger(S`java. version`, 17)?.intValue()).toBe(17);

            done();
        });
    });

    it("reverse", () => {
        expect(() => { Integer.reverse(123.456); }).toThrow();

        expect(Integer.reverse(0)).toBe(0);
        expect(Integer.reverse(86)).toBe(1778384896);
        expect(Integer.reverse(0x1)).toBe(-2147483648);
        expect(Integer.reverse(0x70000000)).toBe(14);
        expect(Integer.reverse(-2)).toBe(2147483647);
        expect(Integer.reverse(0x34343434)).toBe(0x2C2C2C2C);
    });

    it("numberOfLeadingZeros", () => {
        expect(() => { Integer.numberOfLeadingZeros(123.456); }).toThrow();

        expect(Integer.numberOfLeadingZeros(0)).toBe(32);
        expect(Integer.numberOfLeadingZeros(-10)).toBe(0);
        expect(Integer.numberOfLeadingZeros(0x7FFFFFFF)).toBe(1);
    });

    it("numberOfTrailingZeros", () => {
        expect(() => { Integer.numberOfTrailingZeros(123.456); }).toThrow();

        expect(Integer.numberOfTrailingZeros(0)).toBe(32);
        expect(Integer.numberOfTrailingZeros(-10)).toBe(1);
        expect(Integer.numberOfTrailingZeros(0x7FFFFFF0)).toBe(4);
        expect(Integer.numberOfTrailingZeros(0x8888)).toBe(3);
        expect(Integer.numberOfTrailingZeros(0x56)).toBe(1);

        expect(Integer.numberOfTrailingZeros(0x4)).toBe(2);
        expect(Integer.numberOfTrailingZeros(0x40)).toBe(6);
        expect(Integer.numberOfTrailingZeros(0x400)).toBe(10);
        expect(Integer.numberOfTrailingZeros(0x4000)).toBe(14);
        expect(Integer.numberOfTrailingZeros(0x40000)).toBe(18);
    });

    it("highestOneBit", () => {
        expect(() => { Integer.highestOneBit(123.456); }).toThrow();

        expect(Integer.highestOneBit(0)).toBe(0);
        expect(Integer.highestOneBit(86)).toBe(64);
        expect(Integer.highestOneBit(-1)).toBe(-2147483648);
        expect(Integer.highestOneBit(16532164)).toBe(8388608);
    });

    it("lowestOneBit", () => {
        expect(() => { Integer.lowestOneBit(123.456); }).toThrow();

        expect(Integer.lowestOneBit(0)).toBe(0);
        expect(Integer.lowestOneBit(86)).toBe(2);
        expect(Integer.lowestOneBit(-1)).toBe(1);
        expect(Integer.lowestOneBit(16532164)).toBe(4);
    });

    it("reverseBytes", () => {
        expect(() => { Integer.reverseBytes(123.456); }).toThrow();

        expect(Integer.reverseBytes(0)).toBe(0);
        expect(Integer.reverseBytes(86)).toBe(1442840576);
        expect(Integer.reverseBytes(0x1)).toBe(16777216);
        expect(Integer.reverseBytes(0x70000000)).toBe(112);
        expect(Integer.reverseBytes(-2)).toBe(-16777217);
        expect(Integer.reverseBytes(0x34343434)).toBe(0x34343434);
    });

    it("rotateLeft", () => {
        expect(() => { Integer.rotateLeft(123.456, 3); }).toThrow();

        expect(Integer.rotateLeft(0, 0)).toBe(0);
        expect(Integer.rotateLeft(86, 0)).toBe(86);
        expect(Integer.rotateLeft(86, -2)).toBe(-2147483627);
        expect(Integer.rotateLeft(86, 10)).toBe(88064);
        expect(Integer.rotateLeft(86, 30)).toBe(-2147483627);
        expect(Integer.rotateLeft(86, 100)).toBe(1376);
    });

    it("rotateRight", () => {
        expect(() => { Integer.rotateRight(123.456, 3); }).toThrow();

        expect(Integer.rotateRight(0, 0)).toBe(0);
        expect(Integer.rotateRight(86, 0)).toBe(86);
        expect(Integer.rotateRight(86, -2)).toBe(344);
        expect(Integer.rotateRight(86, 10)).toBe(360710144);
        expect(Integer.rotateRight(86, 30)).toBe(344);
        expect(Integer.rotateRight(86, 100)).toBe(1610612741);
    });

    it("signum", () => {
        expect(Integer.signum(NaN)).toBe(0);
        expect(Integer.signum(0)).toBe(0);
        expect(Integer.signum(-123)).toBe(-1);
        expect(Integer.signum(86)).toBe(1);
        expect(Integer.signum(Number.MIN_SAFE_INTEGER)).toBe(-1);
        expect(Integer.signum(Number.MAX_SAFE_INTEGER)).toBe(1);
    });

    it("To string", () => {
        expect(() => { Integer.toString(123.456, 3); }).toThrow();
        expect(() => { Integer.toString(NaN, 3); }).toThrow();

        expect(Integer.toString(1234).valueOf()).toBe("1234");
        expect(Integer.toString(77).valueOf()).toBe("77");
        expect(Integer.toString(77, 2).valueOf()).toBe("1001101");
        expect(Integer.toString(77, 3).valueOf()).toBe("2212");
        expect(Integer.toString(77, 8).valueOf()).toBe("115");
        expect(Integer.toString(77, 16).valueOf()).toBe("4d");

        expect(() => { Integer.toBinaryString(123.456); }).toThrow();
        expect(Integer.toBinaryString(77).valueOf()).toBe("1001101");

        expect(() => { Integer.toOctalString(123.456); }).toThrow();
        expect(Integer.toOctalString(77).valueOf()).toBe("115");

        expect(() => { Integer.toHexString(123.456); }).toThrow();
        expect(Integer.toHexString(77).valueOf()).toBe("4d");

        const i = new Integer(77);
        expect(`${i.toString()}`).toBe("77");
    });

    it("Parsing numbers", () => {
        let i = Integer.valueOf(88);
        expect(i).toBeInstanceOf(Integer);
        expect(i.intValue()).toBe(88);

        i = Integer.valueOf(S`88`);
        expect(i).toBeInstanceOf(Integer);
        expect(i.intValue()).toBe(88);

        i = Integer.valueOf(S`88`, 10);
        expect(i).toBeInstanceOf(Integer);
        expect(i.intValue()).toBe(88);

        expect(() => { Integer.valueOf(S`88`, 2); }).toThrow();
        i = Integer.valueOf(S`12332`, 5);
        expect(i).toBeInstanceOf(Integer);
        expect(i.intValue()).toBe(967);

        expect(Integer.parseInt("88")).toBe(88);
        expect(Integer.parseInt("0", 10)).toBe(0);
        expect(Integer.parseInt("473", 10)).toBe(473);
        expect(Integer.parseInt("+42", 10)).toBe(42);
        expect(Integer.parseInt("-0", 10)).toBe(-0);
        expect(Integer.parseInt("-FF", 16)).toBe(-255);
        expect(Integer.parseInt("1100110", 2)).toBe(102);
        expect(Integer.parseInt("2147483647", 10)).toBe(2147483647);
        expect(Integer.parseInt("-2147483648", 10)).toBe(-2147483648);
        expect(() => { Integer.parseInt("2147483648", 10); }).toThrow(NumberFormatException);
        expect(() => { Integer.parseInt("99", 8); }).toThrow(NumberFormatException);
        expect(() => { Integer.parseInt("Kona", 10); }).toThrow(NumberFormatException);
        expect(Integer.parseInt("Kona", 27)).toBe(411787);
    });

    it("Miscellaneous", () => {
        expect(new Integer(88).byteValue()).toBe(88);
        expect(new Integer(8888).byteValue()).toBe(-72);
        expect(new Integer(-88).byteValue()).toBe(-88);
        expect(new Integer(-8888).byteValue()).toBe(72);

        expect(new Integer(88).shortValue()).toBe(88);
        expect(new Integer(8888).shortValue()).toBe(8888);
        expect(new Integer(-88).shortValue()).toBe(-88);
        expect(new Integer(-8888).shortValue()).toBe(-8888);

        expect(new Integer(88).intValue()).toBe(88);
        expect(new Integer(8888).intValue()).toBe(8888);
        expect(new Integer(-88).intValue()).toBe(-88);
        expect(new Integer(-8888).intValue()).toBe(-8888);

        expect(new Integer(88).longValue()).toBe(88n);
        expect(new Integer(8888).longValue()).toBe(8888n);
        expect(new Integer(-88).longValue()).toBe(-88n);
        expect(new Integer(-8888).longValue()).toBe(-8888n);

        expect(new Integer(88).floatValue()).toBe(88);
        expect(new Integer(8888).floatValue()).toBe(8888);
        expect(new Integer(-88).floatValue()).toBe(-88);
        expect(new Integer(-8888).floatValue()).toBe(-8888);

        expect(new Integer(88).doubleValue()).toBe(88);
        expect(new Integer(8888).doubleValue()).toBe(8888);
        expect(new Integer(-88).doubleValue()).toBe(-88);
        expect(new Integer(-8888).doubleValue()).toBe(-8888);

        const i1 = new Integer(123);
        const i2 = new Integer(123);
        const i3 = new Integer(-123);

        expect(i1.compareTo(i2)).toBe(0);
        expect(i1.compareTo(i3)).toBeGreaterThan(0);
        expect(i1.compareTo(i1)).toBe(0);
        expect(i3.compareTo(i2)).toBeLessThan(0);
        expect(i2.compareTo(i3)).toBeGreaterThan(0);

        const c = i1.getClass();
        expect(c.isInstance(i2)).toBe(true);
        expect(c.getName()).toBe("Integer");

        // Unboxing/explicit coercion.
        expect(3 - +i1).toBe(-120);
        expect("3" + String(i1)).toBe("3123");
    });
});
