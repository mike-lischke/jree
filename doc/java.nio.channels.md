# Ported Types of java.nio.channels

This page lists the java.nio.channels types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[ByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/ByteChannel.html)|A channel that can read and write bytes.|
|🅵|[Channel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/Channel.html)|A nexus for I/O operations.|
|🅵|[GatheringByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/GatheringByteChannel.html)|A channel that can write bytes from a sequence of buffers.|
|🅵|[InterruptibleChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/InterruptibleChannel.html)|A channel that can be asynchronously closed and interrupted.|
|🅵|[ReadableByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/ReadableByteChannel.html)|A channel that can read bytes.|
|🅵|[ScatteringByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/ScatteringByteChannel.html)|A channel that can read bytes into a sequence of buffers.|
|🅵|[SeekableByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/SeekableByteChannel.html)|A byte channel that maintains a current position and allows the position to be changed.|
|🅵|[WritableByteChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/WritableByteChannel.html)|A channel that can write bytes.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅿|[Channels](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/Channels.html)|Utility methods for channels and streams.|
|🅵|[FileChannel](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/FileChannel.html)|A channel for reading, writing, mapping, and manipulating a file.|

## Enum Summary

|Status|Class|Description|
|---|---|---|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[ClosedChannelException](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/ClosedChannelException.html)|Checked exception thrown when an attempt is made to invoke or complete an I/O operation upon channel that is closed, or at least closed to that operation.|
|🅵|[NonReadableChannelException](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/NonReadableChannelException.html)|Unchecked exception thrown when an attempt is made to read from a channel that was not originally opened for reading.|
|🅵|[NonWritableChannelException](https://docs.oracle.com/javase/8/docs/api/java/nio/channels/NonWritableChannelException.html)|Unchecked exception thrown when an attempt is made to write to a channel that was not originally opened for writing.|
