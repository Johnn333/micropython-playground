#!/bin/bash

SRC=$(dirname $0)
BUILD="$1"

if [ "$BUILD" == "" ]; then
    BUILD=$(pwd)/build
fi

SRC=$(realpath "$SRC")
BUILD=$(realpath "$BUILD")

$SRC/build-tooling.sh "$BUILD"

$SRC/build-make.sh "$BUILD" "$MAKE_SRC"
$SRC/build-mpycross.sh "$BUILD" "$MPYCROSS_SRC"
$SRC/build-busybox.sh "$BUILD" "$BUSYBOX_SRC"
$SRC/build-llvm.sh "$BUILD" "$LLVM_SRC"
$SRC/build-cpython.sh "$BUILD" "$CPYTHON_SRC"
