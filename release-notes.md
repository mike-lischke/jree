# Release Notes

## 1.3.0

- Improved documentation.
- Reworked some initialization code to avoid circular dependency errors at runtime. Started using type imports to help with that.
- Changed copyrights so they no longer include years. Instead there's a separate license file with that info.
- Bug fixes.

- Added AtomicBoolean, AtomicInteger, ClassCastException, StackoverflowError, IntBinaryOperator and IntUnaryOperator classes/interfaces.
- Enhanced Boolean, Integer and Long comparison methods to handle also primitive values.
- The Set<T> interface is now completely defined .
- Changed all functional interfaces to use a call signature, which makes it easier using closures as such an interface. No need for the creation functions anymore.
- Started adding null pointer exceptions for null parameters in certain places. More to come probably.
- Added a number of methods in some classes which are used in the tests.
- Made java.util.Comparator a real functional interface (alike).
- Added decorators for org.testng.annotation.Test and .DataProvider.
- Added more code for the TestNG functionality. That included extending the test decorators to support more parameters (description. enabled, timeout) and support of data providers.
- For better integration with Jest an own matcher was added to compare Java objects.
- Improved the TestNG decorators to accept expected exceptions and different data providers (arrays vs. iterators).
- Added java.lang.ref.Reference and java.lang.ref.WeakReference classes + documentation.
- Added java.util.function.BiFunction + documentation.
- Added java.lang.ArrayStoreException + documentation.
- Removed all java.lang.String references from java.lang.Throwable, as that created a (new) circular dependency (when some exception handling was added to the string class). Instead TS strings are used in Throwable.
- Added default methods of the java.util.Map interface + some more static methods.
- Added implementation for the @Override decorator.
- Added JDK HashMap unit tests.

## 1.2.2

A test release to troubleshoot a problem on npmjs.com.

## 1.2.1

Using type = "module" in package.json makes this node package using ESM, which in turn produces problems when importing it in other Node.js projects. Until Node and Jest fully support ESM we stay with CommonJS.

## 1.2.0

* Added new JDK classes.
* Changed all Uint8Array occurrences to Int8Array, because the byte type is signed in Java.
* More functionality in existing classes.
* Added type aliases for all primitive types, for use instead of number.
* Updated dependencies.
* All APIs that accept a java.lang.String now also accept a Typescript string, to ease usage.
* Started converting JDK tests suites to Typescript, to be used as unit tests for jree.

## 1.1.1

Transpiled examples and the test coverage are things that make no sense in the released package.

## 1.1.0

* Lots of changes in the package. Many new classes + interfaces added.
* Added some examples about how to use the package and how to debug individual parts.
* Also improved the documentation to better see what's implemented and to which degree (full/partial/skeleton).

## 1.0.0.-1.0.2

Initial Release

This is the initial release of the brand new JRE emulation layer. This was created out of the need for my java2typescript convert.
