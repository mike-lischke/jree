/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { MurmurHash } from "../../MurmurHash";
import { JavaObject } from "./Object";

export class StackTraceElement extends JavaObject {
    private declaringClass = "";
    private methodName = "";
    private fileName = "";
    private lineNumber = -1;
    private isNative = false;

    /**
     * Creates a stack trace element representing the specified execution point.
     *
     * @param line The stack trace line to parse.
     */
    public constructor(private line: string) {
        super();

        this.line = line;
        if (line.match(/^\s*[-]{4,}$/)) {
            return;
        }

        const lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
        if (!lineMatch) {
            return;
        }

        this.isNative = (lineMatch[5] === "native");
        if (lineMatch[1]) {
            this.methodName = lineMatch[1];
            let methodStart = this.methodName.lastIndexOf(".");
            if (this.methodName[methodStart - 1] === ".") {
                --methodStart;
            }

            if (methodStart > 0) {
                this.declaringClass = this.methodName.substring(0, methodStart);
                const objectEnd = this.declaringClass.indexOf(".Module");
                if (objectEnd > 0) {
                    this.methodName = this.methodName.substring(objectEnd + 1);
                    this.declaringClass = this.declaringClass.substring(0, objectEnd);
                }
            }
        }

        this.lineNumber = parseInt(lineMatch[3], 10);
        this.fileName = lineMatch[2];
    }

    /**
     * @param obj The object to compare to.
     *
     * @returns true if the specified object is another StackTraceElement instance representing the same
     * execution point as this instance.
     */
    public override equals(obj: JavaObject): boolean {
        if (obj instanceof StackTraceElement) {
            return this.declaringClass === obj.declaringClass &&
                this.methodName === obj.methodName &&
                this.fileName === obj.fileName &&
                this.lineNumber === obj.lineNumber &&
                this.isNative === obj.isNative;
        }

        return false;
    }

    /** @returns a hash code value for this stack trace element. */
    public override hashCode(): number {
        const hash = MurmurHash.initialize(17);
        MurmurHash.update(hash, this.declaringClass);
        MurmurHash.update(hash, this.methodName);
        MurmurHash.update(hash, this.fileName);
        MurmurHash.update(hash, this.lineNumber);
        MurmurHash.update(hash, this.isNative);

        return MurmurHash.finish(hash, 5);
    }

    /**
     * @returns the fully qualified name of the class containing the execution point represented by this
     * stack trace element.
     */
    public getClassName(): string {
        return this.declaringClass;
    }

    /** @returns the name of the source file containing the execution point represented by this stack trace element. */
    public getFileName(): string {
        return this.fileName;
    }

    /**
     * @returns the line number of the source line containing the execution point represented by this
     * stack trace element.
     */
    public getLineNumber(): number {
        return this.lineNumber;
    }

    /** @returns the name of the method containing the execution point represented by this stack trace element. */
    public getMethodName(): string {
        return this.methodName;
    }

    /**
     * @returns true if the method containing the execution point represented by this stack trace element is a
     * native method.
     */
    public isNativeMethod(): boolean {
        return this.isNative;
    }

    /** @returns a string representation of this stack trace element. */
    public override toString(): string {
        return this.line;
    }
}
