/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { JavaString } from "../../lang/String.js";
import { JavaObject } from "../../lang/Object.js";
import { URI } from "../../net/URI.js";
import { FileSystems } from "./FileSystems.js";
import { Path } from "./Path.js";

export class Paths extends JavaObject {
    public static get(path: JavaString | URI): Path {
        if (path instanceof URI) {
            return FileSystems.getDefault().getPath(new JavaString(path.toString()));
        }

        return FileSystems.getDefault().getPath(path);
    }

}
