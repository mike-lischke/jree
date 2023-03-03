/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
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
