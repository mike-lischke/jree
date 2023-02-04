/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* cSpell: ignore closeables */

import * as fs from "fs/promises";

import { java } from "../..";
import { JavaObject } from "../lang/Object";

export class FileDescriptor extends JavaObject {
    private parent?: java.io.Closeable;
    private otherParents: java.io.Closeable[] = [];
    private closed = false;

    private fileHandle?: fs.FileHandle;

    public constructor(fd?: fs.FileHandle) {
        super();

        this.fileHandle = fd;
    }

    public sync(): void {
        void this.fileHandle?.sync();
    }

    public valid(): boolean {
        return this.fileHandle !== undefined;
    }

    public close(): void {
        void this.fileHandle?.close();
    }

    public get handle(): fs.FileHandle | undefined {
        return this.fileHandle;
    }

    public set handle(value: fs.FileHandle | undefined) {
        this.fileHandle = value;
    }

    /**
     * Attach a Closeable to this FD for tracking.
     * parent reference is added to otherParents when
     * needed to make closeAll simpler.
     *
     * @param c tbd
     */
    public attach(c: java.io.Closeable): void {
        if (!this.parent) {
            // first caller gets to do this
            this.parent = c;
        } else if (this.otherParents.length === 0) {
            this.otherParents.push(this.parent);
            this.otherParents.push(c);
        } else {
            this.otherParents.push(c);
        }
    }

    /**
     * Cycle through all closeables sharing this FD and call
     * close() on each one.
     *
     * The caller closeable gets to call close0().
     *
     * @param releaser tbd
     */
    public closeAll(releaser: java.io.Closeable): void {
        if (!this.closed) {
            this.closed = true;
            let ioe: java.io.IOException | undefined;

            try {
                try {
                    for (const referent of this.otherParents) {
                        try {
                            referent.close();
                        } catch (x) {
                            const t = java.lang.Throwable.fromError(x);
                            if (!ioe) {
                                ioe = t;
                            } else {
                                ioe.addSuppressed(t);
                            }
                        }
                    }
                } finally {
                    releaser.close();
                }
            } catch (ex) {
                /*
                 * If releaser close() throws IOException
                 * add other exceptions as suppressed.
                 */
                const t = java.lang.Throwable.fromError(ex);
                if (ioe) {
                    t.addSuppressed(ioe);
                }

                ioe = t;
            } finally {
                if (ioe) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw ioe;
                }
            }
        }
    }

}
