/*
 * This file is released under the MIT license.
 * Copyright (c) 2023, Mike Lischke
 *
 * See LICENSE-MIT.txt file for more info.
 */

import { final } from "../../../Decorators";
import { JavaString } from "../../lang/String";
import { JavaObject } from "../../lang/Object";
import { URI } from "../../net";
import { FileSystems } from "./FileSystems";
import { Path } from "./Path";

@final
export class Paths extends JavaObject {
    public static get(path: JavaString | URI): Path {
        if (path instanceof URI) {
            return FileSystems.getDefault().getPath(new JavaString(path.toString()));
        }

        return FileSystems.getDefault().getPath(path);
    }

}
