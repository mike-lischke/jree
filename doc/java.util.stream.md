# Ported Types of java.util.stream

This page lists the java.util.stream types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[BaseStream<T, ​S extends BaseStream<T, ​S>>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/BaseStream.html)|Base interface for streams, which are sequences of elements supporting sequential and parallel aggregate operations.|
|🅂|[IntStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/IntStream.html)|A sequence of primitive int-valued elements supporting sequential and parallel aggregate operations.|

## Class Summary

|Status|Class|Description|
|---|---|---|


## Enum Summary

|Status|Class|Description|
|---|---|---|
