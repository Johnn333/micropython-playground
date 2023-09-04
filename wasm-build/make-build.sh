#!/bin/bash

SRC=$(dirname $0)

BUILD="$1"
MAKE_SRC="$2"

if [ "$MAKE_SRC" == "" ]; then
    MAKE_SRC=$(pwd)/upstream/make
fi

if [ "$BUILD" == "" ]; then
    BUILD=$(pwd)/build
fi

if [ ! -d $MAKE_SRC/ ]; then
    git clone --depth 1 https://git.savannah.gnu.org/git/make.git "$MAKE_SRC/"

    pushd $MAKE_SRC/

    # This is the last tested commit of Make.
    # Feel free to try with a newer version
    COMMIT=ed493f6c9116cc217b99c2cfa6a95f15803235a2
    git fetch origin $COMMIT
    git reset --hard $COMMIT

    ./bootstrap

    popd
fi

SRC=$(realpath "$SRC")
BUILD=$(realpath "$BUILD")
MAKE_BUILD=$BUILD/make

if [ ! -d $MAKE_BUILD/ ]; then
    mkdir -p $MAKE_BUILD/

    pushd $MAKE_BUILD/

    LDFLAGS="\
        -s ALLOW_MEMORY_GROWTH=1 \
        -s EXPORTED_FUNCTIONS=_main,_free,_malloc \
        -s EXPORTED_RUNTIME_METHODS=FS,PROXYFS,ERRNO_CODES,allocateUTF8 \
        -lproxyfs.js \
        --js-library=../../fsroot.js \
    " emconfigure $MAKE_SRC/configure \
        --host=wasm32-unknown-emscripten \

    emmake make -j$(nproc)

    popd
fi