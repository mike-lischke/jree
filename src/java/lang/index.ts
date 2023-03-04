/*
 * This file is released under the MIT license.
 * Copyright (c) 2022, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/** The equivalent of Java's char type. Treat it as 16 bit integer! */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type char = number;

export { JavaObject as Object, Class } from "./Object";
export { JavaString as String } from "./String";
export { JavaBoolean as Boolean } from "./Boolean";
export { JavaNumber as Number } from "./Number";

export * from "./Enum";
export * from "./StringBuilder";
export * from "./StringBuffer";
export * from "./Character";
export * from "./CharSequence";
export * from "./String";
export * from "./Number";
export * from "./Integer";
export * from "./Long";
export * from "./Boolean";
export * from "./Cloneable";
export * from "./Appendable";
export * from "./Comparable";
export * from "./Readable";
export * from "./Iterable";
export * from "./AutoCloseable";

export * from "./Throwable";
export { JavaError as Error } from "./Error";
export * from "./Exception";
export * from "./RuntimeException";
export * from "./IndexOutOfBoundsException";
export * from "./IllegalArgumentException";
export * from "./NumberFormatException";
export * from "./IllegalStateException";
export * from "./UnsupportedOperationException";
export * from "./NullPointerException";
export * from "./LinkageError";
export * from "./IncompatibleClassChangeError";
export * from "./NoSuchMethodError";
export * from "./VirtualMachineError";
export * from "./OutOfMemoryError";
export * from "./NegativeArraySizeException";
export * from "./CloneNotSupportedException";
export * from "./ArrayIndexOutOfBoundsException";

export * from "./System";
export * from "./StackTraceElement";
