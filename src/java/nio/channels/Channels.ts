/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { FileInputStream } from "../../io/FileInputStream.js";
import { InputStream } from "../../io/InputStream.js";
import { OutputStream } from "../../io/OutputStream.js";
import { IllegalArgumentException } from "../../lang/IllegalArgumentException.js";
import { JavaObject } from "../../lang/Object.js";
import { ByteBuffer } from "../ByteBuffer.js";
import { ClosedChannelException } from "./ClosedChannelException.js";
import { ReadableByteChannel } from "./ReadableByteChannel.js";
import { AbstractInterruptibleChannel } from "./spi/AbstractInterruptibleChannel.js";
import { WritableByteChannel } from "./WritableByteChannel.js";

export class Channels extends JavaObject {
    public static newChannel(input: InputStream): ReadableByteChannel;
    public static newChannel(output: OutputStream): WritableByteChannel;
    public static newChannel(arg: InputStream | OutputStream): ReadableByteChannel | WritableByteChannel {
        if (arg instanceof InputStream) {
            if (arg instanceof FileInputStream) {
                return arg.getChannel();
            }

            return new class extends AbstractInterruptibleChannel implements ReadableByteChannel {
                public constructor() {
                    super();
                }

                public read(dst: ByteBuffer): number {
                    if (!this.isOpen()) {
                        throw new ClosedChannelException();
                    }

                    if (dst.isReadOnly()) {
                        throw new IllegalArgumentException();
                    }

                    return arg.read(dst.array());
                }

                protected implCloseChannel(): void {
                    arg.close();
                }
            }();
        } else {
            return new class extends AbstractInterruptibleChannel implements WritableByteChannel {
                public constructor() {
                    super();
                }

                public write(src: ByteBuffer): number {
                    if (!this.isOpen()) {
                        throw new ClosedChannelException();
                    }

                    const count = src.remaining();
                    arg.write(src.array());

                    return count;
                }

                protected implCloseChannel(): void {
                    arg.close();
                }
            }();
        }
    }

}
