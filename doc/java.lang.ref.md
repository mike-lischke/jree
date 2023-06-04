# Ported Types of java.lang.ref

This page lists the java.lang.ref types that are currently in this Node package.

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅿|[Reference<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ref/Reference.html)|Abstract base class for reference objects.|
|🅿|[WeakReference<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/ref/WeakReference.html)|Weak reference objects, which do not prevent their referents from being made finalizable, finalized, and then reclaimed.|

## Class Summary

|Status|Class|Description|
|---|---|---|
