[![Build & Test](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml/badge.svg?branch=master)](https://github.com/mike-lischke/jree/actions/workflows/nodejs.yml) [![](https://img.shields.io/badge/java-11-4c7e9f.svg)](http://java.oracle.com) [![Downloads](https://img.shields.io/npm/dw/jree?color=blue)](https://www.npmjs.com/package/jree)

# Java Runtime Environment Emulation

This module contains a subset of JRE classes ported to Typescript and serves as runtime for Typescript and Javascript code that need JRE classes. It's a [clean room](https://en.wikipedia.org/wiki/Clean_room_design) implementation, which means no Java code was used for the implementation. Everything was written from scratch, but the Java API documentation was used as a reference. This allows to release the code under a permissive license (MIT) and to use it in any (including commercial) projects, in opposition to the GPL license of the original JRE.

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

## Testing and Examples

### Unit Tests

The project comes with a number of unit tests. Currently the test coverage is pretty low, but it's a start. They can be executed with `npm run test-coverage`. For debugging a test open the JREE project in VS Code, open one of the spec files you want to debug, select the "Run current Jest test" launch config in the debugger view and start debugging. You can set breakpoints in the test code and in the JREE code.

### Examples

Additionally, there are some examples in the `examples` folder. These are not meant to be complete programs, but rather to show how to use the JREE in different scenarios, in a way that should look familiar to a Java developer. The are modelled after common Java sample programs.

To run an example in a terminal you have to install `ts-node` globally:

```bash
npm i -g ts-node
```

Then you can run the example with

```bash
ts-node src/runner examples/HelloWorld
```

The HelloWorld is also executable using the NPM script "hello-world":

```bash
npm run hello-world
```

Because of the way Typescript (Javascript) works and how the JRE is organized, there's no need to set a CLASSPATH or to compile anything. The JREE is a self-contained module that can be used in any project. The examples are just Typescript files that import the JREE and use it.

The runner script is a simple wrapper to load the given example (which must contain exactly one class with the typical `main()` method, and execute it. It can serve as a starting point for your own programs.

The examples do not require that the jree is installed, but work directly against the source code in this project. However, it's easy to see how they would work with the installed module.

## Supported Java Classes

The JRE emulation is still work-in-progress and contains a mix of either fully or partially converted Java classes. It's not planned to convert the entire JRE, but over time more and more classes may be added (pull requests welcome!).

See the [Types List](doc/jre.md) for the currently implemented classes.

## Environments

The JREE runs in both, Node.js and a browser. Certain classes use Node.js code currently (e.g. file system or path). The System class imports dependencies dynamically and fills its properties either from the browser environment or Node.js. The File class, however, cannot be used in a browser. Solve this by using a bundler like `rollup.js` or `Webpack`. That should tree-shake this class out or you can provide a shim for the used node package for the bundling process.

## Development and Contribution

The development process used in this repo is pretty simple. There are a number NPM scripts for building, linting and testing the classes. Run `npm run build` to have typescript create the `output` folder as it is used in the node module. Execute `npm run test-coverage` to run all unit tests and print some coverage info. Coverage is currently pretty low, so this is in area where some work needs to go into.

Adding new classes to this repository is described in more detail in [How To Add](doc/how-to-add.md).
