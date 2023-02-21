/*
 * This file is released under the MIT license.
 * Copyright (c) 2021, 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */

/**
 * Marks a class as final. This will throw an error if the class is inherited from at runtime.
 *
 * @param target The class to mark as final.
 *
 * @returns The class with the final modifier.
 */
export const final = <T extends new (...args: any[]) => object>(target: T): T => {
    return class Final extends target {
        protected constructor(...args: any[]) {
            if (new.target !== Final) {
                throw new Error("Cannot inherit from final class");
            }

            super(...args);
        }
    };
};

/**
 * Marks a class as frozen.
 *
 * @param target The class to mark as frozen.
 */
export const frozen = (target: Function): void => {
    Object.freeze(target);
    Object.freeze(target.prototype);
};
