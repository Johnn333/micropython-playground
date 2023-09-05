#!/bin/bash

SRC=$(dirname $0)

BUILD="$1"
MPY_SRC="$2"

if [ "$BUILD" == "" ]; then
    BUILD=$(pwd)/build
fi

if [ "$MPY_SRC" == "" ]; then
    MPY_SRC=$(pwd)/build/micropython
fi


if [ ! -d $MPY_SRC/ ]; then
    git clone --depth 1 https://github.com/microbit-foundation/micropython-microbit-v2.git "$MPY_SRC/"

    pushd $MPY_SRC/

    # This is the last tested commit of micropython.
    COMMIT=3534b18b59aedd38dbcf7993482c2173f92af1c3
    git fetch origin $COMMIT
    git reset --hard $COMMIT

    # Fetch submodules
    git submodule update --init

    popd
fi

SRC=$(realpath "$SRC")
BUILD=$(realpath "$BUILD")

pushd $MPY_SRC/

LDFLAGS="\
        -s ALLOW_MEMORY_GROWTH=1 \
        -s EXPORTED_FUNCTIONS=_main,_free,_malloc \
        -s EXPORTED_RUNTIME_METHODS=FS,PROXYFS,ERRNO_CODES,allocateUTF8 \
        -lproxyfs.js \
        --js-library=$SRC/emlib/fsroot.js \
" make -C lib/micropython/mpy-cross \
    CC=emcc \
    STRIP="echo STRIP is disabled" \
    SIZE="echo SIZE is disabled" \
    LDFLAGS_ARCH=-Wl,-Map=$@.map, -Wl,--gc-sections \
    PROG:=mpy-cross.mjs \

popd
