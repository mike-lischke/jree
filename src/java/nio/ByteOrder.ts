/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import { endianness } from "os";

import { java } from "../..";
import { JavaObject } from "../lang/Object";

import { S } from "../../templates";

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

    public toString(): java.lang.String {
        if (this.bigEndian) {
            return S`BIG_ENDIAN`;
        }

        return S`LITTLE_ENDIAN`;
    }
}
