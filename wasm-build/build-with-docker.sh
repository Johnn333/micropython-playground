#!/bin/bash

# https://github.com/jprendes/emception/blob/4f213c76f2898ef2ee295b28bfe3ff99bb8eccf7/build-with-docker.sh
# MIT License

SRC=$(dirname $0)
SRC=$(realpath "$SRC")

pushd $SRC/docker
docker build \
    -t emception_build \
    .
popd

mkdir -p $(pwd)/build/emsdk_cache

docker run \
    -it --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v $(pwd):$(pwd) \
    -v $(pwd)/build/emsdk_cache:/emsdk/upstream/emscripten/cache \
    -u $(id -u):$(id -g) \
    $(id -G | tr ' ' '\n' | xargs -I{} echo --group-add {}) \
    emception_build:latest \
    bash -c "cd $(pwd) && ./build.sh"
