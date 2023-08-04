// This is code which we want Emscripten to trigger when Stdin for a 
// given wasm module is called for. We change self.buffer (GlobalWorkerSpace)
// before the wasm module is called to achieve this.
export default class StdIn{
    get(){
        if(self.buffer.length === 0) return null;
        const c = self.buffer.shift();
        return c;
    }
}