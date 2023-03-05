# Ported Types of java.text

This page lists the java.text types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[AttributedCharacterIterator](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/AttributedCharacterIterator.html)|An `AttributedCharacterIterator` allows iteration through both text and related attribute information.|
|🅵|[CharacterIterator](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/CharacterIterator.html)|This interface defines a protocol for bidirectional iteration over text.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[DateFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DateFormat.html)|`DateFormat` is an abstract class for date/time formatting subclasses which formats and parses dates or time in a language-independent manner.|
|🅂|[DateFormatSymbols](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DateFormatSymbols.html)|`DateFormatSymbols`  is a public class for encapsulating localizable date-time formatting data, such as the names of the months, the names of the days of the week, and the time zone data.|
|🅂|[FieldPosition](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/FieldPosition.html)|`FieldPosition` is a simple class used by `Format` and its subclasses to identify fields in formatted output.|
|🅵|[Format](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/Format.html)|`Format` is an abstract base class for formatting locale-sensitive information such as dates, messages, and numbers.|
|🅵|[ParsePosition](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/ParsePosition.html)|`ParsePosition` is a simple class used by `Format` and its subclasses to keep track of the current position during parsing.|
|🅵|[SimpleDataFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/SimpleDateFormat.html)|`SimpleDateFormat` is a concrete class for formatting and parsing dates in a locale-sensitive manner.|

## Enum Summary

|Status|Class|Description|
|---|---|---|


## Exception Summary

|Status|Exception|Description|
|---|---|---|
