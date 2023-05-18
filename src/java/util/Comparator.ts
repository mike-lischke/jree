/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Comparable } from "../lang";

/**
 * A comparison function, which imposes a total ordering on some collection of objects. Comparators can be passed to
 * a sort method (such as Collections.sort or Arrays.sort) to allow precise control over the sort order.
 * Comparators can also be used to control the order of certain data structures (such as sorted sets or sorted maps),
 * or to provide an ordering for collections of objects that don't have a natural ordering.
 */
export interface Comparator<T> {
    /** Compares its two arguments for order. */
    // eslint-disable-next-line @typescript-eslint/prefer-function-type
    /*compare*/(o1: T, o2: T): number;
}

export abstract class Comparator<T> implements Comparator<T> {
    public static naturalOrder<E extends Comparable<E>>(): Comparator<E> {
        return new class extends Comparator<E> {
            public compare(o1: E, o2: E): number {
                return o1.compareTo(o2);
            }
        }();
    }

    public static reverseOrder<E extends Comparable<E>>(): Comparator<E> {
        return new class extends Comparator<E> {
            public compare(o1: E, o2: E): number {
                return o2.compareTo(o1);
            }
        }();
    }
}
