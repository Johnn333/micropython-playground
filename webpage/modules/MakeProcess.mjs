import EmProcess from "./EmProcess.mjs";
import MakeModule from "./emscripten/make.mjs";

export default class MakeProcess extends EmProcess {
    constructor(opts) {
        const wasmBinary = opts.FS.readFile("/wasm/make.wasm");
        super(MakeModule, { ...opts, wasmBinary });
    }
};
