/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaObject } from "./java/lang/Object.js";
import { UnsupportedOperationException } from "./java/lang/UnsupportedOperationException.js";
import { HashMapEntry } from "./java/util/HashMapEntry.js";
import { JavaIterator } from "./java/util/Iterator.js";
import { JavaMap } from "./java/util/Map.js";
import { Consumer } from "./java/util/function/Consumer.js";

/** A specialized JRE iterator for Map entries, which wraps a Typescript iterator. */
export class JavaMapEntryIterator<K, V> extends JavaObject implements JavaIterator<JavaMap.Entry<K, V>> {

    private nextValue: IteratorResult<[K, V], [K, V]>;

    public constructor(private iterator: Iterator<[K, V]>) {
        super();
        this.nextValue = iterator.next();
    }

    public forEachRemaining(action: Consumer<JavaMap.Entry<K, V>>): void {
        while (!this.nextValue.done) {
            action(new HashMapEntry(this.nextValue.value[0], this.nextValue.value[1]));
            this.nextValue = this.iterator.next();
        }
    }

    public hasNext(): boolean {
        return !this.nextValue.done;
    }

    public next(): JavaMap.Entry<K, V> {
        const result = this.nextValue;
        this.nextValue = this.iterator.next();

        return new HashMapEntry(result.value[0], result.value[1]);
    }

    public remove(): void {
        throw new UnsupportedOperationException();
    }

}
