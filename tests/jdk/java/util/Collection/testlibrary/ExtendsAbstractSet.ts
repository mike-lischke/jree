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

import { java, int, JavaObject } from "../../../../../../src";

const HashSet = java.util.HashSet;
type HashSet<E> = java.util.HashSet<E>;
type Collection<E> = java.util.Collection<E>;
const Collection = java.util.Collection;
type Iterator<T> = java.util.Iterator<T>;
type Set<E> = java.util.Set<E>;
type Supplier<T> = java.util.function.Supplier<T>;

/**
 * A simple mutable set implementation that provides only default
 * implementations of all methods. ie. none of the Set interface default methods
 * have overridden implementations.
 *
 * @param E type of set members
 */
export class ExtendsAbstractSet<E> extends HashSet<E> {

    protected readonly set: Set<E>;

    public constructor(source: java.util.Collection<E> | Supplier<Set<E>>) {
        super();
        if (source === undefined) {
            this.set = new HashSet<E>();
        } else if (source instanceof Collection) {
            this.set = new HashSet<E>();
            this.set.addAll(source);
        } else {
            this.set = source.get();
        }
    }

    public override add(element: E): boolean {
        return this.set.add(element);
    }

    public override remove(element: E): boolean {
        return this.set.remove(element);
    }

    public override iterator(): Iterator<E> {
        return new class extends JavaObject implements Iterator<E> {
            public source = this.$outer.set.iterator();

            public constructor(private readonly $outer: ExtendsAbstractSet<E>) {
                super();
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
        return this.set.size();
    }
}
