# Ported Types of java.io

This page lists the java.io types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[Closeable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Closeable.html)|A Closeable is a source or destination of data that can be closed.|
|🅵|[Flushable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Flushable.html)|A Flushable is a destination of data that can be flushed.|
|🅵|[Serializable](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Serializable.html)|Serializability of a class is enabled by the class implementing the java.io.Serializable interface.

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[BufferedOutputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/BufferedOutputStream.html)|The class implements a buffered output stream.|
|🅵|[BufferedReader](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/BufferedReader.html)|Reads text from a character-input stream, buffering characters so as to provide for the efficient reading of characters, arrays, and lines.|
|🅵|[BufferedWriter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/BufferedWriter.html)|Writes text to a character-output stream, buffering characters so as to provide for the efficient writing of single characters, arrays, and strings.|
|🅂|[Console](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Console.html)|Methods to access the character-based console device, if any, associated with the current Java virtual machine.|
|🅵|[File](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/File.html)|An abstract representation of file and directory path names.|
|🅵|[FileDescriptor](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileDescriptor.html)|Instances of the FileDescriptor class serve as an opaque handle to the underlying machine-specific structure representing an open file, an open socket, or another source or sink of bytes.|
|🅵|[FileInputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileInputStream.html)|FileInputStream obtains input bytes from a file in a file system.|
|🅵|[FileOutputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileOutputStream.html)|A file output stream is an output stream for writing data to a File or to a FileDescriptor.|
|🅵|[FileReader](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileReader.html)|Reads text from character files using a default buffer size.|
|🅵|[FileWriter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileWriter.html)|Writes text to character files using a default buffer size.|
|🅵|[FilterOutputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FilterOutputStream.html)|This class is the superclass of all classes that filter output streams.|
|🅵|[InputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/InputStream.html)|This abstract class is the superclass of all classes representing an input stream of bytes.|
|🅵|[InputStreamReader](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/InputStreamReader.html)|An InputStreamReader is a bridge from byte streams to character streams: It reads bytes and decodes them into characters using a specified charset.|
|🅵|[OutputStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/OutputStream.html)|This abstract class is the superclass of all classes representing an output stream of bytes.|
|🅵|[OutputStreamWriter](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/OutputStreamWriter.html)|An OutputStreamWriter is a bridge from character streams to byte streams: It writes characters and translates them into bytes using a specified charset.|
|🅵|[PrintStream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/PrintStream.html)|A PrintStream adds functionality to another output stream, namely the ability to print representations of various data values conveniently.|
|🅵|[Reader](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Reader.html)|Abstract class for reading character streams.|
|🅵|[StringReader](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/StringReader.html)|A character stream whose source is a string.|
|🅵|[Writer](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/Writer.html)|Abstract class for writing character streams.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[FileNotFoundException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/FileNotFoundException.html)|Signals that an attempt to open the file denoted by a specified pathname has failed.|
|🅵|[IOException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/IOException.html)|Signals that an I/O exception of some sort has occurred.|
|🅵|[InvalidClassException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/InvalidClassException.html)|Thrown when the Serialization runtime detects one of the following problems with a Class.|
|🅵|[ObjectStreamException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/ObjectStreamException.html)|Superclass of all exceptions specific to Object Stream classes.|
|🅵|[UnsupportedEncodingException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/io/UnsupportedEncodingException.html)|The Character Encoding is not supported.|
