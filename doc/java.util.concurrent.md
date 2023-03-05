# Ported Types of java.concurrent

Because Typescript does not support concurrent execution that could be synchronized, the synchronization functionality of Java in this emulation consists solely of skeletons without any functionality. Only interfaces and exceptions can be considered fully converted.

This page lists the java.concurrent types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|


## Class Summary

|Status|Class|Description|
|---|---|---|
|🅂|[CopyOnWriteArrayList\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/CopyOnWriteArrayList.html)|A thread-safe variant of ArrayList in which all mutative operations (add, set, and so on) are implemented by making a fresh copy of the underlying array.|

## Enum Summary

|Status|Class|Description|
|---|---|---|


## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[CancellationException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/concurrent/CancellationException.html)|Exception indicating that the result of a value-producing task, such as a FutureTask, cannot be retrieved because the task was cancelled.|
