/* java2ts: keep */

/*
 * Copyright (c) 2013, Oracle and/or its affiliates. All rights reserved.
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

/**
 * @summary Verify that replacing the value for an existing key does not
 * corrupt active iterators, in particular due to a resize() occurring and
 * not updating modCount.
 */

import { IllegalArgumentException } from "../../../../../src/java/lang/IllegalArgumentException.js";
import { Integer } from "../../../../../src/java/lang/Integer.js";
import { JavaObject } from "../../../../../src/java/lang/Object.js";
import { RuntimeException } from "../../../../../src/java/lang/RuntimeException.js";
import { HashMap } from "../../../../../src/java/util/HashMap.js";
import { HashSet } from "../../../../../src/java/util/HashSet.js";
import { I } from "../../../../../src/templates.js";
import { int } from "../../../../../src/types.js";

export class ReplaceExisting extends JavaObject {
    /* Number of entries required to trigger a resize for cap=16, load=0.75*/
    private static ENTRIES = 13;

    public static main(args: String[]): void {
        for (let i = 0; i <= ReplaceExisting.ENTRIES; i++) {
            const hm = ReplaceExisting.prepHashMap();
            ReplaceExisting.testItr(hm, i);
        }
    }

    /* Prepare a HashMap that will resize on next put() */
    private static prepHashMap(): HashMap<Integer, Integer> {
        const hm = new HashMap<Integer, Integer>(16, 0.75);
        // Add items to one more than the resize threshold
        for (let i = 0; i < ReplaceExisting.ENTRIES; i++) {
            hm.put(I`${i * 10}`, I`${i * 10}`);
        }

        return hm;
    }

    /* Iterate hm for elemBeforePut elements, then call put() to replace value
     * for existing key.  With bug 8025173, this will also cause a resize, but
     * not increase the modCount.
     * Finish the iteration to check for a corrupt iterator.
     */
    private static testItr(hm: HashMap<Integer, Integer>, elemBeforePut: int): void {
        if (elemBeforePut > hm.size()) {
            throw new IllegalArgumentException("Error in test: elemBeforePut must be <= HashMap size");
        }
        // Create a copy of the keys
        const keys = new HashSet(hm.size());
        keys.addAll(hm.keySet());

        const collected = new HashSet(hm.size());

        // Run itr for elemBeforePut items, collecting returned elements
        const itr = hm.keySet().iterator();
        for (let i = 0; i < elemBeforePut; i++) {
            const retVal = itr.next();
            if (!collected.add(retVal)) {
                throw new RuntimeException("Corrupt iterator: key " + retVal + " already encountered");
            }
        }

        // Do put() to replace entry (and resize table when bug present)
        if (null === hm.put(I`${0}`, I`${100}`)) {
            throw new RuntimeException("Error in test: expected key 0 to be in the HashMap");
        }

        // Finish itr + collecting returned elements.
        while (itr.hasNext()) {
            const retVal = itr.next();
            if (!collected.add(retVal)) {
                throw new RuntimeException("Corrupt iterator: key " + retVal + " already encountered");
            }
        }

        // Compare returned elements to original copy of keys
        if (!keys.equals(collected)) {
            throw new RuntimeException("Collected keys do not match original set of keys");
        }
    }
}
