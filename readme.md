[![Build & Test](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml/badge.svg?branch=master)](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml) [![Java 11](https://img.shields.io/badge/java-11-4c7e9f.svg)](http://java.oracle.com) [![Downloads](https://img.shields.io/npm/dw/jree?color=blue&logo=npm&style=for-the-badge)](https://www.npmjs.com/package/jree)

# Java Runtime Environment Emulation

This module contains a subset of JRE classes ported to Typescript and serves as runtime for Typescript and Javascript code that need JRE classes.

## Installation and Use

Run

```bash
npm i jree
```

to install the package and then import the `java` root namespace from there. With that you can use a supported class via fully qualified names:

```typescript
import { java } from "jree";

const builder = new java.lang.StringBuilder();
builder.append(123);
```

You can also import a class directly from full path, but I recommend to stay with fully qualified identifiers, especially in cases where Typescript classes with the same name exist (String, Number, Object).

In addition to the JRE classes there's' some support code that might come in handy. See the [support readme](doc/support.md) for more details.

## Supported Java Classes

The JRE emulation is still work-in-progress and contains a mix of either fully or partially converted Java classes. It's not planned to convert the entire JRE, but over time more and more classes may be added (pull requests welcome!).

Below is a list of the ported classes and their current status. The symbol 🅵 means the class is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization), while Ⓟ indicates a partial conversion. A third mark is used to indicate that a class is rather a placeholder (skeleton) and does not contain much code: 𝑺.

A second letter indicates the type: 𝑬 (Enum), 𝑪 (Class), 𝑰 (Interface). This is particularly important in cases where an interface had to be converted to an abstract class, as it contains initializer or implementation code. Sometimes a type exists also as class and as interface in Java.

In alphabetical order:

- *java*
  - *io*
    - 𝑰 🅵 AutoCloseable
    - 𝑪 🅵 BufferedOutputStream
    - 𝑪 🅵 BufferedReader
    - 𝑪 🅵 BufferedWriter
    - 𝑰 🅵 Closeable
    - 𝑪 Ⓟ Console
    - 𝑪 🅵 File
    - 𝑪 🅵 FileDescriptor
    - 𝑪 🅵 FileInputStream
    - 𝑪 Ⓟ FileNotFoundException
    - 𝑪 🅵 FileOutputStream
    - 𝑪 🅵 FileReader
    - 𝑪 🅵 FileWriter
    - 𝑪 🅵 FilterOutputStream
    - 𝑰 🅵 Flushable
    - 𝑪 Ⓟ IOException
    - 𝑪 🅵 InputStream
    - 𝑪 🅵 InputStreamReader
    - 𝑪 Ⓟ InvalidClassException
    - 𝑪 Ⓟ ObjectStreamException
    - 𝑪 🅵 OutputStream
    - 𝑪 🅵 OutputStreamWriter
    - 𝑪 🅵 PrintStream
    - 𝑪 🅵 Reader
    - 𝑰 🅵 Serializable
    - 𝑪 Ⓟ UnsupportedEncodingException
    - 𝑪 🅵 Writer
  - *lang*
    - 𝑰 🅵 Appendable
    - 𝑪 🅵 Boolean
    - 𝑪 🅵 CharSequence
    - 𝑪 Ⓟ Character
    - 𝑪 Ⓟ Class
    - 𝑪 CⓅ loneNotSupportedException
    - 𝑰 🅵 Cloneable
    - 𝑰 🅵 Comparable
    - 𝑪 🅵 Enum
    - 𝑪 Ⓟ Error
    - 𝑪 Ⓟ Exception
    - 𝑪 Ⓟ IllegalArgumentException
    - 𝑪 Ⓟ IllegalStateException
    - 𝑪 Ⓟ IncompatibleClassChangeError
    - 𝑪 Ⓟ IndexOutOfBoundsException
    - 𝑪 🅵 Integer
    - 𝑪 Ⓟ LinkageError
    - 𝑪 🅵 Long
    - 𝑪 Ⓟ NegativeArraySizeException
    - 𝑪 Ⓟ NoSuchElementException
    - 𝑪 Ⓟ NoSuchMethodError
    - 𝑪 Ⓟ NullPointerException
    - 𝑪 🅵 Number
    - 𝑪 Ⓟ NumberFormatException
    - 𝑪 🅵 Object
    - 𝑪 OutOfMemoryError
    - 𝑰 🅵 Readable
    - 𝑪 Ⓟ RuntimeException
    - 𝑪 🅵 StackTraceElement
    - 𝑪 Ⓟ String
    - 𝑪 🅵 StringBuffer
    - 𝑪 🅵 StringBuilder
    - 𝑪 Ⓟ System
    - 𝑪 🅵 Throwable
    - 𝑪 Ⓟ UnsupportedOperationException
    - 𝑪 Ⓟ VirtualMachineError
  - *nio*
    - 𝑪 🅵 Buffer
    - 𝑪 Ⓟ BufferOverflowException
    - 𝑪 Ⓟ BufferUnderflowException
    - 𝑪 🅵 ByteBuffer
    - 𝑪 🅵 ByteOrder
    - 𝑪 🅵 CharBuffer
    - 𝑪 🅵 IntBuffer
    - 𝑪 Ⓟ InvalidMarkException
    - 𝑪 Ⓟ ReadOnlyBufferException
    - *charset*
      - 𝑪 Ⓟ Charset
      - 𝑪 Ⓟ IllegalCharsetNameException
      - 𝑪 🅵 StandardCharsets
  - *util*
    - 𝑪 🅵 ArrayList
    - 𝑪 Ⓟ Arrays
    - 𝑪 🅵 BitSet
    - 𝑰 🅵 Collection
    - 𝑪 Ⓟ Collections
    - 𝑰 🅵 Comparator
    - 𝑰 🅵 Deque
    - 𝑪 🅵 HashMap
    - 𝑪 🅵 HashSet
    - 𝑪 🅵 IdentityHashMap
    - 𝑰 🅵 Iterator
    - 𝑪 🅵 LinkedHashMap
    - 𝑪 🅵 LinkedList
    - 𝑰 🅵 List
    - 𝑰 🅵 ListIterator
    - 𝑪 𝑺 Locale
    - 𝑰 🅵 Map
    - 𝑪 Ⓟ Objects
    - 𝑪 🅵 Properties
    - 𝑰 🅵 Queue
    - 𝑰 🅵 Set
    - 𝑪 𝑺 Stack
    - 𝑪 🅵 WeakHashMap
    - *concurrent*
      - 𝑪 Ⓟ CancellationException
      - 𝑪 𝑺 CopyOnWriteArrayList
    - *regex*
      - 𝑪 Ⓟ Matcher
      - 𝑪 Ⓟ Pattern

Exceptions must generally be considered to be only partially converted, because they do not contain the same error message like the ones in Java. Interfaces on the other hand only contain declarations, so they are always fully "implemented".

## Environments

The JREE runs both, in Node.js and in a browser. The classes `java.io.File` and `java.lang.System` are the only parts which uses Node.js code currently. The System class imports dependencies dynamically and fills its properties either from the browser environment or Node.js. The File class, however, cannot be used in a browser. Solve this by using a bundler like `rollup.js` or `Webpack`. That should tree-shake this class out or you can provide a shim for `path` and `fs` node modules for the bundling process.

## Development and Contribution

The development process used in this repo is pretty simple. There are a number NPM scripts for building, linting and testing the classes. Run `npm run build` to have typescript create the `output` folder as it is used in the node module. Execute `npm run test-coverage` to run all unit tests and print some coverage info. Coverage is currently pretty low, so this is in area where some work needs to go into.

Adding new classes to this repository is described in more detail in [How To Add](doc/how-to-add.md).
