# Ported Types of java.nio

This page lists the java.nio types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[Buffer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/Buffer.html)|A container for data of a specific primitive type.|
|🅵|[ByteBuffer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/ByteBuffer.html)|A byte buffer.|
|🅵|[ByteOrder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/ByteOrder.html)|A typesafe enumeration for byte orders.|
|🅵|[CharBuffer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/CharBuffer.html)|A char buffer.|
|🅵|[IntBuffer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/IntBuffer.html)|An int buffer.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[BufferOverflowException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/BufferOverflowException.html)|Unchecked exception thrown when a relative <i>put</i> operation reaches the target buffer's limit.|
|🅵|[BufferUnderflowException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/BufferUnderflowException.html)|Unchecked exception thrown when a relative *get* operation reaches the source buffer's limit.|
|🅵|[InvalidMarkException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/InvalidMarkException.html)|Unchecked exception thrown when an attempt is made to reset a buffer's position to a mark that is not defined.|
|🅵|[ReadOnlyBufferException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/ReadOnlyBufferException.html)|Unchecked exception thrown when a relative *put* operation is performed upon a read-only buffer.|
