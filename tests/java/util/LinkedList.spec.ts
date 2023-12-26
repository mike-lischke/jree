/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { IllegalArgumentException } from "../../../src/java/lang/IllegalArgumentException.js";
import { IndexOutOfBoundsException } from "../../../src/java/lang/IndexOutOfBoundsException.js";
import { JavaString } from "../../../src/java/lang/String.js";
import { ArrayList } from "../../../src/java/util/ArrayList.js";
import { HashSet } from "../../../src/java/util/HashSet.js";
import { LinkedList } from "../../../src/java/util/LinkedList.js";
import { NoSuchElementException } from "../../../src/java/util/NoSuchElementException.js";
import { S } from "../../../src/templates.js";

describe("LinkedList Tests", () => {
    it("Basic Empty List Tests", () => {
        const list = new LinkedList<number>();
        expect(list.isEmpty()).toBe(true);
        expect(list.size()).toBe(0);

        expect(() => { list.element(); }).toThrow(NoSuchElementException);
        expect(() => { list.get(1000); }).toThrow(IndexOutOfBoundsException);
        expect(() => { list.getFirst(); }).toThrow(NoSuchElementException);
        expect(() => { list.getLast(); }).toThrow(NoSuchElementException);

        expect(list.indexOf(10)).toBe(-1);
        expect(list.lastIndexOf(1e6)).toBe(-1);

        expect(list.peekFirst()).toBeNull();
        expect(list.peekLast()).toBeNull();

        expect(() => { list.poll(); }).toThrow(NoSuchElementException);
        expect(list.pollFirst()).toBeNull();
        expect(list.pollLast()).toBeNull();

        expect(() => { list.remove(); }).toThrow(IndexOutOfBoundsException);
        expect(() => { list.remove(-10); }).toThrow(IndexOutOfBoundsException);
        expect(() => { list.remove(0); }).toThrow(IndexOutOfBoundsException);

        expect(() => { list.removeFirst(); }).toThrow(NoSuchElementException);
        list.add(100);
        expect(list.removeFirstOccurrence(123456)).toBe(false);
        expect(() => { list.removeLast(); }).not.toThrow(NoSuchElementException);
        expect(() => { list.removeLast(); }).toThrow(NoSuchElementException);
        list.add(100);
        expect(list.removeLastOccurrence(0x33)).toBe(false);
        expect(list.removeLastOccurrence(100)).toBe(true);

        expect(() => { list.set(10, 0b11); }).toThrow(IndexOutOfBoundsException);

        expect(list.toArray()).toEqual([]);
        expect(list.toArray(new Array<number>(10))).toEqual([
            null, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
        ]);

        expect([...list]).toEqual([]);

        const values = new ArrayList([1, 2, 3]);
        expect(list.removeAll(values)).toEqual(false);
        expect(list.retainAll(values)).toEqual(false);

        expect(() => { list.subList(10, 100); }).toThrow(IndexOutOfBoundsException);
        list.addAll(values);
        list.addAll(values);
        list.addAll(values);
        expect(() => { list.subList(9, 4); }).toThrow(IllegalArgumentException);
        expect(list.subList(4, 9).size()).toEqual(5);
    });

    it("List Modification Tests", () => {
        const list = new LinkedList<JavaString>();
        expect(list.add(S`Lorem`)).toBe(true);
        list.add(S`Ipsum`);
        list.add(S`Dolor`);
        list.add(S`Sit`);
        expect(list.isEmpty()).toBe(false);
        expect(list.size()).toBe(4);

        expect(() => { list.add(5, S`Amet`); }).toThrow(IndexOutOfBoundsException);

        list.add(1, S`Amet`);
        expect(list.size()).toBe(5);
        expect(list.toArray().join(" ")).toBe("Lorem Amet Ipsum Dolor Sit");
        list.set(2, S``);
        expect(list.toArray().join(" ")).toBe("Lorem Amet  Dolor Sit");

        expect(list.containsAll(new ArrayList([S`A`, S`B`]))).toBe(false);
        const values = new ArrayList([S`Dolor`]);
        expect(list.containsAll(values)).toBe(true);
        expect(list.removeAll(values)).toBe(true);
        expect(list.toArray().join(" ")).toBe("Lorem Amet  Sit");

        values.add(S`Zulu`);
        expect(list.containsAll(values)).toBe(false);

        values.add(S`Sit`);
        expect(list.retainAll(values)).toBe(true);
        expect(list.toArray()).toEqual([S`Sit`]);

        const set = new HashSet<JavaString>(new ArrayList([S`Alpha`, S`Beta`]));
        list.addAll(set);
        expect(list.toArray()).toEqual([S`Sit`, S`Alpha`, S`Beta`]);
        expect(() => { list.addAll(-1, set); }).toThrow(IndexOutOfBoundsException);
        expect(() => { list.addAll(100, set); }).toThrow(IndexOutOfBoundsException);

        list.addAll(2, set);
        expect(list.toArray()).toEqual([S`Sit`, S`Alpha`, S`Alpha`, S`Beta`]);
        list.addFirst(S`Zulu`);
        expect(list.toArray()).toEqual([S`Zulu`, S`Sit`, S`Alpha`, S`Alpha`, S`Beta`]);
        list.addLast(S`Zulu`);
        expect(list.toArray()).toEqual([S`Zulu`, S`Sit`, S`Alpha`, S`Alpha`, S`Beta`, S`Zulu`]);
        list.pop();
        list.pop();
        list.pop();
        expect(list.toArray()).toEqual([S`Alpha`, S`Beta`, S`Zulu`]);
        list.push(S`Lorem Ipsum`);
        expect(list.toArray()).toEqual([S`Lorem Ipsum`, S`Alpha`, S`Beta`, S`Zulu`]);

        list.remove();
        expect(list.toArray()).toEqual([S`Alpha`, S`Beta`, S`Zulu`]);

        expect(() => { list.remove(100); }).toThrow(IndexOutOfBoundsException);
        expect(list.toArray()).toEqual([S`Alpha`, S`Beta`, S`Zulu`]);
        expect(list.remove(1)).toBeDefined();
        expect(list.remove(1)).toBeDefined();
        expect(list.toArray()).toEqual([S`Alpha`]);
        expect(list.remove(S`Lorem`)).toBe(false);
        expect(list.remove(S`Alpha`)).toBe(true);
        expect(list.toArray()).toEqual([]);

        list.addAll(set);
        list.addAll(set);
        expect(list.toArray()).toEqual([S`Alpha`, S`Beta`, S`Alpha`, S`Beta`]);
        expect(list.removeFirstOccurrence(S`Beta`)).toBe(true);
        expect(list.removeFirstOccurrence(S`Lorem`)).toBe(false);
        expect(list.toArray()).toEqual([S`Alpha`, S`Alpha`, S`Beta`]);
        list.addAll(set);
        expect(list.removeLastOccurrence(S`Lorem`)).toBe(false);
        expect(list.removeLastOccurrence(S`Alpha`)).toBe(true);
        expect(list.toArray()).toEqual([S`Alpha`, S`Alpha`, S`Beta`, S`Beta`]);

        list.clear();
        expect(list.isEmpty()).toBe(true);

        expect(list.offer(S`Gamma`)).toBe(true);
        expect(list.offer(S`Delta`)).toBe(true);
        expect(list.toArray()).toEqual([S`Gamma`, S`Delta`]);

        expect(list.offerFirst(S`Epsilon`)).toBe(true);
        expect(list.offerFirst(S`Zeta`)).toBe(true);
        expect(list.toArray()).toEqual([S`Zeta`, S`Epsilon`, S`Gamma`, S`Delta`]);

        expect(list.offerLast(S`Eta`)).toBe(true);
        expect(list.toArray()).toEqual([S`Zeta`, S`Epsilon`, S`Gamma`, S`Delta`, S`Eta`]);
        expect(list.peek().valueOf()).toEqual("Zeta");

        expect(list.poll().valueOf()).toEqual("Zeta");
        expect(list.toArray()).toEqual([S`Epsilon`, S`Gamma`, S`Delta`, S`Eta`]);

        list.poll();
        list.poll();
        list.poll();
        expect(list.poll()).not.toBeNull();
        expect(() => { list.poll(); }).toThrow(NoSuchElementException);
        expect(list.pollFirst()).toBeNull();
    });

    it("List Misc Tests", () => {
        const collection = new ArrayList<number>([1, 3, 5, 7, 9, 11]);
        const list = new LinkedList<number>(collection);
        const hash1 = list.hashCode();
        list.add(-1);
        expect(hash1).not.toEqual(list.hashCode());

        expect(list.removeLast()).toBe(-1);
        expect(hash1).toEqual(list.hashCode());

        const list2 = list.clone();
        expect(list).not.toBe(list2); // Different objects.
        expect(list.equals(list2)).toBe(true); // Same entries.
        expect(list.equals(list)).toBe(true); // Same object.
        expect(list.equals(1)).toBe(false); // Wrong type.

        expect(list2.contains(9)).toBe(true);
        expect(list2.contains(13)).toBe(false);

        list.add(13);
        expect(list.contains(13)).toBe(true);
        expect(list2.contains(13)).toBe(false);

        expect(list2.element()).toBe(1);

        const lit = list.listIterator(3);
        let elements: number[] = [];
        while (lit.hasNext()) {
            elements.push(lit.next());
        }
        expect(elements).toEqual([7, 9, 11, 13]);

        const it2 = list.iterator();
        elements = [];
        while (it2.hasNext()) {
            elements.push(it2.next());
        }
        expect(elements).toEqual([1, 3, 5, 7, 9, 11, 13]);
    });
});
