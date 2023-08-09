import EmProcess from "./EmProcess.mjs";
import MpyCrossModule from "./emscripten/mpy-cross.mjs";

export default class MpyCrossProcess extends EmProcess {
    constructor(opts) {
        const wasmBinary = opts.FS.readFile("/wasm/mpy-cross.wasm");
        super(MpyCrossModule, { ...opts, wasmBinary });
    }
};
