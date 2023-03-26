/*
 * Copyright (c) Mike Lischke. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { JavaString } from "../../lang/String";
import { JavaObject } from "../../lang/Object";
import { URI } from "../../net";
import { FileSystems } from "./FileSystems";
import { Path } from "./Path";

export class Paths extends JavaObject {
    public static get(path: JavaString | URI): Path {
        if (path instanceof URI) {
            return FileSystems.getDefault().getPath(new JavaString(path.toString()));
        }

        return FileSystems.getDefault().getPath(path);
    }

}
