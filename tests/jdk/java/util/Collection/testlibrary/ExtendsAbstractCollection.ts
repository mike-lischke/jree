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

import { java, int } from "../../../../../../src";

const ArrayList = java.util.ArrayList;
type ArrayList<E> = java.util.ArrayList<E>;
type Collection<E> = java.util.Collection<E>;
const Collection = java.util.Collection;
type Iterator<T> = java.util.Iterator<T>;
type Supplier<T> = java.util.function.Supplier<T>;

/**
 * A simple mutable collection implementation that provides only default
 * implementations of all methods. ie. none of the Collection interface default
 * methods have overridden implementations.
 *
 * @param E type of collection elements
 */
export class ExtendsAbstractCollection<E> extends Collection<E> {

    protected readonly coll: Collection<E>;

    public constructor(source?: Collection<E> | Supplier<Collection<E>>) {
        super();

        if (source === undefined) {
            this.coll = new ArrayList<E>();
        } else if (source instanceof Collection) {
            this.coll = new ArrayList<E>();
            this.coll.addAll(source);
        } else {
            this.coll = source();
        }
    }

    public override add(element: E): boolean {
        return this.coll.add(element);
    }

    public override remove(element: java.lang.Object): boolean {
        return this.coll.remove(element);
    }

    public override iterator(): Iterator<E> {
        return new class extends java.lang.Object implements Iterator<E> {
            public source = this.$outer.coll.iterator();

            public constructor(private $outer: ExtendsAbstractCollection<E>) {
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
        return this.coll.size();
    }
}
