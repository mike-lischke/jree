/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Comparable } from "../lang/Comparable";
import { Class, JavaObject } from "../lang/Object";
import { ArrayList } from "./ArrayList";
import { Collection } from "./Collection";
import { Comparator } from "./Comparator";
import { HashMap } from "./HashMap";
import { HashSet } from "./HashSet";
import { List } from "./List";
import { JavaMap } from "./Map";
import { JavaSet } from "./Set";

export abstract class Collections extends JavaObject {
    public static readonly EMPTY_LIST = new ArrayList();
    public static readonly EMPTY_MAP = new HashMap();
    public static readonly EMPTY_SET = new HashSet();

    public static checkedList<T>(list: List<T>, type: Class<T>): List<T> {
        return list;
    }

    public static unmodifiableMap<K, V>(map: JavaMap<K, V>): JavaMap<K, V> {
        return map;
    }

    public static synchronizedList<T>(list: List<T>): List<T> {
        return list;
    }

    public static unmodifiableList<T>(list: List<T>): List<T> {
        return list;
    }

    public static reverse<T>(list: List<T>): void {
        const array = list.toArray().reverse();
        list.clear();
        for (const entry of array) {
            list.add(entry);
        }
    }

    public static emptyList<T>(): List<T> {
        return new ArrayList<T>();
    }

    public static sort<T>(list: List<T>, c: Comparator<T>): List<T> {
        const array = list.toArray();
        array.sort((a, b) => {
            return c(a, b);
        });

        return new ArrayList<T>(array);
    }

    public static max<T1 extends Comparable<T1>>(coll: Collection<T1>): T1 | null;
    public static max<T2>(coll: Collection<T2>, comp: Comparator<T2>): T2 | null;
    public static max<T1 extends Comparable<T1>, T2>(
        coll: Collection<T1> | Collection<T2>, comp?: Comparator<T2>): T1 | T2 | null {
        if (comp) {
            let result: T2 | null = null;

            for (const current of coll as Collection<T2>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = comp(result, current);
                if (comparison < 0) {
                    result = current;
                }
            }

            return result;
        } else {
            let result: T1 | null = null;

            for (const current of coll as Collection<T1>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = result.compareTo(current);
                if (comparison < 0) {
                    result = current;
                }
            }

            return result;
        }
    }

    public static min<T1 extends Comparable<T1>>(coll: Collection<T1>): T1 | null;
    public static min<T2>(coll: Collection<T2>, comp: Comparator<T2>): T2 | null;
    public static min<T1 extends Comparable<T1>, T2>(
        coll: Collection<T1> | Collection<T2>, comp?: Comparator<T2>): T1 | T2 | null {
        if (comp) {
            let result: T2 | null = null;

            for (const current of coll as Collection<T2>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = comp(result, current);
                if (comparison > 0) {
                    result = current;
                }
            }

            return result;
        } else {
            let result: T1 | null = null;

            for (const current of coll as Collection<T1>) {
                if (result === null) {
                    result = current;
                    continue;
                }

                const comparison = result.compareTo(current);
                if (comparison > 0) {
                    result = current;
                }
            }

            return result;
        }
    }

    /**
     * @returns an immutable set containing only the specified object.
     *
     * @param o the sole object to be stored in the returned set.
     */
    public static singleton<T>(o: T): JavaSet<T> {
        const set = new HashSet<T>();
        set.add(o);

        return set;
    }

    /**
     * @returns an immutable list containing only the specified object. The returned list is serializable.
     *
     * @param o the sole object to be stored in the returned list.
     */
    public static singletonList<T>(o: T): List<T> {
        return new ArrayList<T>([o]);
    }
}
