#!/bin/bash

(cd micropython-microbit-v2 && git submodule update --init)
LDFLAGS="\
        -s ALLOW_MEMORY_GROWTH=1 \
        -s EXPORTED_FUNCTIONS=_main,_free,_malloc \
        -s EXPORTED_RUNTIME_METHODS=FS,PROXYFS,ERRNO_CODES,allocateUTF8 \
        -lproxyfs.js \
        --js-library=/home/johnn333/Documents/emcept-crossmpy/fsroot.js \
    " make -C micropython-microbit-v2/lib/micropython/mpy-cross \
        CC=emcc \
        STRIP=emstrip \
        SIZE=emsize \
        LDFLAGS_ARCH=-Wl,-Map=$@.map, -Wl,--gc-sections \
        PROG:=mpy-cross.mjs \

