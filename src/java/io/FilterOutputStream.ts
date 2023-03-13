/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { OutputStream } from "./OutputStream";

export abstract class FilterOutputStream extends OutputStream {

    protected readonly out: OutputStream;

    public constructor(output: OutputStream) {
        super();
        this.out = output;
    }
}
