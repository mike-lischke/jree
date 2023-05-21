/* java2ts: keep */

/*
 * Copyright (c) 2012, 2013, Oracle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Oracle, 500 Oracle Parkway, Redwood Shores, CA 94065 USA
 * or visit www.oracle.com if you need additional information or have any
 * questions.
 */

import { java, int, S, JavaObject } from "../../../../../../src";

const ArrayList = java.util.ArrayList;
type ArrayList<E> = java.util.ArrayList<E>;
type Collection<E> = java.util.Collection<E>;
const Collection = java.util.Collection;
type Iterator<T> = java.util.Iterator<T>;
type List<E> = java.util.List<E>;
type Supplier<T> = java.util.function.Supplier<T>;

/**
 *
 * A simple mutable list implementation that provides only default
 * implementations of all methods. ie. none of the List interface default
 * methods have overridden implementations.
 *
 * @param E type of list elements
 */
export class ExtendsAbstractList<E> extends java.util.AbstractList<E> {

    protected readonly list: List<E>;

    public constructor(source?: Supplier<List<E>> | java.util.Collection<E>) {
        super();

        if (source === undefined) {
            this.list = new ArrayList<E>();
        } else if (Collection.isCollection(source)) {
            this.list = new ArrayList<E>();
            this.list.addAll(source);
        } else {
            this.list = source();
        }
    }

    public override add(element: E): boolean;
    public override add(index: int, element: E): void;
    public override add(...args: unknown[]): boolean | void {
        switch (args.length) {
            case 1: {
                const [element] = args as [E];

                return this.list.add(element);
            }

            case 2: {
                const [index, element] = args as [int, E];

                this.list.add(index, element);

                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Invalid number of arguments`);
            }
        }
    }

    public override clear(): void {
        this.list.clear();
    }

    public override contains(element: E): boolean {
        return this.list.contains(element);
    }

    public override get(index: int): E {
        return this.list.get(index);
    }

    public override remove(index: int): E;
    public override remove(element: E): boolean;
    public override remove(...args: unknown[]): boolean | E {
        const [element] = args as [E | int];

        return this.list.remove(element);
    }

    public override set(index: int, element: E): E {
        return this.list.set(index, element);
    }

    public override iterator(): Iterator<E> {
        return new class extends JavaObject implements Iterator<E> {
            public source: java.util.Iterator<E>;

            public constructor(private $outer: ExtendsAbstractList<E>) {
                super();

                this.source = $outer.list.iterator();
            }

            public forEachRemaining(action: java.util.function.Consumer<E>): void {
                this.source.forEachRemaining(action);
            }

            public hasNext(): boolean {
                return this.source.hasNext();
            }

            public next(): E {
                return this.source.next();
            }

            public remove(): void {
                this.source.remove();
            }
        }(this);
    }

    public override size(): int {
        return this.list.size();
    }

    public override subList(fromIndex: number, toIndex: number): java.util.List<E> {
        return this.list.subList(fromIndex, toIndex);
    }

    public override toArray(): E[] {
        return this.list.toArray();
    }
}
