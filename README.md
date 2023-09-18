# This repo is experimental! Everything here is a proof of concept and not finalised. Things may not work as expected.

# micropython-playground

What is this? <br>
An early tech demo repo, attempting to get get micropythons microbit port building within the browser. For potential use as a "backend" for the current Python editor: https://python.microbit.org/v/3 <br>
Included are build scripts for WebAssembly modules (Clang/LLD, GNU Make, MpyCross, CPython, BusyBox) and a demo site to showcase the functionality: https://johnn333.github.io/micropython-playground/webpage/.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Building MicroPython](#building-micropython)
- [Running the Demo](#running-the-demo)

## Getting Started

If you arent interested in building WebAssembly, view the /webpage directory of this repo, this contains all the JS needed to get the project running. In archive.pack.xz you will find all of the WebAssembly modules precompiled, along with all the other content being sent over to enable a build. Namely parts of newlib, CODAL (Prebuilt) and Micropython. Feel free to decompress this and take a look. A future goal for this is to make the archive populate itself.

### Prerequisites

Its highly recommended to run this build process using Docker. If you would like to build it natively, please view the Dockerfile in /wasm-build/docker for a list of prerequisites.

### Installation

1. Clone this repository to your local machine:

   ```bash
    $ git clone https://github.com/Johnn333/micropython-playground.git
    $ cd micropython-playground/wasm-build
    $ ./build-with-docker.sh

2. Wait... Compiling some of these projects from source, particularly Clang/LLVM takes a long time, expect this to take even longer than a normal build as we are using Emscripten.

3. View the build folder, in its current state nothing is happening with the WebAssembly modules just built, so this is it...

### Running the Demo

If you would like to run the demo locally, all you have to do is serve /webpage/index.html to yourself. This can be done using the live server extension on VSCode for example.
