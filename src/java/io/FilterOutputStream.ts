/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { OutputStream } from "./OutputStream";

export abstract class FilterOutputStream extends OutputStream {

    protected readonly out: OutputStream;

    public constructor(output: OutputStream) {
        super();
        this.out = output;
    }
}
