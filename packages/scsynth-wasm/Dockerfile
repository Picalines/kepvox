FROM alpine/git AS sc-source

WORKDIR /sc-source

RUN git clone https://github.com/Sciss/supercollider.git \
    -b wasm \
    --single-branch \
    --recurse-submodules \
    --depth 1 \
    supercollider

FROM emscripten/emsdk:3.1.56 AS build-wasm

RUN emsdk activate latest

WORKDIR /scsynth-build

COPY --from=sc-source /sc-source .

WORKDIR /scsynth-build/supercollider/build

RUN echo "\ntarget_link_options(scsynth PRIVATE \"-sEXPORTED_FUNCTIONS=_main,_malloc,_free\")" >> ../CMakeLists.txt

RUN emcmake cmake .. \
    -DSC_EL=no \
    -DSUPERNOVA=no \
    -DSC_HIDAPI=no \
    -DNO_LIBSNDFILE=yes \
    -DSC_QT=no \
    -DNO_AVAHI=yes \
    -DSC_ABLETON_LINK=no \
    -DCMAKE_BUILD_TYPE=Release \
    -Wno-dev \
    -DPTHREADS_LIBRARY=ignore \
    -DSSE=no \
    -DSSE2=no \
    -DNO_X11=yes

RUN ../wasm/make.sh

RUN mkdir -p /scsynth-build/out
RUN cp ../wasm/*.js /scsynth-build/out
RUN cp ../wasm/*.wasm /scsynth-build/out

FROM scratch AS output

COPY --from=build-wasm /scsynth-build/out/* /
