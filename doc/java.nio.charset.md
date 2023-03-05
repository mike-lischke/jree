# Ported Types of java.nio.charsets

This page lists the java.nio.charset types that are currently in this Node package. The notation used for the current status is as follows:

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
|🅿|[Charset](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/Charset.html)|A named mapping between sequences of sixteen-bit Unicode characters and sequences of bytes.|
|🅵|[CharsetDecoder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/CharsetDecoder.html)|An engine that can transform a sequence of bytes in a specific charset into a sequence of sixteen-bit Unicode characters.|
|🅵|[CharsetEncoder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/CharsetEncoder.html)|An engine that can transform a sequence of sixteen-bit Unicode characters into a sequence of bytes in a specific charset.|
|🅵|[CoderResult](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/CoderResult.html)|A description of the result state of a coder.|
|🅵|[CodingErrorAction](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/CodingErrorAction.html)|A typesafe enumeration for coding-error actions.|
|🅵|[StandardCharsets](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/StandardCharsets.html)|Constant definitions for the standard Charsets.|

## Enum Summary

|Status|Class|Description|
|---|---|---|


## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[CharacterCodingException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/CharacterCodingException.html)|Checked exception thrown when a character encoding or decoding error occurs.|
|🅵|[IllegalCharsetNameException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/IllegalCharsetNameException.html)|Unchecked exception thrown when a string that is not a legal charset name is used as such.|
|🅵|[MalformedInputException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/MalformedInputException.html)|Checked exception thrown when an input byte sequence is not legal for given charset, or an input character sequence is not a legal sixteen-bit Unicode sequence.|
|🅵|[UnmappableCharacterException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/nio/charset/UnmappableCharacterException.html)|Checked exception thrown when an input character (or byte) sequence is valid but cannot be mapped to an output byte (or character) sequence.|
