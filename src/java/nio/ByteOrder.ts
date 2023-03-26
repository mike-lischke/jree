/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { endianness } from "os";

import { JavaString } from "../lang/String";
import { JavaObject } from "../lang/Object";

export class ByteOrder extends JavaObject {
    public static readonly BIG_ENDIAN = new ByteOrder(true);
    public static readonly LITTLE_ENDIAN = new ByteOrder(false);

    private bigEndian: boolean;

    private constructor(flag: boolean) {
        super();

        this.bigEndian = flag;
    }

    public static get byteOrder(): ByteOrder {
        if (endianness() === "BE") {
            return ByteOrder.BIG_ENDIAN;
        }

        return ByteOrder.LITTLE_ENDIAN;
    }

    public override toString(): JavaString {
        if (this.bigEndian) {
            return new JavaString(`BIG_ENDIAN`);
        }

        return new JavaString(`LITTLE_ENDIAN`);
    }
}
