# Additional Functionality

The JREE package provides some support code for your use that is not part of the JRE. This document describes what you can use. All the additional code can be found in the [src/ folder](.src), side-by-side to the `java` root folder. You can import helper classes and functions with the same import used to load the `java` root namespace.

```javascript
import { java, S } from "jree";

const builder = new java.lang.StringBuilder();
builder.append(S`A Java String`);
```

## String Templates

To ease working with Java primitive wrapper types like `java.lang.String` or `java.lang.Long` there are a number of string templates, each using a single upper case letter that corresponds to the wrapper class they create.

- `S`: creates a `java.lang.String` instance from a string literal, like
```typescript
const s = S`A string literal`;.
```
- `I`: creates a `java.lang.Integer` instance from either a string literal or a number literal. like
```typescript
const i1 = I`567`; // Using a string literal (i1 is of type java.lang.Integer).
const i2 = I`${890}`; // Using a number literal (i1 is of type java.lang.Integer).
```

- `B`: creates a `java.lang.Boolean` instance from either a string literal or a boolean literal, like
```typescript
const b1 = I`true`;
const b2 = I`${false}`;
```

More such templates will be added in the future, for primitive types like long, float, double etc.

## Comparator

Java, in opposition to Typescript, uses object equality  by default, that is, objects are compared by their values, not their references. Two different instances are considered equal, if their properties are the same, with this concept. The `jree` package comes with the `JavaEqualityComparator` interface, which describes the general contract used by Java and a default implementation for that (`DefaultJavaEqualityComparator`). This default should however only be considered a starting point, as it uses hash codes internally for comparison. But while it is true that equal object must produce the same hash code, it is not true that the same hash code always denotes equal objects (consider hash collisions). So, a class should always implement it's own `equals` and `hashCode` methods for correct comparisons.

## Iterators

To ease mixing Java iterators and Typescript iterators there's a helper class called `JavaIterator` which wraps a TS iterator and can be used in places where a Java iterator is expected (usually when `hasNext()` is required). This wrapper does not support removing elements during an iteration.

## Hashing

There's an implementation of the [MurmurHash3](https://en.wikipedia.org/wiki/MurmurHash) algorithm as a helper to generate hash codes for your custom classes. This implementation is heavily used in the JREE as well. The typical use is like this:

```typescript
import { MurmurHash } from "jree";

class MyClass {
    #name = "MyClass";
    #ordinal = 1;

    public hashCode(): number {
        let result = MurmurHash.initialize(37);
        result = MurmurHash.update(result, this.#name);
        result = MurmurHash.update(result, this.#ordinal);

        return MurmurHash.finish(result, 2);
    }
}
```

## Miscellaneous

- `codePointsToString`: converts a list of Unicode code points (given as `Uint32Array`) to a Typescript `string`.
- `charCodesToString`: converts a list of character codes (given as `Uint16Array`) to a Typescript `string`.
- `IEquatable`: an interface that defines the contract for equatable objects.
- `IComparable`: an interface that defines the contract for comparable objects.
