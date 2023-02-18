/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { List } from "immutable";

import { java, NotImplementedError, S } from "../..";
import { AbstractList } from "./AbstractList";
import { IListBackend } from "./ListIteratorImpl";

/**
 * The Vector class implements a growable array of objects. Like an array, it contains components that can be
 * accessed using an integer index. However, the size of a Vector can grow or shrink as needed to accommodate
 * adding and removing items after the Vector has been created.
 */
export class Vector<T> extends AbstractList<T>
    implements java.lang.Cloneable<Vector<T>>, java.util.RandomAccess, java.io.Serializable {

    protected capacityIncrement: number;
    protected elementCount = 0;

    public constructor();
    public constructor(initialCapacity: number);
    public constructor(initialCapacity: number, capacityIncrement: number);
    public constructor(c: java.util.Collection<T>);
    public constructor(...args: unknown[]) {
        let backend: IListBackend<T> | undefined;
        let increment = 0;

        switch (args.length) {
            case 0: {
                // Use default.
                break;
            }

            case 1: {
                if (typeof args[0] === "number") {
                    // Use default.
                } else {
                    const input = args[0] as java.util.Collection<T>;
                    backend = {
                        list: List(input),
                        start: 0,
                        end: input.size(),
                        updateEnd: (delta: number) => {
                            // Nothing to do here.
                        },
                    };
                }
                break;
            }

            case 2: {
                increment = args[1] as number;
                break;
            }

            default: {
                throw new java.lang.IllegalArgumentException(S`Wrong number of arguments`);
            }
        }

        super(backend);

        this.capacityIncrement = increment;
    }

    /**
     * Adds the specified component to the end of this vector, increasing its size by one.
     *
     * @param element the component to be added
     */
    public addElement(element: T): void {
        this.add(element);
    }

    /**
     * Returns the current capacity of this vector.
     *
     * @returns the current capacity (the length of its internal data array, kept private so as not to be
     *          modified by the user)
     */
    public capacity(): number {
        return this.size();
    }

    /**
     * Returns a clone of this Vector. The copy will contain a reference to a clone of the internal data array, not a
     * reference to the original internal data array of this Vector object.
     *
     * @returns a clone of this Vector
     */
    public clone(): Vector<T> {
        return this.createClone(Vector) as Vector<T>;
    }

    /**
     * Copies the components of this vector into the specified array.
     * The item at index k in this vector is copied into component k of the array.
     * The array must be big enough to hold all the objects in this vector, else an IndexOutOfBoundsException is thrown.
     * If the array is longer than the vector, the array element following the end of the collection is set to null.
     * This method is identical in functionality to the toArray() method (which is part of the Collection interface).
     *
     * @throws IndexOutOfBoundsException - if copying would cause access of data outside array bounds.
     * @throws NullPointerException - if the specified array is null.
     *
     * @param anArray the array into which the components get copied
     */
    public copyInto(anArray: T[]): void {
        if (anArray.length < this.size()) {
            throw new java.lang.IndexOutOfBoundsException();
        }

        this.copyToArray(anArray, 0);
    }

    /**
     * Returns the element at the specified position in this Vector.
     *
     * @param index the index of the element to return
     *
     * @returns the element at the specified position in this Vector
     */
    public elementAt(index: number): T | undefined {
        return this.get(index);
    }

    /**
     * Returns an enumeration of the components of this vector.
     */
    public elements(): java.util.Enumeration<T> {
        throw new NotImplementedError();
    }

    /**
     * Increases the capacity of this Vector, if necessary, to ensure that it can hold at least the number of components
     * specified by the minimum capacity argument.
     *
     * @param minCapacity the desired minimum capacity
     */
    public ensureCapacity(minCapacity: number): void {
        // Nothing to do here.
    }

    /**
     * Returns the first component (the item at index 0) of this vector.
     *
     * @returns the first component of this vector
     *
     * @throws NoSuchElementException - if this vector has no components
     */
    public firstElement(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.get(0);
    }

    /**
     * Inserts the specified object as a component in this vector at the specified index.
     *
     * @param element the element to insert
     * @param index the index at which the specified element is to be inserted
     */
    public insertElementAt(element: T, index: number): void {
        this.add(index, element);
    }

    /**
     * Returns the last component of the vector.
     * Throws a NoSuchElementException if this vector has no components.
     * This method is identical in functionality to the get method (which is part of the List interface).
     * This method exists in conjunction with the set method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @returns the last component of the vector
     */
    public lastElement(): T {
        if (this.size() === 0) {
            throw new java.util.NoSuchElementException();
        }

        return this.get(this.size() - 1);
    }

    /**
     * Removes all of the elements from this Vector.
     * The Vector will be empty after this call returns.
     * This method is identical in functionality to the clear method (which is part of the List interface).
     * This method exists in conjunction with the addElement method so that the Vector class can implement the
     * java.util.List interface.
     */
    public removeAllElements(): void {
        this.clear();
    }

    /**
     * Removes the first occurrence of the specified element from this Vector, if it is present.
     *
     * @param element the element to be removed from this Vector, if present
     *
     * @returns the element that was removed from the Vector
     */
    public removeElement(element: T): boolean {
        return this.remove(element);
    }

    /**
     * Removes the element at the specified position in this Vector.
     * Throws ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     *
     * @param index the index of the element to be removed
     */
    public removeElementAt(index: number): void {
        this.remove(index);
    }

    /**
     * Replaces each element of this list with the result of applying the operator to that element.
     *
     * @param operator the operator to apply to each element
     */
    public replaceAll(operator: java.util.function.UnaryOperator<T>): void {
        let index = 0;
        this.forEach(java.util.function.Consumer.create((value) => {
            this.set(index++, operator.apply(value));
        }));
    }

    /**
     * Sets the element at the specified position in this Vector to be the specified object.
     * The previous component at that position is discarded.
     * Throws an ArrayIndexOutOfBoundsException if the index is out of range (index < 0 || index >= size()).
     * This method is identical in functionality to the set method (which is part of the List interface).
     * Note that the set method reverses the order of the parameters, to more closely match array usage.
     * This method exists in conjunction with the get method so that the Vector class can implement the
     * java.util.List interface.
     *
     * @param element what the element is to be set to
     * @param index the index of the element to be modified
     */
    public setElementAt(element: T, index: number): void {
        this.set(index, element);
    }

    /**
     * Sets the size of this Vector.
     * If the new size is greater than the current size, new null items are added to the end of the Vector.
     * If the new size is less than the current size, all components at index newSize and greater are discarded.
     * Throws an ArrayIndexOutOfBoundsException if the new size is negative.
     *
     * @param newSize the new size of this Vector
     */
    public setSize(newSize: number): void {
        if (newSize < 0) {
            throw new java.lang.ArrayIndexOutOfBoundsException();
        }
    }

    /**
     * Trims the capacity of this Vector to be the vector's current size.
     * An application can use this operation to minimize the storage of a Vector instance.
     *
     */
    public trimToSize(): void {
        // Nothing to do here.
    }

    /**
     * Returns an array containing all of the elements in this Vector in the correct order. This array is derived from
     * the underlying array of the Vector and changes in it will not be reflected in the Vector.
     *
     * @returns an array containing all of the elements in this Vector in the correct order
     */
    protected get elementData(): T[] {
        return this.toArray();
    }
}
