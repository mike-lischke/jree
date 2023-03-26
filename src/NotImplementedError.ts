/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

export class NotImplementedError extends Error {
    public constructor(message?: string) {
        super(message ?? "This feature has no implementation");
    }
}
