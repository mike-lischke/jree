/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaObject } from "./java/lang/Object";
import { UnsupportedOperationException } from "./java/lang/UnsupportedOperationException";
import { HashMapEntry } from "./java/util/HashMapEntry";
import { JavaIterator } from "./java/util/Iterator";
import { JavaMap } from "./java/util/Map";

/** A specialized JRE iterator for Map entries, which wraps a Typescript iterator. */
export class JavaMapEntryIterator<K, V> extends JavaObject implements JavaIterator<JavaMap.Entry<K, V>> {

    private nextValue: IteratorResult<[K, V], [K, V]>;

    public constructor(private iterator: Iterator<[K, V]>) {
        super();
        this.nextValue = iterator.next();
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
