# Ported Types of java.util

This page lists the java.util types that are currently in this Node package. The notation used for the current status is as follows:

## Status Notation:
- 🅵 means the type is fully converted (excluding functionality which cannot be implemented in Typescript, like synchronization).
- 🅿 indicates a partial conversion, which means that the type is not fully converted, but it is usable.
- 🅂 describes a type that is a stub, i.e. a type that is not yet implemented and exists solely to satisfy another type.

## Interface Summary

|Status|Interface|Description|
|---|---|---|
|🅵|[Collection\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collection.html)|The root interface in the *collection hierarchy*.|
|🅵|[Comparator\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Comparator.html)|A comparison function, which imposes a *total ordering* on some collection of objects.|
|🅵|[Deque\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Deque.html)|A linear collection that supports element insertion and removal at both ends.|
|🅵|[Enumeration\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Enumeration.html)|An object that implements the Enumeration interface generates a series of elements, one at a time.|
|🅵|[Iterator\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Iterator.html)|An iterator over a collection.|
|🅵|[List\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/List.html)|An ordered collection (also known as a *sequence*).|
|🅵|[ListIterator\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ListIterator.html)|An iterator for lists that allows the programmer to traverse the list in either direction, modify the list during iteration, and obtain the iterator's current position in the list.|
|🅵|[Map\<K, V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Map.html)|An object that maps keys to values.|
|🅵|[Map.Entry\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Map.Entry.html)|A map entry (key-value pair).|
|🅵|[Queue\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Queue.html)|A collection designed for holding elements prior to processing.|
|🅵|[RandomAccess](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/RandomAccess.html)|Marker interface used by List implementations to indicate that they support fast (generally constant time) random access.|
|🅵|[SortedMap\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/SortedMap.html)|A map whose keys are sorted.|
|🅵|[Set\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Set.html)|A collection that contains no duplicate elements.|
|🅵|[Spliterator\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Spliterator.html)|An object for traversing and partitioning elements of a source..|

## Class Summary

|Status|Class|Description|
|---|---|---|
|🅵|[AbstractCollection\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/AbstractCollection.html)|This class provides a skeletal implementation of the Collection interface, to minimize the effort required to implement this interface.|
|🅵|[AbstractList\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/AbstractList.html)|This class provides a skeletal implementation of the List interface to minimize the effort required to implement this interface backed by a "random access" data store (such as an array).|
|🅵|[ArrayDeque\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayDeque.html)|Resizable-array implementation of the `Deque` interface.|
|🅵|[ArrayList\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/ArrayList.html)|Resizable-array implementation of the `List` interface.|
|🅵|[Arrays](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Arrays.html)|This class contains various methods for manipulating arrays (such as sorting and searching).|
|🅵|[BitSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/BitSet.html)|This class implements a vector of bits that grows as needed.|
|🅵|[Calendar](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Calendar.html)|A class to convert between a specific instant in time and a set of calendar fields such as `YEAR`, `MONTH`, `DAY_OF_MONTH`, `HOUR`, and so on, and for manipulating the calendar fields, such as getting the date of the next week.|
|🅿|[Collections](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Collections.html)|This class consists exclusively of static methods that operate on or return collections.|
|🅵|[Date](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Date.html)|The `Date` class represents a specific instant in time, with millisecond precision.|
|🅵|[HashMap\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashMap.html)|Hash table based implementation of the `Map` interface.|
|🅵|[HashSet\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashSet.html)|Hash table based implementation of the `Set` interface. Unlike the Java implementation, this class does **not** use a `HashMap` as backing implementation.|
|🅵|[IdentityHashMap\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/IdentityHashMap.html)|This class implements the Map interface, using reference-equality in place of object-equality when comparing keys (and values).|
|🅵|[LinkedHashMap\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashMap.html)|Hash table and linked list implementation of the `Map` interface, with predictable iteration order.|
|🅵|[LinkedHashSet\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedHashSet.html)|Hash table and linked list implementation of the `Set` interface, with predictable iteration order.|
|🅵|[LinkedList\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/LinkedList.html)|Doubly-linked list implementation of the `List` and `Deque` interfaces.|
|🅂|[Locale](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Locale.html)|A `Locale` object represents a specific geographical, political, or cultural region.|
|🅿|[Objects](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Objects.html)|This class consists of static utility methods for operating on objects, or checking certain conditions before operation.|
|🅿|[Optional\<T>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Optional.html)|A container object which may or may not contain a non-null value.|
|🅵|[Properties](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Properties.html)|The `Properties` class represents a persistent set of properties.|
|🅿|[Random](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Random.html)|An instance of this class is used to generate a stream of pseudorandom numbers.|
|🅵|[Stack\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Stack.html)|The `Stack` class represents a last-in-first-out (LIFO) stack of objects.|
|🅂|[TimeZone](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TimeZone.html)|A `TimeZone` object represents a time zone offset, and also figures out daylight savings.|
|🅵|[Vector\<E>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Vector.html)|The `Vector` class implements a growable array of objects.|
|🅵|[WeakHashMap\<K,V>](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/WeakHashMap.html)|Hash table based implementation of the `Map` interface, with *weak keys*.|

## Enum Summary

|Status|Class|Description|
|---|---|---|


## Exception Summary

|Status|Exception|Description|
|---|---|---|
|🅵|[EmptyStackException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/EmptyStackException.html)|Thrown by methods in the `Stack` class to indicate that the stack is empty.|
|🅵|[NoSuchElementException](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/NoSuchElementException.html)|Thrown by various accessor methods to indicate that the element being requested does not exist.|
