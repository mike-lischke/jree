/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Comparable, NullPointerException } from "../lang";
import { JavaObject } from "../lang/Object";
import { ArrayList } from "./ArrayList";
import { Collection } from "./Collection";
import { Comparator } from "./Comparator";
import { JavaIterator } from "./Iterator";
import { ListIterator } from "./ListIterator";
import { UnaryOperator } from "./function/UnaryOperator";

export interface List<T> extends Collection<T> {

    /**
     * Inserts the specified element at the specified position in this list.
     */
    add(index: number, element: T): void;

    /**
     * Appends the specified element to the end of this list.
     */
    add(e: T): boolean;

    /**
     * Inserts all of the elements in the specified collection into this list at the specified position.
     */
    addAll(index: number, c: Collection<T>): boolean;

    /**
     * Appends all of the elements in the specified collection to the end of this list, in the order that they are
     * returned by the specified collection's iterator.
     */
    addAll(c: Collection<T>): boolean;

    /**
     * Removes all of the elements from this list.
     */
    clear(): void;

    /**
     * Returns true if this list contains the specified element.
     */
    contains(element: T): boolean;

    /**
     * Returns true if this list contains all of the elements of the specified collection.
     */
    containsAll(c: Collection<T>): boolean;

    /**
     * Compares the specified object with this list for equality.
     */
    equals(other: unknown): boolean;

    /**
     * Returns the element at the specified position in this list.
     */
    get(index: number): T;

    /**
     * Returns the hash code value for this list.
     */
    hashCode(): number;

    /**
     * Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    indexOf(o: T): number;

    /**
     * Returns true if this list contains no elements.
     */
    isEmpty(): boolean;

    /**
     * Returns an iterator over the elements in this list in proper sequence.
     */
    iterator(): JavaIterator<T>;

    /**
     * Returns the index of the last occurrence of the specified element in this list, or -1 if this list does not
     * contain the element.
     */
    lastIndexOf(o: T): number;

    /**
     * Returns a list iterator over the elements in this list (in proper sequence), starting at the specified
     * position in the list (or 0 if no index is given).
     */
    listIterator(index?: number): ListIterator<T>;

    /**
     * Removes the element at the specified position in this list.
     */
    remove(index: number): T | undefined;
    remove(o: unknown): boolean;

    /**
     * Removes from this list all of its elements that are contained in the specified collection.
     */
    removeAll(c: Collection<T>): boolean;

    /**
     * Replaces each element of this list with the result of applying the operator to that element.
     */
    replaceAll(operator: UnaryOperator<T> | null): void;

    /**
     * Retains only the elements in this list that are contained in the specified collection.
     */
    retainAll(c: Collection<T>): boolean;

    /**
     * Replaces the element at the specified position in this list with the specified element.
     */
    set(index: number, element: T): T;

    /**
     * Returns the number of elements in this list.
     */
    size(): number;

    /**
     * Sorts this list according to the order induced by the specified comparator.
     *
     * @param c The comparator to use for sorting. If null the natural ordering of the elements is used.
     */
    sort(c: Comparator<T> | null): void;

    /**
     * Returns a view of the portion of this list between the specified fromIndex, inclusive, and toIndex, exclusive.
     */
    subList(fromIndex: number, toIndex: number): List<T>;

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element).
     */
    toArray(): T[];

    /**
     * Returns an array containing all of the elements in this list in proper sequence (from first to last element);
     * the runtime type of the returned array is that of the specified array.
     */
    toArray<T2>(a: T2[]): T2[];
}

export class List<T> extends JavaObject implements List<T> {
    /**
     * Sorts this list according to the order induced by the specified Comparator. The sort is stable: this method must
     * not reorder equal elements.
     * All elements in this list must be mutually comparable using the specified comparator (that is, c.compare(e1, e2)
     * must not throw a ClassCastException for any elements e1 and e2 in the list).
     * If the specified comparator is null then all elements in this list must implement the Comparable interface and
     * the elements' natural ordering should be used.
     *
     * @param c The Comparator used to compare list elements. A null value indicates that the elements' natural ordering
     *          should be used.
     */
    public sort(c: Comparator<T> | null): void {
        const list = this.toArray();
        if (c !== null) {
            list.sort((a: T, b: T) => {
                return c(a, b);
            });
        } else {
            list.sort((a: T, b: T) => {
                return (a as Comparable<T>).compareTo(b);
            });
        }
    }
}

export namespace List {
    export const copyOf = <T>(list: List<T> | null): List<T> => {
        if (list === null) {
            throw new NullPointerException();
        }

        const result = new ArrayList<T>();
        result.addAll(list);

        return result;
    };

    export function of<T>(): List<T>;
    export function of<T>(element: T): List<T>;
    export function of<T>(element1: T, element2: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T, element6: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T, element6: T,
        element7: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T, element6: T, element7: T,
        element8: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T, element6: T, element7: T,
        element8: T, element9: T): List<T>;
    export function of<T>(element1: T, element2: T, element3: T, element4: T, element5: T, element6: T, element7: T,
        element8: T, element9: T, element10: T): List<T>;
    export function of<T>(...elements: T[]): List<T>;
    /**
     * @returns an unmodifiable list containing an arbitrary number of elements.
     * @param args the elements of the list
     */
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    export function of<T>(...args: T[]): List<T> {
        const result = new ArrayList<T>(args);

        return result;
    }
}
