# Feature Details <!-- omit from toc -->

## Table of contents <!-- omit from toc -->

- [Introduction](#introduction)
- [Generics and Type Wildcards](#generics-and-type-wildcards)
- [Iterators](#iterators)
- [Implicit Nullability, the `null`, and undefined values](#implicit-nullability-the-null-and-undefined-values)
- [Numbers](#numbers)
- [Text](#text)
  - [Char and String](#char-and-string)
  - [Encoding and Decoding](#encoding-and-decoding)
- [Boxing and Unboxing](#boxing-and-unboxing)
- [Regular Expressions](#regular-expressions)
- [Functional Interfaces](#functional-interfaces)
- [Containers and Equality](#containers-and-equality)
- [Buffers](#buffers)
- [Reflection](#reflection)
- [System Properties](#system-properties)
- [Others](#others)
- [Unsupported Features](#unsupported-features)
  - [Asynchronous File Operations](#asynchronous-file-operations)
  - [Memory Mapped Files](#memory-mapped-files)


## <a name="introduction">Introduction</a>

The JRE Emulation package in this repository provides the foundation for converted Java classes, by provided the same APIs as their Java counterparts. From a syntax standpoint are Java and Typescript very similar, which will help Java developers to get used to the JREE and to find help in the Java docs, if needed. Of course there are also some differences, most prominently: method overloading.

Both Java and TypeScript have a number of classes with the same name, for example `String`, `Object` and `Iterator`. To avoid confusion and import problems all these classes have got a `Java` prefix (e.g. `JavaString`). However, you can still use the fully qualified form, e.g. `java.lang.String` instead.

> Note: this document only speaks of TypeScript as target language, but it should be clear that many concepts stem from JavaScript, even if not mentioned explicitly.

## <a name="generics">Generics and Type Wildcards</a>

Because Typescript does not support them, you will not find any API with lower bounded type parameters or wildcard captures. Other type parameters are fully supported (e.g. `compare<T>` and `compare<U extends T>`).

## <a name="iterators">Iterators</a>

Both the `Iterator` and the `Iterable` interfaces are supported in Java as well as in TypeScript. However, the `Iterator` interface in Java supports additional functionality (namely the mandatory `hasNext()` and optional `remove()` methods), which is not available in TypeScript. For this reason an own implementation is used instead, but that supports the `Iterable` interface, to allow direct translation of `for` loops with iterable objects.

## <a name="nullability">Implicit Nullability, the `null`, and undefined values</a>

In Java every non-primitive type can implicitly be `null`, which is not the case in TypeScript. You either have to use an explicit union type (e.g. `let x: java.lang.String | null`) or must assign a value.

And since Java doesn't know the concept of undefined values (they always have a default value, like `null`), `undefined` is not used either in the JREE. Instead `null` is used everywhere to indicate unassigned/missing values.

## <a name="numbers">Numbers</a>

### <a name="single-numbers">Single Numbers</a>

Typescript only knows 2 primitive number types: `number` and `bigint`. To ease working with APIs that use other number types there are type aliases in the JREE, like `long`, `int` etc. The `char` type mentioned below is another example of such a type alias. Under the hood still `number` is used (or `bigint` in case of `long`) and you should be aware that under certain conditions precision loss can occur (e.g. when using large double numbers).

> There's currently no support for `BigInteger` and `BigNumber`;

Both languages support automatic conversion between number literals and number classes. Unfortunately this is only partially supported for the Java number classes (e.g. `java.lang.Long`). Instances of such number classes can automatically return their primitive value via primitive type coercion, but there's automatism the other way around. Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing) for more details.

### <a name="numbers-arrays">Number Arrays</a>

As mentioned in the previous chapter the choice of usable number types is pretty small, for single number values. When stored in arrays the situation is much better. TypeScript knows many [typed arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays). This allows to store arrays of primitive numbers with the correct precision and type. There are arrays with signed and unsigned numbers, either 8, 16, 32 and 64 bits wide, and so on.

If you are in need of a specific number type that cannot be represented in a single `number` value, use a single entry type entry of the appropriate array type instead (e.g. for complex bit manipulation).

## <a name="text>Text</a>

### <a name="string">Char and String</a>

Strings in Java and TypeScript are also pretty similar. Like for numbers also string literals and String objects are automatically converted, but there's no automatic conversion for TypeScript string literals to `java.lang.String`. Getting the primitive string from such an object automatically is possible, but not auto boxing. Read also the [Boxing and Unboxing chapter](#boxing-and-unboxing) for more details.

In both languages strings are stored in UTF-16 (two bytes per character) and use surrogates for values > 0xFFFF. However, there's no simple `char` type in TypeScript, so we can only use `number` for it. To better distinguish a char type from an ordinary number a type alias is used in TypeScript (`char`) for any occurrence of a single `char` (and uses a number as base type, with only the lowest 16 bits). However, using a number for a char is all but optimal, so arrays of chars are converted to `Uint16Array` instead, which should be as efficient as the Java implementation.

### <a name="coding">Encoding and Decoding</a>

The classes `java.nio.charset.Charset`, `java.nio.charset.CharsetEncoder` and `java.nio.charset.CharsetDecoder` are mostly supported by using the `TextEncoder` and `TextDecoder` classes from the browser. With this a large number of charsets are available for decoding. Unfortunately, the `TextEncoder` class does not support encoding to a specific charset, so only UTF-8 is supported for encoding.

Java internally uses [ICU](https://icu.unicode.org/) to provide the full Unicode functionality, including retrieval of character classes for strings and characters. For TypeScript this requires a 3rd party package and currently not all Java APIs (especially in `java.lang.Character`) are implemented yet.

## <a name="boxing">Boxing and Unboxing</a>

Boxing describes the effect of wrapping a primitive value in an object for additional functionality, while unboxing describes the opposite way. Both Java and Typescript support a number of auto boxing and unboxing scenarios.

Automatic wrapping of a primitive value is typically done when assigning a literal or simple value to an object type, or when calling a method on a literal (like `"abc".length`).

Automatic unboxing, on the other hand, is used when primitive values are needed in an expression.

In translated Java source code only automatic unboxing is supported (via [primitive type coercion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_coercion)). By default the `.toString()` method is used to convert any of the Java objects to a primitive value (a string). Certain classes override `[Symbol.toPrimitive]` and return another primitive value (e.g. boolean or number) instead.

With that in place you can use such objects mostly like in Java, for example:

```typescript
const b = new java.lang.StringBuilder("def");
console.log("abc" + b);
```

which prints `abcdef`.

For boxing a different approach is used: [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates), which unfortunately is not automatic. It's merely a convenience feature that helps to lower manual work on converted code. The java2ts support library contains a number of tagged templates for various primitive types, all named with a single capital letter, according to the object type they create.

```typescript
const s = S`def`; // s is of type java.lang.String
console.log("abc" + s);
```

which prints `abcdef`. Or for numbers:

```typescript
const i1 = I`567`; // Using a string literal.
const i2 = I`${890}`; // Using a number literal.
console.log(1 + i1 + i2);
```

which prints `1458`. Unfortunately, the typescript compiler issues an error for the console call, saying that you cannot add a number and an `Integer` type, which is plain wrong, because obviously this is valid JS code. You can work around this error either by using the unary `+` in addition to the binary operator, wrap the `Integer` instance in a TypeScript `Number`, cast the `Integer` objects to `any`, add a `.valueOf()` call to each object or suppress the error. See also this [years old Typescript issue](https://github.com/microsoft/TypeScript/issues/2361) about this matter.

If you use ESLint as your linter, you may want to disable two rules that get in the way with the described approach, which are [@typescript-eslint/restrict-template-expressions](https://typescript-eslint.io/rules/restrict-template-expressions) and [@typescript-eslint/restrict-plus-operands](https://typescript-eslint.io/rules/restrict-plus-operands).

The missing auto boxing of TypeScript literals to Java like objects is probably what creates most problems in converted code. To help with that all Java APIs that expect `java.lang.String` also accept a string literal (and hence also a TypeScript string object) instead.

## <a name="functional-interfaces">Functional Interfaces</a>

Functional interfaces are a pretty special language construct with some implications. Such interfaces are annotated to denote their special type (`@FunctionalInterface`) and have only a single abstract method that is executed in a lambda expression (closure) without explicitly mentioning it. As this is not supported in TypeScript, you have to make the call explicit in your code, if you need such an interface. For example:

```typescript
    public forEach(action: Consumer<T>): void {
        for (const item of this) {
            action.accept(item);
        }
    }
```

## <a name="regex">Regular Expressions</a>

TypeScript regular expressions do not support all features from Java regex, specifically these flags are not supported:

- Pattern.CANON_EQ
- Pattern.COMMENTS
- Pattern.LITERAL
- Pattern.UNIX_LINES

Just like for iterators, Java regular expressions are not converted to their native TypeScript variant, but converted like normal code, with a thin wrapper that satisfies the Java APIs, but uses native regular expressions under the hood.

## <a name="equality">Containers and Equality</a>

Containers (every class implementing `java.util.Set` or `java.util.Map`) require special attention. In Java these classes use **Object Equality** to locate elements. This approach not only compares objects by reference, but also uses their `equals()` method to compare them. This cannot only lead to deep comparisons, but also to equality of different instances, if they contain the same values. Comparison using the `equals` method is accompanied by the `hashCode` method, which returns a number that identifies that object as a single value. The general contract here is that objects which are considered equal **must**  generate the same hash code. However, there's no 1:1 matching: objects returning the same hash code are not always also equal (aka hash conflict).

The class `java.lang.Object` contains a default implementation for both methods, which uses **Identity Equality** (aka **Reference Equality**), both in Java and TypeScript. This is accomplished by comparing the memory address of two objects (which is guaranteed to be unique). The default hash code in TypeScript, in opposition, is a running number internally (as there's no way to get the memory address there). Classes that rely on object equality must override `equals` and `hashCode` and provide an own implementation. The JREE provides an implementation of the [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash) algorithm to provide hash codes for strings, arrays and primitive values.

## <a name="buffers">Buffers</a>

Buffers (like `lang.nio.CharBuffer` or `lang.nio.IntBuffer`) are implemented as specified in Java. However, there's no support for direct and indirect buffers. All buffers use `ArrayBuffer` as underlying storage structure, plus typed arrays (and `DataView` for byte buffers) as interface between the app and the back buffer.

## <a name="reflection">Reflection</a>

Support of reflection is very rudimentary. The class `java.lang.Object` has implementations for the static `.class` and the non-static `.getClass()` members. They can be used to get some information about a class, but you should use the `instanceof` operator for checking a specific class type.

## <a name="system-properties">System Properties</a>

System properties are supported just like in Java, and get their initial values from the current environment (either `navigator` or `os` and `process` Node JS modules). JVM, Java and JRE specific entries (see [java keys](https://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getProperties()) are filled with arbitrary values, e.g. matching the supported Java version of the JREE. Applications using such properties in generated code should replace the default values with something that matches their expected values.

## <a name="others">Others</a>

This chapter collects a few other things that are worth to be mentioned.

- `java.lang.Object.toString()` returns a Typescript string, not `java.lang.String` to avoid a circular dependency between the two classes.
- The same holds true for `java.lang.Class.getName()` and `java.lang.Class.getSimpleName()`.
- All classes deriving from `java.lang.Object` override the `toString()` method and return `java.lang.String`, however (if they support `toString` at all).

## <a name="unsupported">Unsupported Features</a>

There's no support for serialization, synchronization, threading and a security manager in the JREE. Currently it's also not possible to load modules dynamically (so concepts like the CLASSPATH) play no role here.

### <a name="async-file-operations">Asynchronous File Operations</a>

For the same reason (no threads) it is not possible to implement asynchronous file operations (interruptible channels etc.). All of these operations are either synchronous or not implemented (based on the Node.js fs module). This also means it is not possible to interrupt a file/channel operation or wait for it. Maybe at a later point we can use async file APIs to emulate these things.

### <a="memory-mapped-files>Memory Mapped Files</a>

Memory mapped files require support from a native package (Node.js does not support them and in a browser they are totally out of scope). Since I don't want to add such a dependency (like to [mmap](https://www.npmjs.com/package/mmap)) there's no support this feature.
