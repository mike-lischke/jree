/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { HashMapEntry } from "../../../src/java/util/HashMapEntry.js";

describe("HashMapEntry Tests", () => {
    it("Key/value", () => {
        const entry = new HashMapEntry("abc", true);

        expect(entry.getKey()).toBe("abc");
        expect(entry.getValue()).toBe(true);
        expect(entry.hashCode()).toBe(1176770320);

        entry.setValue(false);
        expect(entry.getValue()).toBe(false);
        expect(entry.hashCode()).toBe(-138013709);

        const entry2 = new HashMapEntry<number, string>(17, "");
        expect(entry2.getKey()).toBe(17);
        expect(entry2.getValue()).toBe("");
        expect(entry2.hashCode()).toBe(-596637667);

        const entry3 = new HashMapEntry<number, string>(-1, "def");
        expect(entry3.getKey()).toBe(-1);
        expect(entry3.getValue()).toBe("def");
        expect(entry3.hashCode()).toBe(-425202676);
    });

    it("Equality", () => {
        const entry0 = new HashMapEntry("abc", true);

        expect(entry0.equals("abc")).toBe(false);
        expect(entry0.equals({ a: "abc" })).toBe(false);

        expect(entry0.equals(new HashMapEntry("abc", false))).toBe(false);
        expect(entry0.equals(new HashMapEntry("abc", true))).toBe(true);

        const key = {
            equals: (_other: unknown) => { return false; },
            hashCode: () => { return 31; },
        };
        const value1 = {
            a: "a",
            equals: (_other: unknown) => { return false; },
            hashCode: () => { return 13; },
        };
        const value2 = { // Same as value1, because of same hash.
            b: "b",
            equals: (_other: unknown) => { return false; },
            hashCode: () => { return 13; },
        };
        const value3 = { // Different to value1, because of different hash.
            a: "a",
            equals: (_other: unknown) => { return false; },
            hashCode: () => { return 17; },
        };

        const entry1 = new HashMapEntry(key, value1);
        const entry2 = new HashMapEntry(key, value2);
        const entry3 = new HashMapEntry(key, value3);

        expect(entry1.equals(entry2)).toBe(true);
        expect(entry1.equals(entry3)).toBe(false);
    });

    it("Null Equality", () => {
        const entry1 = new HashMapEntry(123, 456);

        expect(entry1.equals(new HashMapEntry(123, null))).toBe(false);
        expect(entry1.equals(new HashMapEntry(null, 456))).toBe(false);

        const entry2 = new HashMapEntry(null, 456);

        expect(entry2.equals(new HashMapEntry(123, null))).toBe(false);
        expect(entry2.equals(new HashMapEntry(null, 456))).toBe(true);

        const entry3 = new HashMapEntry(123, null);

        expect(entry3.equals(new HashMapEntry(123, null))).toBe(true);
        expect(entry3.equals(new HashMapEntry(null, 456))).toBe(false);
    });
});
