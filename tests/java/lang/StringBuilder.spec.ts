/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { IndexOutOfBoundsException } from "../../../src/java/lang/IndexOutOfBoundsException.js";
import { Integer } from "../../../src/java/lang/Integer.js";
import { NegativeArraySizeException } from "../../../src/java/lang/NegativeArraySizeException.js";
import { JavaString } from "../../../src/java/lang/String.js";
import { StringBuilder } from "../../../src/java/lang/StringBuilder.js";

describe("Tests", () => {
    it("Construction", () => {
        expect(new StringBuilder().length() === 0);
        expect(() => { new StringBuilder(-10); }).toThrow(NegativeArraySizeException);
        expect(new StringBuilder(100).capacity() === 100);

        const s = new JavaString("Lorem Ipsum");
        const b = new StringBuilder(s);
        expect(b.capacity()).toBe(s.length());
        expect(`${b.toString()}`).toEqual("Lorem Ipsum");
    });

    it("Appending content", () => {
        const b = new StringBuilder();
        b.append("Lorem Ipsum Dolor Sit Amet"); // TS string
        expect(`${b.toString()}`).toBe("Lorem Ipsum Dolor Sit Amet");

        const s = new JavaString("Another string");
        const b2 = new StringBuilder("String Builder");
        const i = new Integer(456);

        expect(b.append("-")).toBe(b);
        b.append(s);    // Java string
        b.append("-");
        b.append(true); // boolean
        b.append("-");
        b.append(123);  // TS number

        b.append("-");
        b.append(b2);   // Other StringBuilder
        b.append("-");
        b.append(b2.array()); // Int16Array
        b.append("-");
        b.append(i);   // JavaObject

        expect(`${b.toString()}`).toBe("Lorem Ipsum Dolor Sit Amet-Another string-true-123-String Builder-String " +
            "Builder-456");

        b.clear();
        b.append("TRIPLE INTEGRAL = ");
        b.appendCodePoint(0x222D); // BMP code point.
        expect(`${b.toString()}`).toBe("TRIPLE INTEGRAL = ∭");

        b.appendCodePoint(0x1F600); // Extended code point (internally held as surrogate pair).
        expect(`${b.toString()}`).toBe("TRIPLE INTEGRAL = ∭😀");
    });

    it("Inserting content", () => {
        const b = new StringBuilder();
        b.append("12345");

        const s = new JavaString("Another string");
        const b2 = new StringBuilder("String Builder");
        b2.ensureCapacity(1000);

        const i = new Integer(456);

        expect(b.insert(4, "-")).toBe(b);
        expect(`${b.toString()}`).toBe("1234-5");
        b.insert(4, s);    // Java string
        expect(`${b.toString()}`).toBe("1234Another string-5");

        b.insert(3, "-");
        expect(`${b.toString()}`).toBe("123-4Another string-5");
        b.insert(3, true); // boolean
        expect(`${b.toString()}`).toBe("123true-4Another string-5");

        b.insert(2, "\n");
        b.insert(2, 123);  // TS number
        b.insert(2, "");
        expect(`${b.toString()}`).toBe("12123\n3true-4Another string-5");

        b.insert(1, "-");
        b.insert(1, b2);   // Other StringBuilder
        expect(`${b.toString()}`).toBe("1String Builder-2123\n3true-4Another string-5");

        b.insert(0, "-");
        b.insert(0, b2.array()); // Int16Array
        expect(`${b.toString()}`).toBe("String Builder-1String Builder-2123\n3true-4Another string-5");

        b.ensureCapacity(10000);
        b.insert(b.length(), "-");
        b.insert(b.length(), i);   // JavaObject

        expect(`${b.toString()}`).toBe("String Builder-1String Builder-2123\n3true-4Another string-5-456");
    });

    it("Delete content", () => {
        const b0 = new StringBuilder("1234");
        b0.deleteCharAt(0);
        expect(`${b0.toString()}`).toBe("234");

        const b1 = new StringBuilder("1234");
        b1.deleteCharAt(1);
        expect(`${b1.toString()}`).toBe("134");

        const b2 = new StringBuilder("1234");
        b2.deleteCharAt(2);
        expect(`${b2.toString()}`).toBe("124");

        const b3 = new StringBuilder("1234");
        b3.deleteCharAt(3);
        expect(`${b3.toString()}`).toBe("123");

        try {
            const b4 = new StringBuilder("1234");
            b4.deleteCharAt(4);
        } catch (e) {
            expect(e).toBeInstanceOf(IndexOutOfBoundsException);
        }
    });
});
