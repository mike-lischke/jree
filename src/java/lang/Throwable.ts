/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

/* eslint-disable max-classes-per-file */

import { JavaObject } from "./Object.js";

import { StackTraceElement } from "./StackTraceElement.js";

// import { System } from "./System"; creates a circular dependency

import type { JavaString } from "./String.js";
import type { PrintWriter } from "../io/PrintWriter.js";
import type { PrintStream } from "../io/PrintStream.js";

class JavaObjectWithStack extends JavaObject {
    protected stack?: string;
}

/**
 * The Throwable class is the superclass of all errors and exceptions in the Java language.
 * Only objects that are instances of this class (or one of its subclasses) are thrown by the Java Virtual Machine or
 * can be thrown by the Java throw statement.
 * Similarly, only this class or one of its subclasses can be the argument type in a catch clause.
 */
export class Throwable extends JavaObjectWithStack {
    #message: string | null = null;
    #cause: Throwable | null = null;

    #enableSuppression = true;
    #writableStackTrace = false;

    #elements: StackTraceElement[] = [];
    #suppressed: Throwable[] = [];

    /** Constructs a new throwable with null as its detail message. */
    public constructor();
    /** Constructs a new throwable with the specified detail message. */
    public constructor(message: JavaString | string | null);
    /** Constructs a new throwable with the specified detail message and cause. */
    public constructor(message: JavaString | string, cause: Throwable | null);
    /**
     * Constructs a new throwable with the specified detail message, cause, suppression enabled or disabled, and
     * writable stack trace enabled or disabled.
     */
    // This constructor is protected in Java, but in TS we cannot mix different modifiers in overloading.
    public constructor(message: JavaString | string, cause: Throwable | null, enableSuppression: boolean,
        writableStackTrace: boolean);
    /**
     * Constructs a new throwable with the specified cause and a detail message of
     *  (cause==null ? null : cause.toString()) (which typically contains the class and detail message of cause).
     */
    public constructor(cause: Throwable);
    public constructor(...args: unknown[]) {
        super();

        switch (args.length) {
            case 1: {
                const arg = args[0] as JavaString | string | Throwable | null;
                if (arg !== null) {
                    if (arg instanceof Throwable) {
                        this.#cause = arg;
                    } else if (typeof arg === "string") {
                        this.#message = arg;
                    } else {
                        this.#message = arg.valueOf();
                    }
                }

                break;
            }

            case 2: {
                const [message, cause] = args as [JavaString | string, Throwable | null];
                if (typeof message === "string") {
                    this.#message = message;
                } else {
                    this.#message = message.valueOf();
                }

                this.#cause = cause;
                break;
            }

            case 4: {
                const [message, cause, enableSuppression, writableStackTrace] =
                    args as [JavaString | string, Throwable | null, boolean, boolean];

                if (typeof message === "string") {
                    this.#message = message;
                } else {
                    this.#message = message.valueOf();
                }

                this.#cause = cause;
                this.#enableSuppression = enableSuppression;
                this.#writableStackTrace = writableStackTrace;

                break;
            }

            default:
        }

        Error.captureStackTrace(this, this.constructor);

        if (this.#writableStackTrace) {
            this.fillInStackTrace();
        }
    }

    /**
     * Creates a throwable wrapper around a JS error, while keeping the cause-chain intact.
     *
     * @param error A JS error.
     *
     * @returns A Throwable instance which wraps the given error.
     */
    public static fromError(error: unknown): Throwable {
        if (error instanceof Throwable) {
            return error;
        }

        if (error instanceof Error) {
            let cause: Throwable | null = null;
            if (error.cause) {
                cause = Throwable.fromError(error.cause);
            }

            return new Throwable(`${error.message}`, cause);
        }

        return new Throwable(`${error}`);
    }

    /**
     * Appends the specified exception to the exceptions that were suppressed in order to deliver this exception.
     *
     * @param exception The exception to be added to the list of suppressed exceptions.
     */
    public addSuppressed(exception: Throwable): void {
        if (this === exception) {
            // Dynamically import the exception class to avoid a circular dependency.
            void import("./IllegalArgumentException.js").then((module) => {
                throw new module.IllegalArgumentException();
            });

            return;
        }

        if (exception === null) {
            void import("./NullPointerException.js").then((module) => {
                throw new module.NullPointerException();
            });

            return;
        }

        if (this.#enableSuppression) {
            this.#suppressed.push(exception);
        }
    }

    /**
     * Fills in the execution stack trace. This method records within this Throwable object information about the
     * current state of the stack frames for the current thread.
     *
     * @returns this Throwable object.
     */
    public fillInStackTrace(): Throwable {
        if (this.stack) {
            const lines = this.stack.split("\n").slice(1);

            this.#elements = lines.map((line) => {
                return new StackTraceElement(line);
            });
        } else {
            this.#elements = [];
        }

        return this;
    }

    /** @returns the cause of this throwable or null if the cause is nonexistent or unknown. */
    public getCause(): Throwable | null {
        return this.#cause;
    }

    /**
     * @returns a localized description of this throwable.
     */
    public getLocalizedMessage(): string | null {
        return this.#message;
    }

    /** @returns the detail message string of this throwable. */
    public getMessage(): string | null {
        return this.#message;
    }

    /**
     * Provides programmatic access to the stack trace information printed by printStackTrace().
     *
     * @returns an array of stack trace elements representing the stack trace pertaining to this throwable.
     */
    public getStackTrace(): StackTraceElement[] {
        return this.#elements;
    }

    /**
     * @returns an array containing all of the exceptions that were suppressed, typically by the try-with-resources
     * statement, in order to deliver this exception.
     */
    public getSuppressed(): Throwable[] {
        if (this.#enableSuppression) {
            return this.#suppressed;
        }

        return [];
    }

    /**
     * Initializes the cause of this throwable to the specified value.
     *
     * @param cause The cause (which is saved for later retrieval by the getCause() method). (A null value is permitted,
     * and indicates that the cause is nonexistent or unknown.)
     *
     * @returns this Throwable object.
     */
    public initCause(cause: Throwable): this {
        this.#cause = cause;

        return this;
    }

    /**
     * Prints this throwable and its backtrace to the standard error stream.
     * This method prints a stack trace for this Throwable object on the error output stream that is the value of the
     * field System.err.
     * The first line of output contains the result of the Throwable.toString() method for this object.
     * Remaining lines represent data previously recorded by the method Throwable.fillInStackTrace().
     * This data is an approximation of the actual stack trace.
     */
    public printStackTrace(): void;
    /**
     * This method prints a stack trace for this Throwable object on the specified print stream.
     *
     * @param s The print stream.
     */
    public printStackTrace(s: PrintStream): void;
    public printStackTrace(s: PrintWriter): void;
    public printStackTrace(s?: PrintStream | PrintWriter): void {
        const headLine = this.toString();

        if (!s) {
            console.error(headLine.valueOf());
            console.error(this.stack);

            return;
        }

        s.println(headLine);
        s.println(`${this.stack}`);
    }

    /**
     * Sets the stack trace elements that will be returned by getStackTrace() and printed by printStackTrace() and
     * related methods.
     *
     * @param stackTrace tbd
     */
    public setStackTrace(stackTrace: StackTraceElement[]): void {
        if (!this.#writableStackTrace) {
            this.#elements = stackTrace;
        }
    }

    /**
     * Sets the detail message string of this throwable.
     *
     * @param message The detail message string.
     *
     * @returns this Throwable object.
     */
    public setMessage(message: JavaString | string): this {
        this.#message = typeof message === "string" ? message : message.valueOf();

        return this;
    }

    /** @returns a short description of this throwable. */
    public override toString(): string {
        const message = this.getLocalizedMessage();
        if (!message) {
            return `${this.stack}`;
        }

        return `${this.constructor.name}: ${message}`;
    }

    protected [Symbol.toPrimitive](): string {
        return `${this.toString()}`;
    }
}
