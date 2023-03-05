# Ported Types of java.util.regex

This page lists the java.util.regex types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[MatchResult](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/MatchResult.html)|The result of a match operation.|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅿|[Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html)|An engine that performs match operations on a character sequence by interpreting a Pattern.|
|🅿|[Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)|A compiled representation of a regular expression.|

## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[PatternSyntaxException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/PatternSyntaxException.html)|Unchecked exception thrown to indicate a syntax error in a regular-expression pattern.|
