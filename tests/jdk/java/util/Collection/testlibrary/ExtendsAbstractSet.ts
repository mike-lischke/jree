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

import { JavaObject } from "../../../../../../src/java/lang/Object.js";
import { Collection } from "../../../../../../src/java/util/Collection.js";
import { HashSet } from "../../../../../../src/java/util/HashSet.js";
import { JavaIterator } from "../../../../../../src/java/util/Iterator.js";
import { JavaSet } from "../../../../../../src/java/util/Set.js";
import { Consumer } from "../../../../../../src/java/util/function/Consumer.js";
import { Supplier } from "../../../../../../src/java/util/function/Supplier.js";
import { int } from "../../../../../../src/types.js";

/**
 * A simple mutable set implementation that provides only default
 * implementations of all methods. ie. none of the Set interface default methods
 * have overridden implementations.
 *
 * @param E type of set members
 */
export class ExtendsAbstractSet<E> extends HashSet<E> {

    protected readonly set: JavaSet<E>;

    public constructor(source: Collection<E> | Supplier<JavaSet<E>>) {
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

    public override iterator(): JavaIterator<E> {
        return new class extends JavaObject implements JavaIterator<E> {
            public source;

            public constructor(private readonly $outer: ExtendsAbstractSet<E>) {
                super();
                this.source = this.$outer.set.iterator();
            }

            public forEachRemaining(action: Consumer<E>): void {
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
