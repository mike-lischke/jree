/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { JavaString } from "../lang/String";
import { CharSequence } from "../lang/CharSequence";
import { char } from "../lang";
import { Charset } from "../nio/charset/Charset";
import { OutputStream } from "./OutputStream";
import { Writer } from "./Writer";

export class OutputStreamWriter extends Writer {
    // The size of the raw buffer used to keep input data.
    private static readonly writeBufferSize = 8192;

    private encoding: BufferEncoding;
    private buffer = Buffer.alloc(OutputStreamWriter.writeBufferSize);

    public constructor(out: OutputStream, charsetName?: JavaString);
    public constructor(out: OutputStream, cs?: Charset);
    public constructor(private out: OutputStream,
        charsetNameOrCs?: JavaString | Charset) {
        super(out);

        if (!charsetNameOrCs) {
            this.encoding = "utf8";
        } else if (charsetNameOrCs instanceof JavaString) {
            this.encoding = charsetNameOrCs.valueOf() as BufferEncoding;
        } else {
            this.encoding = charsetNameOrCs.name().valueOf() as BufferEncoding;
        }
    }

    /**
     * Returns the name of the character encoding being used by this stream.
     *
     * <p> If the encoding has an historical name then that name is returned;
     * otherwise the encoding's canonical name is returned.
     *
     * <p> If this instance was created with the {@link
     * #OutputStreamWriter(OutputStream, String)} constructor then the returned
     * name, being unique for the encoding, may differ from the name passed to
     * the constructor.  This method may return {@code null} if the stream has
     * been closed. </p>
     *
     * @returns The historical name of this encoding, or possibly
     *         {@code null} if the stream has been closed
     *
     * @see Charset
     */
    public getEncoding(): JavaString {
        return new JavaString(this.encoding);
    }

    /**
     * Flushes the output buffer to the underlying byte stream, without flushing
     * the byte stream itself.  This method is non-private only so that it may
     * be invoked by PrintStream.
     */
    public flushBuffer(): void {
        this.out.flush();
    }

    public write(c: char): void;
    public write(array: Uint16Array): void;
    public write(array: Uint16Array, offset: number, length: number): void;
    public write(str: JavaString): void;
    public write(str: JavaString, off: number, len: number): void;
    public write(cOrArrayOrStr: char | Uint16Array | JavaString, offset?: number,
        length?: number): void {
        let data: string;
        offset ??= 0;

        if (typeof cOrArrayOrStr === "number") {
            data = String.fromCodePoint(cOrArrayOrStr);
            length = 1;
        } else if (cOrArrayOrStr instanceof JavaString) {
            data = cOrArrayOrStr.valueOf();
            length ??= data.length;
        } else {
            data = cOrArrayOrStr.toString();
            length ??= data.length;
        }

        const buffer = Buffer.alloc(6 * length);
        buffer.write(data, offset, length, this.encoding);

        this.out.write(buffer);
    }

    public append(c: char): this;
    public append(csq: CharSequence): this;
    public append(csq: CharSequence, start: number, end: number): this;
    public append(cOrCsq: char | CharSequence, start?: number, end?: number): this {
        if (typeof cOrCsq === "number") {
            this.write(cOrCsq);
        } else {
            if (start !== undefined && end !== undefined) {
                this.write(new JavaString(cOrCsq.subSequence(start, end).toString()));
            } else {
                this.write(new JavaString(cOrCsq.toString()));
            }
        }

        return this;
    }

    /**
     * Flushes the stream.
     *
     * @throws     IOException  If an I/O error occurs
     */
    public flush(): void {
        this.out.flush();
    }

    public close(): void {
        this.out.close();
    }

}
