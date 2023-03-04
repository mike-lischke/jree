# Ported Types of java.lang

This page lists the java.lang types that are currently in this Node package. The notation describes the current status of a package or type. The symbol 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization), while Ⓟ indicates a partial conversion. Additionally, the symbol 𝑺 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.


## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[Appendable](https://docs.oracle.com/javase/8/docs/api/java/lang/Appendable.html)|An object to which char sequences and values can be appended.|
|🅵|[AutoCloseable](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html)|An object that may hold resources (such as file or socket handles) until it is closed.|
|🅵|[CharSequence](https://docs.oracle.com/javase/8/docs/api/java/lang/CharSequence.html)|A CharSequence is a readable sequence of char values.|
|🅵|[Cloneable](https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html)|A class implements the Cloneable interface to indicate to the `Object.clone()` method that it is legal for that method to make a field-for-field copy of instances of that class.|
|🅵|[Comparable\<T>](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html)|This interface imposes a total ordering on the objects of each class that implements it.|
|🅵|[Iterable\<T>](https://docs.oracle.com/javase/8/docs/api/java/lang/Iterable.html)|Implementing this interface allows an object to be the target of the enhanced for statement (sometimes called the "for-each loop" statement).|
|🅵|[Readable](https://docs.oracle.com/javase/8/docs/api/java/lang/Readable.html)|A readable source of characters.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[Boolean](https://docs.oracle.com/javase/8/docs/api/java/lang/Boolean.html)|The Boolean class wraps a value of the primitive type boolean in an object.|
|🅵|[Character](https://docs.oracle.com/javase/8/docs/api/java/lang/Character.html)|The Character class wraps a value of the primitive type char in an object.|
|Ⓟ|[Class](https://docs.oracle.com/javase/8/docs/api/java/lang/Class.html)|Instances of the class Class represent classes and interfaces in a running Java application.|
|🅵|[Integer](https://docs.oracle.com/javase/8/docs/api/java/lang/Integer.html)|The Integer class wraps a value of the primitive type int in an object.|
|🅵|[Long](https://docs.oracle.com/javase/8/docs/api/java/lang/Long.html)|The Long class wraps a value of the primitive type long in an object.|
|🅵|[Number](https://docs.oracle.com/javase/8/docs/api/java/lang/Number.html)|The abstract class Number is the superclass of platform classes representing numeric values that are convertible to the primitive types byte, double, float, int, long, and short.|
|🅵|[Object](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html)|The class Object is the root of the class hierarchy.|
|🅵|[StackTraceElement](https://docs.oracle.com/javase/8/docs/api/java/lang/StackTraceElement.html)|A stack trace element (a stack frame).|
|🅵|[String](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html)|The String class represents character strings..|
|🅵|[StringBuffer](https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuffer.html)|A thread-safe, mutable sequence of characters.|
|🅵|[StringBuilder](https://docs.oracle.com/javase/8/docs/api/java/lang/StringBuilder.html)|A mutable sequence of characters.|
|Ⓟ|[System](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html)|The class System contains several useful class fields and methods.|

## Enum Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[Enum](https://docs.oracle.com/javase/8/docs/api/java/lang/Enum.html)|All the constants of an enum type are implicitly public, static and final.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[ArrayIndexOutOfBoundsException](https://docs.oracle.com/javase/8/docs/api/java/lang/ArrayIndexOutOfBoundsException.html)|Thrown to indicate that an array has been accessed with an illegal index.|
|🅵|[CloneNotSupportedException](https://docs.oracle.com/javase/8/docs/api/java/lang/CloneNotSupportedException.html)|Thrown to indicate that the `clone` method in class Object has been called to clone an object, but that the object's class does not implement the Cloneable interface.|
|🅵|[Error](https://docs.oracle.com/javase/8/docs/api/java/lang/Error.html)|An Error is a subclass of Throwable that indicates serious problems that a reasonable application should not try to catch.|
|🅵|[Exception](https://docs.oracle.com/javase/8/docs/api/java/lang/Exception.html)|Exception is a class that represents an exception condition that a reasonable application might want to catch.|
|🅵|[IllegalArgumentException](https://docs.oracle.com/javase/8/docs/api/java/lang/IllegalArgumentException.html)|Thrown to indicate that a method has been passed an illegal or inappropriate argument.|
|🅵|[IllegalStateException](https://docs.oracle.com/javase/8/docs/api/java/lang/IllegalStateException.html)|Thrown to indicate that a method has been invoked at an illegal or inappropriate time.|
|🅵|[IncompatibleClassChangeError](https://docs.oracle.com/javase/8/docs/api/java/lang/IncompatibleClassChangeError.html)|Thrown when an incompatible class change has occurred to some class definition.|
|🅵|[IndexOutOfBoundsException](https://docs.oracle.com/javase/8/docs/api/java/lang/IndexOutOfBoundsException.html)|Thrown to indicate that an index of some sort (such as to an array, to a string, or to a vector) is out of range.|
|🅵|[LinkageError](https://docs.oracle.com/javase/8/docs/api/java/lang/LinkageError.html)|Subclasses of LinkageError indicate that a class has some dependency on another class; however, the latter class has incompatibly changed after the compilation of the former class.|
|🅵|[NegativeArraySizeException](https://docs.oracle.com/javase/8/docs/api/java/lang/NegativeArraySizeException.html)|Thrown if an application tries to create an array with negative size.|
|🅵|[NoSuchMethodError](https://docs.oracle.com/javase/8/docs/api/java/lang/NoSuchMethodError.html)|Thrown when a particular method cannot be found.|
|🅵|[NullPointerException](https://docs.oracle.com/javase/8/docs/api/java/lang/NullPointerException.html)|Thrown when an application attempts to use null in a case where an object is required.|
|🅵|[NumberFormatException](https://docs.oracle.com/javase/8/docs/api/java/lang/NumberFormatException.html)|Thrown to indicate that the application has attempted to convert a string to one of the numeric types, but that the string does not have the appropriate format.|
|🅵|[OutOfMemoryError](https://docs.oracle.com/javase/8/docs/api/java/lang/OutOfMemoryError.html)|Thrown when the Java Virtual Machine cannot allocate an object because it is out of memory, and no more memory could be made available by the garbage collector.|
|🅵|[RuntimeException](https://docs.oracle.com/javase/8/docs/api/java/lang/RuntimeException.html)|RuntimeException is the superclass of those exceptions that can be thrown during the normal operation of the Java Virtual Machine.|
|🅵|[Throwable](https://docs.oracle.com/javase/8/docs/api/java/lang/Throwable.html)|The Throwable class is the superclass of all errors and exceptions in the Java language.|
|🅵|[UnsupportedOperationException](https://docs.oracle.com/javase/8/docs/api/java/lang/UnsupportedOperationException.html)|Thrown to indicate that the requested operation is not supported.|
|🅵|[VirtualMachineError](https://docs.oracle.com/javase/8/docs/api/java/lang/VirtualMachineError.html)|Subclasses of VirtualMachineError are thrown when the Java Virtual Machine is broken or has run out of resources necessary for it to continue operating.|
