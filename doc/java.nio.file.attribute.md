# Ported Types of java.nio.file.attribute

This page lists the java.file.nio.attribute types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[AttributeView](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/AttributeView.html)|An attribute view that is a read-only or updatable view of non-opaque values associated with a file in a filesystem.|
|🅵|[FileAttribute\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/FileAttribute.html)|An object that encapsulates the value of a file attribute that can be set atomically when creating a new file or directory by invoking the `createFile` or `createDirectory` methods.|
|🅵|[FileAttributeView](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/FileAttributeView.html)|An attribute view that provides a read-only or updatable view of non-opaque values associated with a file in a file system.|
|🅵|[FileStoreAttributeView](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/FileStoreAttributeView.html)|An attribute view that is a read-only or updatable view of the attributes of a `FileStore`.|
|🅵|[GroupPrincipal](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/GroupPrincipal.html)|A `GroupPrincipal` represents a *group identity*, used to determine access rights to objects in a file system.|
|🅵|[UserPrincipal](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/UserPrincipal.html)|A Principal representing an identity used to determine access rights to objects in a file system.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[PosixFilePermissions](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/PosixFilePermissions.html)|This class consists exclusively of static methods that operate on sets of `PosixFilePermission` objects.|
|🅵|[UserPrincipalLookupService](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/UserPrincipalLookupService.html)|An object to lookup user and group principals by name.|

## Enum Summary

|Status|Class|Description|
|---|---|---|
|🅵|[PosixFilePermission](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/attribute/PosixFilePermission.html)|Defines the bits for use with the permissions attribute.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
