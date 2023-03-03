/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/**
 * Represents an operation that accepts a single input argument and returns no result. Unlike most other functional
 * interfaces, {@code Consumer} is expected to operate via side-effects.
 */
export interface Consumer<T> {
    /**
     * Performs this operation on the given argument.
     *
     * @param t the input argument
     */
    accept: (t: T) => void;
}

export class Consumer<T> {
    /**
     * Returns a {@code Consumer} that wraps the given operation
     *
     * @param accept the operation to perform when the Consumer's accept method is called.
     *
     * @returns a {@code Consumer} that performs the given operation on the given argument
     */
    public static create<T>(accept: (t: T) => void): Consumer<T> {
        return new class extends Consumer<T> {
            public override accept = (t: T) => { accept(t); };
        }();
    }

    /**
     * Returns a composed {@code Consumer} that performs, in sequence, this operation followed by the {@code after}
     * operation.
     *
     * @param after the operation to perform after this operation
     *
     * @returns a composed {@code Consumer} that performs in sequence this operation followed by the {@code after}
     *         operation
     *
     * Implementation note: this implements the default method of the {@link Consumer} interface.
     */
    public andThen(after: Consumer<T>): Consumer<T> {
        return Consumer.create<T>((t: T) => {
            this.accept(t);
            after.accept(t);
        });
    }
}
