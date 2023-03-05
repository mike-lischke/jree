# Ported Types of java.nio.file

This page lists the java.nio.file types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[CopyOption](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/CopyOption.html)|An object that configures how to copy or move a file.|
|🅵|[OpenOption](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/OpenOption.html)|An option to configure how to open or create a file.|
|🅵|[Path](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Path.html)|An object that may be used to locate a file in a file system.|
|🅵|[PathMatcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/PathMatcher.html)|An object that performs match operations on paths.|
|🅿|[WatchEvent\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/WatchEvent.html)|An event or a repeated event for an object that is registered with a `WatchService`.|
|🅿|[WatchKey](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/WatchKey.html)|A token representing the registration of a `Watchable` object with a `WatchService`.|
|🅿|[WatchService](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/WatchService.html)|A watch service that is used to watch objects for changes and events.|
|🅿|[Watchable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Watchable.html)|An object that may be registered with a watch service so that it can be watched for changes and events.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅂|[FileStore](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/FileStore.html)|Storage for files.|
|🅵|[FileSystem](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/FileSystem.html)|Provides an interface to a file system and is the factory for objects to access files and other objects in the file system.<br/>**Note**: the `FileSystem` class is an abstract class with all members defined, the actually implementation, however, is only partial.|
|🅿|[FileSystems](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/FileSystems.html)|Factory methods for file systems.|
|🅿|[Files](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Files.html)|Defines the methods to operate on files, directories, and other types of files.|
|🅿|[Paths](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/Paths.html)|This class consists exclusively of static methods that operate on files, directories, or other types of files.|

## Enum Summary

|Status|Class|Description|
|---|---|---|
|🅵|[StandardOpenOption](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/file/StandardOpenOption.html)|Defines the standard open options.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
