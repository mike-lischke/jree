[![Build & Test](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml/badge.svg?branch=master)](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml) [![](https://img.shields.io/badge/java-11-4c7e9f.svg)](http://java.oracle.com) [![Downloads](https://img.shields.io/npm/dw/jree?color=blue)](https://www.npmjs.com/package/jree)

# Java Runtime Environment Emulation

This module contains a subset of JRE classes ported to Typescript and serves as runtime for Typescript and Javascript code that need JRE classes. It's a [clean room](https://en.wikipedia.org/wiki/Clean_room_design) implementation, which means no Java code was used for the implementation. Everything was written from scratch, but the Java API was used as a reference. This allows to release the code under a permissive license (MIT) and to use it in any (including commercial) projects, in opposition to the GPL license of the original JRE.

## Installation and Use

Run

```bash
npm i jree
```

to install the package and then import the `java` root namespace from there. With that you can use a supported class via fully qualified names:

```typescript
import { java } from "jree";

const builder = new java.lang.StringBuilder();
builder.append(123);
```

You can also import a class directly from full path, but I recommend to stay with fully qualified identifiers. In addition to the JRE classes there's' some support code that might come in handy. See the [support readme](doc/support.md) for more details.

## Supported Java Classes

The JRE emulation is still work-in-progress and contains a mix of either fully or partially converted Java classes. It's not planned to convert the entire JRE, but over time more and more classes may be added (pull requests welcome!).

See the [Types List](doc/jre.md) for the currently implemented classes.

## Environments

The JREE runs in both, Node.js and a browser. Certain classes use Node.js code currently (e.g. file system or path). The System class imports dependencies dynamically and fills its properties either from the browser environment or Node.js. The File class, however, cannot be used in a browser. Solve this by using a bundler like `rollup.js` or `Webpack`. That should tree-shake this class out or you can provide a shim for the used node package for the bundling process.

## Development and Contribution

The development process used in this repo is pretty simple. There are a number NPM scripts for building, linting and testing the classes. Run `npm run build` to have typescript create the `output` folder as it is used in the node module. Execute `npm run test-coverage` to run all unit tests and print some coverage info. Coverage is currently pretty low, so this is in area where some work needs to go into.

Adding new classes to this repository is described in more detail in [How To Add](doc/how-to-add.md).
