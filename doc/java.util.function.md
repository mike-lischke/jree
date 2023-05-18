# Ported Types of java.util.function

Functional interfaces in Java are primarily defined by their ability to use a single method as a lambda expression. Since this is not possible in Typescript, it is usually necessary to call the otherwise implicit method explicitly.

This page lists the java.util.function types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[BiConsumer\<T,U>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/BiConsumer.html)|Represents an operation that accepts two input arguments and returns no result.|
|🅵|[Consumer\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/Consumer.html)|Represents an operation that accepts a single input argument and returns no result.|
|🅵|[Function\<T, R>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/Function.html)|Represents a function that accepts one argument and produces a result.|
|🅵|[IntBinaryOperator](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/IntBinaryOperator.html)|Represents an operation upon two {@code int}-valued operands and producing an {@code int}-valued result.|
|🅵|[IntUnaryOperator](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/IntUnaryOperator.html)|Represents an operation on a single {@code int}-valued operand that produces an {@code int}-valued result.|
|🅵|[Predicate\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/Predicate.html)|Represents a predicate (boolean-valued function) of one argument.|
|🅵|[Supplier\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/Supplier.html)|Represents a supplier of results.|
|🅵|[UnaryOperator\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/function/UnaryOperator.html)|Represents an operation on a single operand that produces a result of the same type as its operand.|
