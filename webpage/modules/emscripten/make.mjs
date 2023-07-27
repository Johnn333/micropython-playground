
var Module = (() => {
  var _scriptDir = import.meta.url;
  
  return (
function(Module) {
  Module = Module || {};



// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != 'undefined' ? Module : {};

// See https://caniuse.com/mdn-javascript_builtins_object_assign

// See https://caniuse.com/mdn-javascript_builtins_bigint64array

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// {{PRE_JSES}}

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

// Normally we don't log exceptions but instead let them bubble out the top
// level where the embedding environment (e.g. the browser) can handle
// them.
// However under v8 and node we sometimes exit the process direcly in which case
// its up to use us to log the exception before exiting.
// If we fix https://github.com/emscripten-core/emscripten/issues/15080
// this may no longer be needed under node.
function logExceptionOnExit(e) {
  if (e instanceof ExitStatus) return;
  let toLog = e;
  err('exiting due to exception: ' + toLog);
}

if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require('path').dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js


// These modules will usually be used on Node.js. Load them eagerly to avoid
// the complexity of lazy-loading. However, for now we must guard on require()
// actually existing: if the JS is put in a .mjs file (ES6 module) and run on
// node, then we'll detect node as the environment and get here, but require()
// does not exist (since ES6 modules should use |import|). If the code actually
// uses the node filesystem then it will crash, of course, but in the case of
// code that never uses it we don't want to crash here, so the guarding if lets
// such code work properly. See discussion in
// https://github.com/emscripten-core/emscripten/pull/17851
var fs, nodePath;
if (typeof require === 'function') {
  fs = require('fs');
  nodePath = require('path');
}

read_ = (filename, binary) => {
  filename = nodePath['normalize'](filename);
  return fs.readFileSync(filename, binary ? undefined : 'utf8');
};

readBinary = (filename) => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  return ret;
};

readAsync = (filename, onload, onerror) => {
  filename = nodePath['normalize'](filename);
  fs.readFile(filename, function(err, data) {
    if (err) onerror(err);
    else onload(data.buffer);
  });
};

// end include: node_shell_read.js
  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  // Without this older versions of node (< v15) will log unhandled rejections
  // but return 0, which is not normally the desired behaviour.  This is
  // not be needed with node v15 and about because it is now the default
  // behaviour:
  // See https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode
  process['on']('unhandledRejection', function(reason) { throw reason; });

  quit_ = (status, toThrow) => {
    if (keepRuntimeAlive()) {
      process['exitCode'] = status;
      throw toThrow;
    }
    logExceptionOnExit(toThrow);
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js


  read_ = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }

  setWindowTitle = (title) => document.title = title;
} else
{
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];

if (Module['thisProgram']) thisProgram = Module['thisProgram'];

if (Module['quit']) quit_ = Module['quit'];

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message




var STACK_ALIGN = 16;
var POINTER_SIZE = 4;

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': case 'u8': return 1;
    case 'i16': case 'u16': return 2;
    case 'i32': case 'u32': return 4;
    case 'i64': case 'u64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return POINTER_SIZE;
      }
      if (type[0] === 'i') {
        const bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      }
      return 0;
    }
  }
}

// include: runtime_debug.js


// end include: runtime_debug.js


// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
var noExitRuntime = Module['noExitRuntime'] || true;

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implemenation here for now.
    abort(text);
  }
}

// include: runtime_strings.js


// runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.
/**
 * heapOrArray is either a regular array, or a JavaScript typed array view.
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = '';
  // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 0xF0) == 0xE0) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }

    if (u0 < 0x10000) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i); // possibly a lead surrogate
    if (c <= 0x7F) {
      len++;
    } else if (c <= 0x7FF) {
      len += 2;
    } else if (c >= 0xD800 && c <= 0xDFFF) {
      len += 4; ++i;
    } else {
      len += 3;
    }
  }
  return len;
}

// end include: runtime_strings.js
// Memory management

var HEAP,
/** @type {!ArrayBuffer} */
  buffer,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var TOTAL_STACK = 5242880;

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;

// end include: runtime_init_table.js
// include: runtime_stack_check.js


// end include: runtime_stack_check.js
// include: runtime_assertions.js


// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function keepRuntimeAlive() {
  return noExitRuntime;
}

function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;

  
if (!Module["noFSInit"] && !FS.init.initialized)
  FS.init();
FS.ignorePermissions = false;

TTY.init();
PIPEFS.root = FS.mount(PIPEFS, {}, null);
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }
  }

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what += '. Build with -sASSERTIONS for more info.';

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// {{MEM_INITIALIZER}}

// include: memoryprofiler.js


// end include: memoryprofiler.js
// include: URIUtils.js


// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  return filename.startsWith(dataURIPrefix);
}

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return filename.startsWith('file://');
}

// end include: URIUtils.js
var wasmBinaryFile;
if (Module['locateFile']) {
  wasmBinaryFile = 'make.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }
} else {
  // Use bundler-friendly `new URL(..., import.meta.url)` pattern; works in browsers too.
  wasmBinaryFile = new URL('make.wasm', import.meta.url).toString();
}

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(file);
    }
    throw "both async and sync fetching of the wasm failed";
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // If we don't have the binary yet, try to to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
      && !isFileURI(wasmBinaryFile)
    ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
          return getBinary(wasmBinaryFile);
      });
    }
    else {
      if (readAsync) {
        // fetch is not available or url is file => try XHR (readAsync uses XHR internally)
        return new Promise(function(resolve, reject) {
          readAsync(wasmBinaryFile, function(response) { resolve(new Uint8Array(/** @type{!ArrayBuffer} */(response))) }, reject)
        });
      }
    }
  }

  // Otherwise, getBinary should be able to get it synchronously
  return Promise.resolve().then(function() { return getBinary(wasmBinaryFile); });
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmMemory = Module['asm']['memory'];
    updateGlobalBufferAndViews(wasmMemory.buffer);

    wasmTable = Module['asm']['__indirect_function_table'];

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');

  }
  // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(function (instance) {
      return instance;
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);

      abort(reason);
    });
  }

  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(wasmBinaryFile) &&
        // Don't use streaming for file:// delivered objects in a webview, fetch them synchronously.
        !isFileURI(wasmBinaryFile) &&
        // Avoid instantiateStreaming() on Node.js environment for now, as while
        // Node.js v18.1.0 implements it, it does not have a full fetch()
        // implementation yet.
        //
        // Reference:
        //   https://github.com/emscripten-core/emscripten/pull/16917
        !ENVIRONMENT_IS_NODE &&
        typeof fetch == 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        // Suppress closure warning here since the upstream definition for
        // instantiateStreaming only allows Promise<Repsponse> rather than
        // an actual Response.
        // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
        /** @suppress {checkTypes} */
        var result = WebAssembly.instantiateStreaming(response, info);

        return result.then(
          receiveInstantiationResult,
          function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiationResult);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  // Also pthreads and wasm workers initialize the wasm instance through this path.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  // If instantiation fails, reject the module ready promise.
  instantiateAsync().catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  
};






  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = 'Program terminated with exit(' + status + ')';
      this.status = status;
    }

  function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    }

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': return HEAP8[((ptr)>>0)];
        case 'i8': return HEAP8[((ptr)>>0)];
        case 'i16': return HEAP16[((ptr)>>1)];
        case 'i32': return HEAP32[((ptr)>>2)];
        case 'i64': return HEAP32[((ptr)>>2)];
        case 'float': return HEAPF32[((ptr)>>2)];
        case 'double': return HEAPF64[((ptr)>>3)];
        case '*': return HEAPU32[((ptr)>>2)];
        default: abort('invalid type for getValue: ' + type);
      }
      return null;
    }

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
      if (type.endsWith('*')) type = '*';
      switch (type) {
        case 'i1': HEAP8[((ptr)>>0)] = value; break;
        case 'i8': HEAP8[((ptr)>>0)] = value; break;
        case 'i16': HEAP16[((ptr)>>1)] = value; break;
        case 'i32': HEAP32[((ptr)>>2)] = value; break;
        case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)] = tempI64[0],HEAP32[(((ptr)+(4))>>2)] = tempI64[1]); break;
        case 'float': HEAPF32[((ptr)>>2)] = value; break;
        case 'double': HEAPF64[((ptr)>>3)] = value; break;
        case '*': HEAPU32[((ptr)>>2)] = value; break;
        default: abort('invalid type for setValue: ' + type);
      }
    }

  function ___assert_fail(condition, filename, line, func) {
      abort('Assertion failed: ' + UTF8ToString(condition) + ', at: ' + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    }

  var wasmTableMirror = [];
  function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }
  function ___call_sighandler(fp, sig) {
      getWasmTableEntry(fp)(sig);
    }

  var PATH = {isAbs:(path) => path.charAt(0) === '/',splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:(path) => {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        path = PATH.normalize(path);
        path = path.replace(/\/$/, "");
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },join:function() {
        var paths = Array.prototype.slice.call(arguments);
        return PATH.normalize(paths.join('/'));
      },join2:(l, r) => {
        return PATH.normalize(l + '/' + r);
      }};
  
  function getRandomDevice() {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        // for modern web browsers
        var randomBuffer = new Uint8Array(1);
        return () => { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
      } else
      if (ENVIRONMENT_IS_NODE) {
        // for nodejs with or without crypto support included
        try {
          var crypto_module = require('crypto');
          // nodejs has crypto support
          return () => crypto_module['randomBytes'](1)[0];
        } catch (e) {
          // nodejs doesn't have crypto support
        }
      }
      // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
      return () => abort("randomDevice");
    }
  
  var PATH_FS = {resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path != 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = PATH.isAbs(path);
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:(from, to) => {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  /** @type {function(string, boolean=, number=)} */
  function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array;
  }
  var TTY = {ttys:[],init:function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },fsync:function(stream) {
          stream.tty.ops.fsync(stream.tty);
        },read:function(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = Buffer.alloc(BUFSIZE);
              var bytesRead = 0;
  
              try {
                bytesRead = fs.readSync(process.stdin.fd, buf, 0, BUFSIZE, -1);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().includes('EOF')) bytesRead = 0;
                else throw e;
              }
  
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
            } else
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },fsync:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },fsync:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  function zeroMemory(address, size) {
      HEAPU8.fill(0, address, address + size);
      return address;
    }
  
  function alignMemory(size, alignment) {
      return Math.ceil(size / alignment) * alignment;
    }
  function mmapAlloc(size) {
      size = alignMemory(size, 65536);
      var ptr = _emscripten_builtin_memalign(65536, size);
      if (!ptr) return 0;
      return zeroMemory(ptr, size);
    }
  var MEMFS = {ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.timestamp = node.timestamp;
        }
        return node;
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
        }
      },node_ops:{getattr:function(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.parent.timestamp = Date.now()
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          new_dir.timestamp = old_node.parent.timestamp;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.timestamp = Date.now();
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
          // If the buffer is located in main memory (HEAP), and if
          // memory can grow, we can't hold on to references of the
          // memory buffer, as they may get invalidated. That means we
          // need to do copy its contents.
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents.buffer === buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            HEAP8.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  /** @param {boolean=} noRunDep */
  function asyncLoad(url, onload, onerror, noRunDep) {
      var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
      readAsync(url, (arrayBuffer) => {
        assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      }, (event) => {
        if (onerror) {
          onerror();
        } else {
          throw 'Loading data file "' + url + '" failed.';
        }
      });
      if (dep) addRunDependency(dep);
    }
  
  var ERRNO_CODES = {};
  var PROXYFS = {mount:function (mount) {
        return PROXYFS.createNode(null, '/', mount.opts.fs.lstat(mount.opts.root).mode, 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = PROXYFS.node_ops;
        node.stream_ops = PROXYFS.stream_ops;
        return node;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },node_ops:{getattr:function(node) {
          var path = PROXYFS.realPath(node);
          var stat;
          try {
            stat = node.mount.opts.fs.lstat(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function(node, attr) {
          var path = PROXYFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              node.mount.opts.fs.chmod(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              node.mount.opts.fs.utime(path, date, date);
            }
            if (attr.size !== undefined) {
              node.mount.opts.fs.truncate(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          try {
            var path = PATH.join2(PROXYFS.realPath(parent), name);
            var mode = parent.mount.opts.fs.lstat(path).mode;
            var node = PROXYFS.createNode(parent, name, mode);
            return node;
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },mknod:function (parent, name, mode, dev) {
          var node = PROXYFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = PROXYFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              node.mount.opts.fs.mkdir(path, node.mode);
            } else {
              node.mount.opts.fs.writeFile(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = PROXYFS.realPath(oldNode);
          var newPath = PATH.join2(PROXYFS.realPath(newDir), newName);
          try {
            oldNode.mount.opts.fs.rename(oldPath, newPath);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function(parent, name) {
          var path = PATH.join2(PROXYFS.realPath(parent), name);
          try {
            parent.mount.opts.fs.unlink(path);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function(parent, name) {
          var path = PATH.join2(PROXYFS.realPath(parent), name);
          try {
            parent.mount.opts.fs.rmdir(path);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function(node) {
          var path = PROXYFS.realPath(node);
          try {
            return node.mount.opts.fs.readdir(path);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function(parent, newName, oldPath) {
          var newPath = PATH.join2(PROXYFS.realPath(parent), newName);
          try {
            parent.mount.opts.fs.symlink(oldPath, newPath);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function(node) {
          var path = PROXYFS.realPath(node);
          try {
            return node.mount.opts.fs.readlink(path);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = PROXYFS.realPath(stream.node);
          try {
            stream.nfd = stream.node.mount.opts.fs.open(path,stream.flags);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            stream.node.mount.opts.fs.close(stream.nfd);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          try {
            return stream.node.mount.opts.fs.read(stream.nfd, buffer, offset, length, position);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },write:function (stream, buffer, offset, length, position) {
          try {
            return stream.node.mount.opts.fs.write(stream.nfd, buffer, offset, length, position);
          } catch(e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = stream.node.node_ops.getattr(stream.node);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          return position;
        }}};
  var FS = {root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:(path, opts = {}) => {
        path = PATH_FS.resolve(FS.cwd(), path);
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        opts = Object.assign(defaults, opts)
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter((p) => !!p), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count + 1 });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:(node) => {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:(parentid, name) => {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:(node) => {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:(parent, name) => {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:(parent, name, mode, rdev) => {
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:(node) => {
        FS.hashRemoveNode(node);
      },isRoot:(node) => {
        return node === node.parent;
      },isMountpoint:(node) => {
        return !!node.mounted;
      },isFile:(mode) => {
        return (mode & 61440) === 32768;
      },isDir:(mode) => {
        return (mode & 61440) === 16384;
      },isLink:(mode) => {
        return (mode & 61440) === 40960;
      },isChrdev:(mode) => {
        return (mode & 61440) === 8192;
      },isBlkdev:(mode) => {
        return (mode & 61440) === 24576;
      },isFIFO:(mode) => {
        return (mode & 61440) === 4096;
      },isSocket:(mode) => {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"r+":2,"w":577,"w+":578,"a":1089,"a+":1090},modeStringToFlags:(str) => {
        var flags = FS.flagModes[str];
        if (typeof flags == 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:(flag) => {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:(node, perms) => {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:(dir) => {
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:(dir, name) => {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:(dir, name, isdir) => {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:(node, flags) => {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:(fd_start = 0, fd_end = FS.MAX_OPEN_FDS) => {
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStream:(fd) => FS.streams[fd],createStream:(stream, fd_start, fd_end) => {
        if (!FS.FSStream) {
          FS.FSStream = /** @constructor */ function() {
            this.shared = { };
          };
          FS.FSStream.prototype = {};
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              /** @this {FS.FSStream} */
              get: function() { return this.node; },
              /** @this {FS.FSStream} */
              set: function(val) { this.node = val; }
            },
            isRead: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              /** @this {FS.FSStream} */
              get: function() { return (this.flags & 1024); }
            },
            flags: {
              /** @this {FS.FSStream} */
              get: function() { return this.shared.flags; },
              /** @this {FS.FSStream} */
              set: function(val) { this.shared.flags = val; },
            },
            position : {
              /** @this {FS.FSStream} */
              get: function() { return this.shared.position; },
              /** @this {FS.FSStream} */
              set: function(val) { this.shared.position = val; },
            },
          });
        }
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:(fd) => {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:(stream) => {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:() => {
          throw new FS.ErrnoError(70);
        }},major:(dev) => ((dev) >> 8),minor:(dev) => ((dev) & 0xff),makedev:(ma, mi) => ((ma) << 8 | (mi)),registerDevice:(dev, ops) => {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:(dev) => FS.devices[dev],getMounts:(mount) => {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:(populate, callback) => {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach((mount) => {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:(type, opts, mountpoint) => {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:(mountpoint) => {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach((hash) => {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },lookup:(parent, name) => {
        return parent.node_ops.lookup(parent, name);
      },mknod:(path, mode, dev) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:(path, mode) => {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:(path, mode) => {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:(path, mode) => {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:(path, mode, dev) => {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:(oldpath, newpath) => {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:(old_path, new_path) => {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existant directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:(path) => {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:(path) => {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:(path, dontFollow) => {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:(path) => {
        return FS.stat(path, true);
      },chmod:(path, mode, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:(path, mode) => {
        FS.chmod(path, mode, true);
      },fchmod:(fd, mode) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },chown:(path, uid, gid, dontFollow) => {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:(path, uid, gid) => {
        FS.chown(path, uid, gid, true);
      },fchown:(fd, uid, gid) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:(path, len) => {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:(fd, len) => {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:(path, atime, mtime) => {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:(path, flags, mode) => {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode == 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path == 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },close:(stream) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:(stream) => {
        return stream.fd === null;
      },llseek:(stream, offset, whence) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:(stream, buffer, offset, length, position) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:(stream, buffer, offset, length, position, canOwn) => {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:(stream, offset, length) => {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:(stream, length, position, prot, flags) => {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },msync:(stream, buffer, offset, length, mmapFlags) => {
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:(stream) => 0,ioctl:(stream, cmd, arg) => {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:(path, opts = {}) => {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:(path, data, opts = {}) => {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:() => FS.currentPath,chdir:(path) => {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:() => {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:() => {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device = getRandomDevice();
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:() => {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: () => {
            var node = FS.createNode(proc_self, 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: (parent, name) => {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:() => {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
      },ensureErrnoError:() => {
        if (FS.ErrnoError) return;
        FS.ErrnoError = /** @this{Object} */ function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = /** @this{Object} */ function(errno) {
            this.errno = errno;
          };
          this.setErrno(errno);
          this.message = 'FS error';
  
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach((code) => {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:() => {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
          'PROXYFS': PROXYFS,
        };
      },init:(input, output, error) => {
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:() => {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:(canRead, canWrite) => {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },findObject:(path, dontResolveLastLink) => {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },analyzePath:(path, dontResolveLastLink) => {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createPath:(parent, path, canRead, canWrite) => {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:(parent, name, properties, canRead, canWrite) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:(parent, name, data, canRead, canWrite, canOwn) => {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:(parent, name, input, output) => {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: (stream) => {
            stream.seekable = false;
          },
          close: (stream) => {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: (stream, buffer, offset, length, pos /* ignored */) => {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: (stream, buffer, offset, length, pos) => {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },forceLoadFile:(obj) => {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (typeof XMLHttpRequest != 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
      },createLazyFile:(parent, name, url, canRead, canWrite) => {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        /** @constructor */
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = /** @this{Object} */ function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (from, to) => {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
            }
            return intArrayFromString(xhr.responseText || '', true);
          };
          var lazyArray = this;
          lazyArray.setDataGetter((chunkNum) => {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof lazyArray.chunks[chunkNum] == 'undefined') throw new Error('doXHR failed!');
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            out("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest != 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: /** @this{Object} */ function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: /** @this{Object} */ function() {
                if (!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: /** @this {FSNode} */ function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach((key) => {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            FS.forceLoadFile(node);
            return fn.apply(null, arguments);
          };
        });
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr: ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          if (Browser.handledByPreloadPlugin(byteArray, fullname, finish, () => {
            if (onerror) onerror();
            removeRunDependency(dep);
          })) {
            return;
          }
          finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          asyncLoad(url, (byteArray) => processData(byteArray), onerror);
        } else {
          processData(url);
        }
      },indexedDB:() => {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:() => {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:(paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = () => {
          out('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach((path) => {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = () => { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:(paths, onload, onerror) => {
        onload = onload || (() => {});
        onerror = onerror || (() => {});
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = () => {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach((path) => {
            var getRequest = files.get(path);
            getRequest.onsuccess = () => {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = () => { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var SYSCALLS = {DEFAULT_POLLMASK:5,calculateAt:function(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return PATH.join2(dir, path);
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)] = stat.dev;
        HEAP32[(((buf)+(8))>>2)] = stat.ino;
        HEAP32[(((buf)+(12))>>2)] = stat.mode;
        HEAPU32[(((buf)+(16))>>2)] = stat.nlink;
        HEAP32[(((buf)+(20))>>2)] = stat.uid;
        HEAP32[(((buf)+(24))>>2)] = stat.gid;
        HEAP32[(((buf)+(28))>>2)] = stat.rdev;
        (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(40))>>2)] = tempI64[0],HEAP32[(((buf)+(44))>>2)] = tempI64[1]);
        HEAP32[(((buf)+(48))>>2)] = 4096;
        HEAP32[(((buf)+(52))>>2)] = stat.blocks;
        (tempI64 = [Math.floor(stat.atime.getTime() / 1000)>>>0,(tempDouble=Math.floor(stat.atime.getTime() / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(56))>>2)] = tempI64[0],HEAP32[(((buf)+(60))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(64))>>2)] = 0;
        (tempI64 = [Math.floor(stat.mtime.getTime() / 1000)>>>0,(tempDouble=Math.floor(stat.mtime.getTime() / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(72))>>2)] = tempI64[0],HEAP32[(((buf)+(76))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(80))>>2)] = 0;
        (tempI64 = [Math.floor(stat.ctime.getTime() / 1000)>>>0,(tempDouble=Math.floor(stat.ctime.getTime() / 1000),(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(88))>>2)] = tempI64[0],HEAP32[(((buf)+(92))>>2)] = tempI64[1]);
        HEAPU32[(((buf)+(96))>>2)] = 0;
        (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(104))>>2)] = tempI64[0],HEAP32[(((buf)+(108))>>2)] = tempI64[1]);
        return 0;
      },doMsync:function(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },varargs:undefined,get:function() {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },getStreamFromFD:function(fd) {
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      }};
  function ___syscall_chdir(path) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.chdir(path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_dup(fd) {
  try {
  
      var old = SYSCALLS.getStreamFromFD(fd);
      return FS.createStream(old, 0).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_faccessat(dirfd, path, amode, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (amode & ~7) {
        // need a valid mode
        return -28;
      }
      var lookup = FS.lookupPath(path, { follow: true });
      var node = lookup.node;
      if (!node) {
        return -44;
      }
      var perms = '';
      if (amode & 4) perms += 'r';
      if (amode & 2) perms += 'w';
      if (amode & 1) perms += 'x';
      if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
        return -2;
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function setErrNo(value) {
      HEAP32[((___errno_location())>>2)] = value;
      return value;
    }
  function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -28;
          }
          var newStream;
          newStream = FS.createStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 5:
        /* case 5: Currently in musl F_GETLK64 has same value as F_GETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */ {
          
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)] = 2;
          return 0;
        }
        case 6:
        case 7:
        /* case 6: Currently in musl F_SETLK64 has same value as F_SETLK, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
        /* case 7: Currently in musl F_SETLKW64 has same value as F_SETLKW, so omitted to avoid duplicate case blocks. If that changes, uncomment this */
          
          
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -28; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fcntl() returns that, and we set errno ourselves.
          setErrNo(28);
          return -1;
        default: {
          return -28;
        }
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_fstat64(fd, buf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      return SYSCALLS.doStat(FS.stat, stream.path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function convertI32PairToI53Checked(lo, hi) {
      return ((hi + 0x200000) >>> 0 < 0x400001 - !!lo) ? (lo >>> 0) + hi * 4294967296 : NaN;
    }
  function ___syscall_ftruncate64(fd, length_low, length_high) {
  try {
  
      var length = convertI32PairToI53Checked(length_low, length_high); if (isNaN(length)) return -61;
      FS.ftruncate(fd, length);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_getcwd(buf, size) {
  try {
  
      if (size === 0) return -28;
      var cwd = FS.cwd();
      var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
      if (size < cwdLengthInBytes) return -68;
      stringToUTF8(cwd, buf, size);
      return cwdLengthInBytes;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_getdents64(fd, dirp, count) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd)
      if (!stream.getdents) {
        stream.getdents = FS.readdir(stream.path);
      }
  
      var struct_size = 280;
      var pos = 0;
      var off = FS.llseek(stream, 0, 1);
  
      var idx = Math.floor(off / struct_size);
  
      while (idx < stream.getdents.length && pos + struct_size <= count) {
        var id;
        var type;
        var name = stream.getdents[idx];
        if (name === '.') {
          id = stream.node.id;
          type = 4; // DT_DIR
        }
        else if (name === '..') {
          var lookup = FS.lookupPath(stream.path, { parent: true });
          id = lookup.node.id;
          type = 4; // DT_DIR
        }
        else {
          var child = FS.lookupNode(stream.node, name);
          id = child.id;
          type = FS.isChrdev(child.mode) ? 2 :  // DT_CHR, character device.
                 FS.isDir(child.mode) ? 4 :     // DT_DIR, directory.
                 FS.isLink(child.mode) ? 10 :   // DT_LNK, symbolic link.
                 8;                             // DT_REG, regular file.
        }
        (tempI64 = [id>>>0,(tempDouble=id,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((dirp + pos)>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(4))>>2)] = tempI64[1]);
        (tempI64 = [(idx + 1) * struct_size>>>0,(tempDouble=(idx + 1) * struct_size,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((dirp + pos)+(8))>>2)] = tempI64[0],HEAP32[(((dirp + pos)+(12))>>2)] = tempI64[1]);
        HEAP16[(((dirp + pos)+(16))>>1)] = 280;
        HEAP8[(((dirp + pos)+(18))>>0)] = type;
        stringToUTF8(name, dirp + pos + 19, 256);
        pos += struct_size;
        idx += 1;
      }
      FS.llseek(stream, idx * struct_size, 0);
      return pos;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509:
        case 21505: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21510:
        case 21511:
        case 21512:
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        default: return -28; // not supported
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_lstat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.lstat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_mknodat(dirfd, path, mode, dev) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      // we don't want this in the JS API as it uses mknod to create all nodes.
      switch (mode & 61440) {
        case 32768:
        case 8192:
        case 24576:
        case 4096:
        case 49152:
          break;
        default: return -28;
      }
      FS.mknod(path, mode, dev);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_newfstatat(dirfd, path, buf, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      var nofollow = flags & 256;
      var allowEmpty = flags & 4096;
      flags = flags & (~4352);
      path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
      return SYSCALLS.doStat(nofollow ? FS.lstat : FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? SYSCALLS.get() : 0;
      return FS.open(path, flags, mode).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  var PIPEFS = {BUCKET_BUFFER_SIZE:8192,mount:function (mount) {
        // Do not pollute the real root directory or its child nodes with pipes
        // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createPipe:function () {
        var pipe = {
          buckets: [],
          // refcnt 2 because pipe has a read end and a write end. We need to be
          // able to read from the read end after write end is closed.
          refcnt : 2,
        };
  
        pipe.buckets.push({
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: 0,
          roffset: 0
        });
  
        var rName = PIPEFS.nextname();
        var wName = PIPEFS.nextname();
        var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
        var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
  
        rNode.pipe = pipe;
        wNode.pipe = pipe;
  
        var readableStream = FS.createStream({
          path: rName,
          node: rNode,
          flags: 0,
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        rNode.stream = readableStream;
  
        var writableStream = FS.createStream({
          path: wName,
          node: wNode,
          flags: 1,
          seekable: false,
          stream_ops: PIPEFS.stream_ops
        });
        wNode.stream = writableStream;
  
        return {
          readable_fd: readableStream.fd,
          writable_fd: writableStream.fd
        };
      },stream_ops:{poll:function (stream) {
          var pipe = stream.node.pipe;
  
          if ((stream.flags & 2097155) === 1) {
            return (256 | 4);
          }
          if (pipe.buckets.length > 0) {
            for (var i = 0; i < pipe.buckets.length; i++) {
              var bucket = pipe.buckets[i];
              if (bucket.offset - bucket.roffset > 0) {
                return (64 | 1);
              }
            }
          }
  
          return 0;
        },ioctl:function (stream, request, varargs) {
          return 28;
        },fsync:function (stream) {
          return 28;
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
          var currentLength = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var bucket = pipe.buckets[i];
            currentLength += bucket.offset - bucket.roffset;
          }
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          if (length <= 0) {
            return 0;
          }
          if (currentLength == 0) {
            // Behave as if the read end is always non-blocking
            throw new FS.ErrnoError(6);
          }
          var toRead = Math.min(currentLength, length);
  
          var totalRead = toRead;
          var toRemove = 0;
  
          for (var i = 0; i < pipe.buckets.length; i++) {
            var currBucket = pipe.buckets[i];
            var bucketSize = currBucket.offset - currBucket.roffset;
  
            if (toRead <= bucketSize) {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              if (toRead < bucketSize) {
                tmpSlice = tmpSlice.subarray(0, toRead);
                currBucket.roffset += toRead;
              } else {
                toRemove++;
              }
              data.set(tmpSlice);
              break;
            } else {
              var tmpSlice = currBucket.buffer.subarray(currBucket.roffset, currBucket.offset);
              data.set(tmpSlice);
              data = data.subarray(tmpSlice.byteLength);
              toRead -= tmpSlice.byteLength;
              toRemove++;
            }
          }
  
          if (toRemove && toRemove == pipe.buckets.length) {
            // Do not generate excessive garbage in use cases such as
            // write several bytes, read everything, write several bytes, read everything...
            toRemove--;
            pipe.buckets[toRemove].offset = 0;
            pipe.buckets[toRemove].roffset = 0;
          }
  
          pipe.buckets.splice(0, toRemove);
  
          return totalRead;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var pipe = stream.node.pipe;
  
          assert(buffer instanceof ArrayBuffer || ArrayBuffer.isView(buffer));
          var data = buffer.subarray(offset, offset + length);
  
          var dataLen = data.byteLength;
          if (dataLen <= 0) {
            return 0;
          }
  
          var currBucket = null;
  
          if (pipe.buckets.length == 0) {
            currBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: 0,
              roffset: 0
            };
            pipe.buckets.push(currBucket);
          } else {
            currBucket = pipe.buckets[pipe.buckets.length - 1];
          }
  
          assert(currBucket.offset <= PIPEFS.BUCKET_BUFFER_SIZE);
  
          var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
          if (freeBytesInCurrBuffer >= dataLen) {
            currBucket.buffer.set(data, currBucket.offset);
            currBucket.offset += dataLen;
            return dataLen;
          } else if (freeBytesInCurrBuffer > 0) {
            currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
            currBucket.offset += freeBytesInCurrBuffer;
            data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
          }
  
          var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
          var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
  
          for (var i = 0; i < numBuckets; i++) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: PIPEFS.BUCKET_BUFFER_SIZE,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
            data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
          }
  
          if (remElements > 0) {
            var newBucket = {
              buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
              offset: data.byteLength,
              roffset: 0
            };
            pipe.buckets.push(newBucket);
            newBucket.buffer.set(data);
          }
  
          return dataLen;
        },close:function (stream) {
          var pipe = stream.node.pipe;
          pipe.refcnt--;
          if (pipe.refcnt === 0) {
            pipe.buckets = null;
          }
        }},nextname:function () {
        if (!PIPEFS.nextname.current) {
          PIPEFS.nextname.current = 0;
        }
        return 'pipe[' + (PIPEFS.nextname.current++) + ']';
      }};
  function ___syscall_pipe(fdPtr) {
  try {
  
      if (fdPtr == 0) {
        throw new FS.ErrnoError(21);
      }
  
      var res = PIPEFS.createPipe();
  
      HEAP32[((fdPtr)>>2)] = res.readable_fd;
      HEAP32[(((fdPtr)+(4))>>2)] = res.writable_fd;
  
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (bufsize <= 0) return -28;
      var ret = FS.readlink(path);
  
      var len = Math.min(bufsize, lengthBytesUTF8(ret));
      var endChar = HEAP8[buf+len];
      stringToUTF8(ret, buf, bufsize+1);
      // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
      // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
      HEAP8[buf+len] = endChar;
      return len;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_rmdir(path) {
  try {
  
      path = SYSCALLS.getStr(path);
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_stat64(path, buf) {
  try {
  
      path = SYSCALLS.getStr(path);
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function ___syscall_unlinkat(dirfd, path, flags) {
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      if (flags === 0) {
        FS.unlink(path);
      } else if (flags === 512) {
        FS.rmdir(path);
      } else {
        abort('Invalid flags passed to unlinkat');
      }
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return -e.errno;
  }
  }

  function __dlinit(main_dso_handle) {}

  var dlopenMissingError =  'To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking';
  function __dlopen_js(filename, flag) {
      abort(dlopenMissingError);
    }

  function __dlsym_js(handle, symbol) {
      abort(dlopenMissingError);
    }

  function __emscripten_dlopen_js(filename, flags, user_data, onsuccess, onerror) {
      abort(dlopenMissingError);
    }

  var nowIsMonotonic = true;;
  function __emscripten_get_now_is_monotonic() {
      return nowIsMonotonic;
    }

  function readI53FromI64(ptr) {
      return HEAPU32[ptr>>2] + HEAP32[ptr+4>>2] * 4294967296;
    }
  function __gmtime_js(time, tmPtr) {
      var date = new Date(readI53FromI64(time)*1000);
      HEAP32[((tmPtr)>>2)] = date.getUTCSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getUTCMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getUTCHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getUTCDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getUTCMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getUTCFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
    }

  function __localtime_js(time, tmPtr) {
      var date = new Date(readI53FromI64(time)*1000);
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      HEAP32[(((tmPtr)+(36))>>2)] = -(date.getTimezoneOffset() * 60);
  
      // Attention: DST is in December in South, and some regions don't have DST at all.
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)] = dst;
    }

  function __mktime_js(tmPtr) {
      var date = new Date(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
  
      // There's an ambiguous hour when the time goes back; the tm_isdst field is
      // used to disambiguate it.  Date() basically guesses, so we fix it up if it
      // guessed wrong, or fill in tm_isdst with the guess if it's -1.
      var dst = HEAP32[(((tmPtr)+(32))>>2)];
      var guessedOffset = date.getTimezoneOffset();
      var start = new Date(date.getFullYear(), 0, 1);
      var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dstOffset = Math.min(winterOffset, summerOffset); // DST is in December in South
      if (dst < 0) {
        // Attention: some regions don't have DST at all.
        HEAP32[(((tmPtr)+(32))>>2)] = Number(summerOffset != winterOffset && dstOffset == guessedOffset);
      } else if ((dst > 0) != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        // Don't try setMinutes(date.getMinutes() + ...) -- it's messed up.
        date.setTime(date.getTime() + (trueOffset - guessedOffset)*60000);
      }
  
      HEAP32[(((tmPtr)+(24))>>2)] = date.getDay();
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
      // To match expected behavior, update fields from date
      HEAP32[((tmPtr)>>2)] = date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)] = date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)] = date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)] = date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)] = date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)] = date.getYear();
  
      return (date.getTime() / 1000)|0;
    }

  function __timegm_js(tmPtr) {
      var time = Date.UTC(HEAP32[(((tmPtr)+(20))>>2)] + 1900,
                          HEAP32[(((tmPtr)+(16))>>2)],
                          HEAP32[(((tmPtr)+(12))>>2)],
                          HEAP32[(((tmPtr)+(8))>>2)],
                          HEAP32[(((tmPtr)+(4))>>2)],
                          HEAP32[((tmPtr)>>2)],
                          0);
      var date = new Date(time);
  
      HEAP32[(((tmPtr)+(24))>>2)] = date.getUTCDay();
      var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
      var yday = ((date.getTime() - start) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)] = yday;
  
      return (date.getTime() / 1000)|0;
    }

  function allocateUTF8(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = _malloc(size);
      if (ret) stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }
  function _tzset_impl(timezone, daylight, tzname) {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for daylight savings.
      // This code uses the fact that getTimezoneOffset returns a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it compares whether the output of the given date the same (Standard) or less (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAP32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocateUTF8(winterName);
      var summerNamePtr = allocateUTF8(summerName);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        HEAPU32[((tzname)>>2)] = winterNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = summerNamePtr;
      } else {
        HEAPU32[((tzname)>>2)] = summerNamePtr;
        HEAPU32[(((tzname)+(4))>>2)] = winterNamePtr;
      }
    }
  function __tzset_js(timezone, daylight, tzname) {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (__tzset_js.called) return;
      __tzset_js.called = true;
      _tzset_impl(timezone, daylight, tzname);
    }

  function _abort() {
      abort('');
    }

  function _emscripten_date_now() {
      return Date.now();
    }

  function getHeapMax() {
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      return 2147483648;
    }
  function _emscripten_get_heap_max() {
      return getHeapMax();
    }

  var _emscripten_get_now;if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = () => {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else _emscripten_get_now = () => performance.now();
  ;

  function _emscripten_get_now_res() { // return resolution of get_now, in nanoseconds
      if (ENVIRONMENT_IS_NODE) {
        return 1; // nanoseconds
      } else
      // Modern environment where performance.now() is supported:
      return 1000; // microseconds (1/1000 of a millisecond)
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  function emscripten_realloc_buffer(size) {
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); // .grow() takes a delta compared to the previous size
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1 /*success*/;
      } catch(e) {
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      // With multithreaded builds, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
  
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
  
          return true;
        }
      }
      return false;
    }

  var ENV = {};
  
  function getExecutableName() {
      return thisProgram || './this.program';
    }
  function getEnvStrings() {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    }
  
  /** @param {boolean=} dontAddNull */
  function writeAsciiToMemory(str, buffer, dontAddNull) {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
      }
      // Null-terminate the pointer to the HEAP.
      if (!dontAddNull) HEAP8[((buffer)>>0)] = 0;
    }
  function _environ_get(__environ, environ_buf) {
      var bufSize = 0;
      getEnvStrings().forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(i*4))>>2)] = ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    }

  function _proc_exit(code) {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        if (Module['onExit']) Module['onExit'](code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    }
  /** @param {boolean|number=} implicit */
  function exitJS(status, implicit) {
      EXITSTATUS = status;
  
      _proc_exit(status);
    }
  var _exit = exitJS;

  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _fd_fdstat_get(fd, pbuf) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      // All character devices are terminals (other things a Linux system would
      // assume is a character device, like the mouse, we have special APIs for).
      var type = stream.tty ? 2 :
                 FS.isDir(stream.mode) ? 3 :
                 FS.isLink(stream.mode) ? 7 :
                 4;
      HEAP8[((pbuf)>>0)] = type;
      // TODO HEAP16[(((pbuf)+(2))>>1)] = ?;
      // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(8))>>2)] = tempI64[0],HEAP32[(((pbuf)+(12))>>2)] = tempI64[1]);
      // TODO (tempI64 = [?>>>0,(tempDouble=?,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((pbuf)+(16))>>2)] = tempI64[0],HEAP32[(((pbuf)+(20))>>2)] = tempI64[1]);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  function doReadv(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
      }
      return ret;
    }
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
  
      var offset = convertI32PairToI53Checked(offset_low, offset_high); if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)] = tempI64[0],HEAP32[(((newOffset)+(4))>>2)] = tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  function doWritev(stream, iov, iovcnt, offset) {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8,ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
      }
      return ret;
    }
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e instanceof FS.ErrnoError)) throw e;
    return e.errno;
  }
  }

  function _getloadavg(loadavg, nelem) {
      // int getloadavg(double loadavg[], int nelem);
      // http://linux.die.net/man/3/getloadavg
      var limit = Math.min(nelem, 3);
      var doubleSize = 8;
      for (var i = 0; i < limit; i++) {
        HEAPF64[(((loadavg)+(i * doubleSize))>>3)] = 0.1;
      }
      return limit;
    }



  function handleException(e) {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    }

  function allocateUTF8OnStack(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }

  var FSROOT = {staticInit:() => {
        FS.root = null;
  
        let opts = (Module.ROOT && Module.ROOT.opts) || {};
        let type = (Module.ROOT && Module.ROOT.type) || "MEMFS";
        if (typeof type === "string") {
          type = FS.filesystems[type] || eval(type);
        } else if (typeof type === "function") {
          type = type(Module);
        }
        FS.mount(type, opts, '/');
  
        FSROOT.createDefaultMountPoints();
  
        // We need to ignore errors in mkdir
        // since we are pre-creation mountpoints
        // for directories otherwise created by the
        // FS.create* functions
        const restore_mkdir = FSROOT.safeMkdir();
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        restore_mkdir();
      },createDefaultMountPoints:() => {
        // Mount a new MEMFS for /dev
        FS.mkdirTree("/dev");
        FS.mount(MEMFS, {}, "/dev");
    
        // Mount a new MEMFS for /proc/self
        FS.mkdirTree('/proc/self');
        FS.mount(MEMFS, {}, '/proc/self');
      },safeMkdir:() => {
        const mkdir = FS.mkdir;
        FS.mkdir = (path, mode) => {
          try {
            return mkdir(path, mode);
          } catch {
            // ignore errors
            return FS.lookupPath(path, { follow: true }).node;
          }
        };
        return () => {
            FS.mkdir = mkdir;
        };
      }};





  var FSNode = /** @constructor */ function(parent, name, mode, rdev) {
    if (!parent) {
      parent = this;  // root node sets parent to itself
    }
    this.parent = parent;
    this.mount = parent.mount;
    this.mounted = null;
    this.id = FS.nextInode++;
    this.name = name;
    this.mode = mode;
    this.node_ops = {};
    this.stream_ops = {};
    this.rdev = rdev;
  };
  var readMode = 292/*292*/ | 73/*73*/;
  var writeMode = 146/*146*/;
  Object.defineProperties(FSNode.prototype, {
   read: {
    get: /** @this{FSNode} */function() {
     return (this.mode & readMode) === readMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= readMode : this.mode &= ~readMode;
    }
   },
   write: {
    get: /** @this{FSNode} */function() {
     return (this.mode & writeMode) === writeMode;
    },
    set: /** @this{FSNode} */function(val) {
     val ? this.mode |= writeMode : this.mode &= ~writeMode;
    }
   },
   isFolder: {
    get: /** @this{FSNode} */function() {
     return FS.isDir(this.mode);
    }
   },
   isDevice: {
    get: /** @this{FSNode} */function() {
     return FS.isChrdev(this.mode);
    }
   }
  });
  FS.FSNode = FSNode;
  FS.staticInit();;
ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };;
FSROOT.staticInit();;
var ASSERTIONS = false;

var asmLibraryArg = {
  "__assert_fail": ___assert_fail,
  "__call_sighandler": ___call_sighandler,
  "__syscall_chdir": ___syscall_chdir,
  "__syscall_dup": ___syscall_dup,
  "__syscall_faccessat": ___syscall_faccessat,
  "__syscall_fcntl64": ___syscall_fcntl64,
  "__syscall_fstat64": ___syscall_fstat64,
  "__syscall_ftruncate64": ___syscall_ftruncate64,
  "__syscall_getcwd": ___syscall_getcwd,
  "__syscall_getdents64": ___syscall_getdents64,
  "__syscall_ioctl": ___syscall_ioctl,
  "__syscall_lstat64": ___syscall_lstat64,
  "__syscall_mknodat": ___syscall_mknodat,
  "__syscall_newfstatat": ___syscall_newfstatat,
  "__syscall_openat": ___syscall_openat,
  "__syscall_pipe": ___syscall_pipe,
  "__syscall_readlinkat": ___syscall_readlinkat,
  "__syscall_rmdir": ___syscall_rmdir,
  "__syscall_stat64": ___syscall_stat64,
  "__syscall_unlinkat": ___syscall_unlinkat,
  "_dlinit": __dlinit,
  "_dlopen_js": __dlopen_js,
  "_dlsym_js": __dlsym_js,
  "_emscripten_dlopen_js": __emscripten_dlopen_js,
  "_emscripten_get_now_is_monotonic": __emscripten_get_now_is_monotonic,
  "_gmtime_js": __gmtime_js,
  "_localtime_js": __localtime_js,
  "_mktime_js": __mktime_js,
  "_timegm_js": __timegm_js,
  "_tzset_js": __tzset_js,
  "abort": _abort,
  "emscripten_date_now": _emscripten_date_now,
  "emscripten_get_heap_max": _emscripten_get_heap_max,
  "emscripten_get_now": _emscripten_get_now,
  "emscripten_get_now_res": _emscripten_get_now_res,
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "environ_get": _environ_get,
  "environ_sizes_get": _environ_sizes_get,
  "exit": _exit,
  "fd_close": _fd_close,
  "fd_fdstat_get": _fd_fdstat_get,
  "fd_read": _fd_read,
  "fd_seek": _fd_seek,
  "fd_write": _fd_write,
  "getloadavg": _getloadavg,
  "proc_exit": _proc_exit
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
  return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_name = Module["_ar_name"] = function() {
  return (_ar_name = Module["_ar_name"] = Module["asm"]["ar_name"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strchr = Module["_strchr"] = function() {
  return (_strchr = Module["_strchr"] = Module["asm"]["strchr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strlen = Module["_strlen"] = function() {
  return (_strlen = Module["_strlen"] = Module["asm"]["strlen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fatal = Module["_fatal"] = function() {
  return (_fatal = Module["_fatal"] = Module["asm"]["fatal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_parse_name = Module["_ar_parse_name"] = function() {
  return (_ar_parse_name = Module["_ar_parse_name"] = Module["asm"]["ar_parse_name"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _xstrdup = Module["_xstrdup"] = function() {
  return (_xstrdup = Module["_xstrdup"] = Module["asm"]["xstrdup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_member_date = Module["_ar_member_date"] = function() {
  return (_ar_member_date = Module["_ar_member_date"] = Module["asm"]["ar_member_date"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lookup_file = Module["_lookup_file"] = function() {
  return (_lookup_file = Module["_lookup_file"] = Module["asm"]["lookup_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_exists_p = Module["_file_exists_p"] = function() {
  return (_file_exists_p = Module["_file_exists_p"] = Module["asm"]["file_exists_p"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcache_add = Module["_strcache_add"] = function() {
  return (_strcache_add = Module["_strcache_add"] = Module["asm"]["strcache_add"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _enter_file = Module["_enter_file"] = function() {
  return (_enter_file = Module["_enter_file"] = Module["asm"]["enter_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _f_mtime = Module["_f_mtime"] = function() {
  return (_f_mtime = Module["_f_mtime"] = Module["asm"]["f_mtime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_scan = Module["_ar_scan"] = function() {
  return (_ar_scan = Module["_ar_scan"] = Module["asm"]["ar_scan"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _free = Module["_free"] = function() {
  return (_free = Module["_free"] = Module["asm"]["free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_name_equal = Module["_ar_name_equal"] = function() {
  return (_ar_name_equal = Module["_ar_name_equal"] = Module["asm"]["ar_name_equal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_touch = Module["_ar_touch"] = function() {
  return (_ar_touch = Module["_ar_touch"] = Module["asm"]["ar_touch"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_member_touch = Module["_ar_member_touch"] = function() {
  return (_ar_member_touch = Module["_ar_member_touch"] = Module["asm"]["ar_member_touch"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _error = Module["_error"] = function() {
  return (_error = Module["_error"] = Module["asm"]["error"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _perror_with_name = Module["_perror_with_name"] = function() {
  return (_perror_with_name = Module["_perror_with_name"] = Module["asm"]["perror_with_name"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ar_glob = Module["_ar_glob"] = function() {
  return (_ar_glob = Module["_ar_glob"] = Module["asm"]["ar_glob"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _alpha_compare = Module["_alpha_compare"] = function() {
  return (_alpha_compare = Module["_alpha_compare"] = Module["asm"]["alpha_compare"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _qsort = Module["_qsort"] = function() {
  return (_qsort = Module["_qsort"] = Module["asm"]["qsort"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fnmatch = Module["_fnmatch"] = function() {
  return (_fnmatch = Module["_fnmatch"] = Module["asm"]["fnmatch"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _xcalloc = Module["_xcalloc"] = function() {
  return (_xcalloc = Module["_xcalloc"] = Module["asm"]["xcalloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _concat = Module["_concat"] = function() {
  return (_concat = Module["_concat"] = Module["asm"]["concat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _open = Module["_open"] = function() {
  return (_open = Module["_open"] = Module["asm"]["open"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _readbuf = Module["_readbuf"] = function() {
  return (_readbuf = Module["_readbuf"] = Module["asm"]["readbuf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lseek = Module["_lseek"] = function() {
  return (_lseek = Module["_lseek"] = Module["asm"]["lseek"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = function() {
  return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memcmp = Module["_memcmp"] = function() {
  return (_memcmp = Module["_memcmp"] = Module["asm"]["memcmp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_toui = Module["_make_toui"] = function() {
  return (_make_toui = Module["_make_toui"] = Module["asm"]["make_toui"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _close = Module["_close"] = function() {
  return (_close = Module["_close"] = Module["asm"]["close"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strrchr = Module["_strrchr"] = function() {
  return (_strrchr = Module["_strrchr"] = Module["asm"]["strrchr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strncmp = Module["_strncmp"] = function() {
  return (_strncmp = Module["_strncmp"] = Module["asm"]["strncmp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcmp = Module["_strcmp"] = function() {
  return (_strcmp = Module["_strcmp"] = Module["asm"]["strcmp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fstat = Module["_fstat"] = function() {
  return (_fstat = Module["_fstat"] = Module["asm"]["fstat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _snprintf = Module["_snprintf"] = function() {
  return (_snprintf = Module["_snprintf"] = Module["asm"]["snprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memset = Module["_memset"] = function() {
  return (_memset = Module["_memset"] = Module["asm"]["memset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _writebuf = Module["_writebuf"] = function() {
  return (_writebuf = Module["_writebuf"] = Module["asm"]["writebuf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _set_file_variables = Module["_set_file_variables"] = function() {
  return (_set_file_variables = Module["_set_file_variables"] = Module["asm"]["set_file_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memcpy = Module["_memcpy"] = function() {
  return (_memcpy = Module["_memcpy"] = Module["asm"]["memcpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcache_add_len = Module["_strcache_add_len"] = function() {
  return (_strcache_add_len = Module["_strcache_add_len"] = Module["asm"]["strcache_add_len"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _define_variable_in_set = Module["_define_variable_in_set"] = function() {
  return (_define_variable_in_set = Module["_define_variable_in_set"] = Module["asm"]["define_variable_in_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _xrealloc = Module["_xrealloc"] = function() {
  return (_xrealloc = Module["_xrealloc"] = Module["asm"]["xrealloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_init = Module["_hash_init"] = function() {
  return (_hash_init = Module["_hash_init"] = Module["asm"]["hash_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_find_slot = Module["_hash_find_slot"] = function() {
  return (_hash_find_slot = Module["_hash_find_slot"] = Module["asm"]["hash_find_slot"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_insert_at = Module["_hash_insert_at"] = function() {
  return (_hash_insert_at = Module["_hash_insert_at"] = Module["asm"]["hash_insert_at"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_find_item = Module["_hash_find_item"] = function() {
  return (_hash_find_item = Module["_hash_find_item"] = Module["asm"]["hash_find_item"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_free = Module["_hash_free"] = function() {
  return (_hash_free = Module["_hash_free"] = Module["asm"]["hash_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jhash_string = Module["_jhash_string"] = function() {
  return (_jhash_string = Module["_jhash_string"] = Module["asm"]["jhash_string"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _chop_commands = Module["_chop_commands"] = function() {
  return (_chop_commands = Module["_chop_commands"] = Module["asm"]["chop_commands"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _xmalloc = Module["_xmalloc"] = function() {
  return (_xmalloc = Module["_xmalloc"] = Module["asm"]["xmalloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _xstrndup = Module["_xstrndup"] = function() {
  return (_xstrndup = Module["_xstrndup"] = Module["asm"]["xstrndup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strstr = Module["_strstr"] = function() {
  return (_strstr = Module["_strstr"] = Module["asm"]["strstr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _execute_file_commands = Module["_execute_file_commands"] = function() {
  return (_execute_file_commands = Module["_execute_file_commands"] = Module["asm"]["execute_file_commands"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _set_command_state = Module["_set_command_state"] = function() {
  return (_set_command_state = Module["_set_command_state"] = Module["asm"]["set_command_state"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _notice_finished_file = Module["_notice_finished_file"] = function() {
  return (_notice_finished_file = Module["_notice_finished_file"] = Module["asm"]["notice_finished_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _initialize_file_variables = Module["_initialize_file_variables"] = function() {
  return (_initialize_file_variables = Module["_initialize_file_variables"] = Module["asm"]["initialize_file_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _unload_file = Module["_unload_file"] = function() {
  return (_unload_file = Module["_unload_file"] = Module["asm"]["unload_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _new_job = Module["_new_job"] = function() {
  return (_new_job = Module["_new_job"] = Module["asm"]["new_job"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fatal_error_signal = Module["_fatal_error_signal"] = function() {
  return (_fatal_error_signal = Module["_fatal_error_signal"] = Module["asm"]["fatal_error_signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _signal = Module["_signal"] = function() {
  return (_signal = Module["_signal"] = Module["asm"]["signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _temp_stdin_unlink = Module["_temp_stdin_unlink"] = function() {
  return (_temp_stdin_unlink = Module["_temp_stdin_unlink"] = Module["asm"]["temp_stdin_unlink"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_clear = Module["_osync_clear"] = function() {
  return (_osync_clear = Module["_osync_clear"] = Module["asm"]["osync_clear"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_clear = Module["_jobserver_clear"] = function() {
  return (_jobserver_clear = Module["_jobserver_clear"] = Module["asm"]["jobserver_clear"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _kill = Module["_kill"] = function() {
  return (_kill = Module["_kill"] = Module["asm"]["kill"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _reap_children = Module["_reap_children"] = function() {
  return (_reap_children = Module["_reap_children"] = Module["asm"]["reap_children"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remote_kill = Module["_remote_kill"] = function() {
  return (_remote_kill = Module["_remote_kill"] = Module["asm"]["remote_kill"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remove_intermediates = Module["_remove_intermediates"] = function() {
  return (_remove_intermediates = Module["_remove_intermediates"] = Module["asm"]["remove_intermediates"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_pid = Module["_make_pid"] = function() {
  return (_make_pid = Module["_make_pid"] = Module["asm"]["make_pid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pfatal_with_name = Module["_pfatal_with_name"] = function() {
  return (_pfatal_with_name = Module["_pfatal_with_name"] = Module["asm"]["pfatal_with_name"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _delete_child_targets = Module["_delete_child_targets"] = function() {
  return (_delete_child_targets = Module["_delete_child_targets"] = Module["asm"]["delete_child_targets"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stat = Module["_stat"] = function() {
  return (_stat = Module["_stat"] = Module["asm"]["stat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_timestamp_cons = Module["_file_timestamp_cons"] = function() {
  return (_file_timestamp_cons = Module["_file_timestamp_cons"] = Module["asm"]["file_timestamp_cons"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _unlink = Module["_unlink"] = function() {
  return (_unlink = Module["_unlink"] = Module["asm"]["unlink"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_commands = Module["_print_commands"] = function() {
  return (_print_commands = Module["_print_commands"] = Module["asm"]["print_commands"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fwrite = Module["_fwrite"] = function() {
  return (_fwrite = Module["_fwrite"] = Module["asm"]["fwrite"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _puts = Module["_puts"] = function() {
  return (_puts = Module["_puts"] = Module["asm"]["puts"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _iprintf = Module["_iprintf"] = function() {
  return (_iprintf = Module["_iprintf"] = Module["asm"]["iprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _set_default_suffixes = Module["_set_default_suffixes"] = function() {
  return (_set_default_suffixes = Module["_set_default_suffixes"] = Module["asm"]["set_default_suffixes"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _parse_file_seq = Module["_parse_file_seq"] = function() {
  return (_parse_file_seq = Module["_parse_file_seq"] = Module["asm"]["parse_file_seq"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _enter_prereqs = Module["_enter_prereqs"] = function() {
  return (_enter_prereqs = Module["_enter_prereqs"] = Module["asm"]["enter_prereqs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _install_default_suffix_rules = Module["_install_default_suffix_rules"] = function() {
  return (_install_default_suffix_rules = Module["_install_default_suffix_rules"] = Module["asm"]["install_default_suffix_rules"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _install_default_implicit_rules = Module["_install_default_implicit_rules"] = function() {
  return (_install_default_implicit_rules = Module["_install_default_implicit_rules"] = Module["asm"]["install_default_implicit_rules"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _install_pattern_rule = Module["_install_pattern_rule"] = function() {
  return (_install_pattern_rule = Module["_install_pattern_rule"] = Module["asm"]["install_pattern_rule"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _define_default_variables = Module["_define_default_variables"] = function() {
  return (_define_default_variables = Module["_define_default_variables"] = Module["asm"]["define_default_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _undefine_default_variables = Module["_undefine_default_variables"] = function() {
  return (_undefine_default_variables = Module["_undefine_default_variables"] = Module["asm"]["undefine_default_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _undefine_variable_in_set = Module["_undefine_variable_in_set"] = function() {
  return (_undefine_variable_in_set = Module["_undefine_variable_in_set"] = Module["asm"]["undefine_variable_in_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dir_file_exists_p = Module["_dir_file_exists_p"] = function() {
  return (_dir_file_exists_p = Module["_dir_file_exists_p"] = Module["asm"]["dir_file_exists_p"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _readdir = Module["_readdir"] = function() {
  return (_readdir = Module["_readdir"] = Module["asm"]["readdir"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _closedir = Module["_closedir"] = function() {
  return (_closedir = Module["_closedir"] = Module["asm"]["closedir"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fflush = Module["_fflush"] = function() {
  return (_fflush = Module["_fflush"] = Module["asm"]["fflush"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _opendir = Module["_opendir"] = function() {
  return (_opendir = Module["_opendir"] = Module["asm"]["opendir"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_impossible = Module["_file_impossible"] = function() {
  return (_file_impossible = Module["_file_impossible"] = Module["asm"]["file_impossible"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_insert = Module["_hash_insert"] = function() {
  return (_hash_insert = Module["_hash_insert"] = Module["asm"]["hash_insert"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_impossible_p = Module["_file_impossible_p"] = function() {
  return (_file_impossible_p = Module["_file_impossible_p"] = Module["asm"]["file_impossible_p"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dir_name = Module["_dir_name"] = function() {
  return (_dir_name = Module["_dir_name"] = Module["asm"]["dir_name"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_dir_data_base = Module["_print_dir_data_base"] = function() {
  return (_print_dir_data_base = Module["_print_dir_data_base"] = Module["asm"]["print_dir_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dir_setup_glob = Module["_dir_setup_glob"] = function() {
  return (_dir_setup_glob = Module["_dir_setup_glob"] = Module["asm"]["dir_setup_glob"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lstat = Module["_lstat"] = function() {
  return (_lstat = Module["_lstat"] = Module["asm"]["lstat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_init_directories = Module["_hash_init_directories"] = function() {
  return (_hash_init_directories = Module["_hash_init_directories"] = Module["asm"]["hash_init_directories"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _variable_buffer_output = Module["_variable_buffer_output"] = function() {
  return (_variable_buffer_output = Module["_variable_buffer_output"] = Module["asm"]["variable_buffer_output"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _initialize_variable_output = Module["_initialize_variable_output"] = function() {
  return (_initialize_variable_output = Module["_initialize_variable_output"] = Module["asm"]["initialize_variable_output"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _recursively_expand_for_file = Module["_recursively_expand_for_file"] = function() {
  return (_recursively_expand_for_file = Module["_recursively_expand_for_file"] = Module["asm"]["recursively_expand_for_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _variable_expand_string = Module["_variable_expand_string"] = function() {
  return (_variable_expand_string = Module["_variable_expand_string"] = Module["asm"]["variable_expand_string"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _allocated_variable_expand_for_file = Module["_allocated_variable_expand_for_file"] = function() {
  return (_allocated_variable_expand_for_file = Module["_allocated_variable_expand_for_file"] = Module["asm"]["allocated_variable_expand_for_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _handle_function = Module["_handle_function"] = function() {
  return (_handle_function = Module["_handle_function"] = Module["asm"]["handle_function"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lindex = Module["_lindex"] = function() {
  return (_lindex = Module["_lindex"] = Module["asm"]["lindex"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _expand_argument = Module["_expand_argument"] = function() {
  return (_expand_argument = Module["_expand_argument"] = Module["asm"]["expand_argument"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lookup_variable = Module["_lookup_variable"] = function() {
  return (_lookup_variable = Module["_lookup_variable"] = Module["asm"]["lookup_variable"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _find_percent = Module["_find_percent"] = function() {
  return (_find_percent = Module["_find_percent"] = Module["asm"]["find_percent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _patsubst_expand_pat = Module["_patsubst_expand_pat"] = function() {
  return (_patsubst_expand_pat = Module["_patsubst_expand_pat"] = Module["asm"]["patsubst_expand_pat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _variable_expand = Module["_variable_expand"] = function() {
  return (_variable_expand = Module["_variable_expand"] = Module["asm"]["variable_expand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _variable_expand_for_file = Module["_variable_expand_for_file"] = function() {
  return (_variable_expand_for_file = Module["_variable_expand_for_file"] = Module["asm"]["variable_expand_for_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _install_variable_buffer = Module["_install_variable_buffer"] = function() {
  return (_install_variable_buffer = Module["_install_variable_buffer"] = Module["asm"]["install_variable_buffer"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _restore_variable_buffer = Module["_restore_variable_buffer"] = function() {
  return (_restore_variable_buffer = Module["_restore_variable_buffer"] = Module["asm"]["restore_variable_buffer"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lookup_variable_in_set = Module["_lookup_variable_in_set"] = function() {
  return (_lookup_variable_in_set = Module["_lookup_variable_in_set"] = Module["asm"]["lookup_variable_in_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _rehash_file = Module["_rehash_file"] = function() {
  return (_rehash_file = Module["_rehash_file"] = Module["asm"]["rehash_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_delete = Module["_hash_delete"] = function() {
  return (_hash_delete = Module["_hash_delete"] = Module["asm"]["hash_delete"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _merge_variable_set_lists = Module["_merge_variable_set_lists"] = function() {
  return (_merge_variable_set_lists = Module["_merge_variable_set_lists"] = Module["asm"]["merge_variable_set_lists"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _rename_file = Module["_rename_file"] = function() {
  return (_rename_file = Module["_rename_file"] = Module["asm"]["rename_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _putchar = Module["_putchar"] = function() {
  return (_putchar = Module["_putchar"] = Module["asm"]["putchar"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fputs = Module["_fputs"] = function() {
  return (_fputs = Module["_fputs"] = Module["asm"]["fputs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _split_prereqs = Module["_split_prereqs"] = function() {
  return (_split_prereqs = Module["_split_prereqs"] = Module["asm"]["split_prereqs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memmove = Module["_memmove"] = function() {
  return (_memmove = Module["_memmove"] = Module["asm"]["memmove"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _expand_deps = Module["_expand_deps"] = function() {
  return (_expand_deps = Module["_expand_deps"] = Module["asm"]["expand_deps"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _end_of_token = Module["_end_of_token"] = function() {
  return (_end_of_token = Module["_end_of_token"] = Module["asm"]["end_of_token"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcpy = Module["_strcpy"] = function() {
  return (_strcpy = Module["_strcpy"] = Module["asm"]["strcpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _shuffle_deps_recursive = Module["_shuffle_deps_recursive"] = function() {
  return (_shuffle_deps_recursive = Module["_shuffle_deps_recursive"] = Module["asm"]["shuffle_deps_recursive"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _expand_extra_prereqs = Module["_expand_extra_prereqs"] = function() {
  return (_expand_extra_prereqs = Module["_expand_extra_prereqs"] = Module["asm"]["expand_extra_prereqs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _snap_deps = Module["_snap_deps"] = function() {
  return (_snap_deps = Module["_snap_deps"] = Module["asm"]["snap_deps"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_map_arg = Module["_hash_map_arg"] = function() {
  return (_hash_map_arg = Module["_hash_map_arg"] = Module["asm"]["hash_map_arg"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _free_ns_chain = Module["_free_ns_chain"] = function() {
  return (_free_ns_chain = Module["_free_ns_chain"] = Module["asm"]["free_ns_chain"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _copy_dep_chain = Module["_copy_dep_chain"] = function() {
  return (_copy_dep_chain = Module["_copy_dep_chain"] = Module["asm"]["copy_dep_chain"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_timestamp_sprintf = Module["_file_timestamp_sprintf"] = function() {
  return (_file_timestamp_sprintf = Module["_file_timestamp_sprintf"] = Module["asm"]["file_timestamp_sprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _localtime = Module["_localtime"] = function() {
  return (_localtime = Module["_localtime"] = Module["asm"]["localtime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _siprintf = Module["_siprintf"] = function() {
  return (_siprintf = Module["_siprintf"] = Module["asm"]["siprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _file_timestamp_now = Module["_file_timestamp_now"] = function() {
  return (_file_timestamp_now = Module["_file_timestamp_now"] = Module["asm"]["file_timestamp_now"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _clock_gettime = Module["_clock_gettime"] = function() {
  return (_clock_gettime = Module["_clock_gettime"] = Module["asm"]["clock_gettime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _time = Module["_time"] = function() {
  return (_time = Module["_time"] = Module["asm"]["time"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_prereqs = Module["_print_prereqs"] = function() {
  return (_print_prereqs = Module["_print_prereqs"] = Module["asm"]["print_prereqs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_file_data_base = Module["_print_file_data_base"] = function() {
  return (_print_file_data_base = Module["_print_file_data_base"] = Module["asm"]["print_file_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_map = Module["_hash_map"] = function() {
  return (_hash_map = Module["_hash_map"] = Module["asm"]["hash_map"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_print_stats = Module["_hash_print_stats"] = function() {
  return (_hash_print_stats = Module["_hash_print_stats"] = Module["asm"]["hash_print_stats"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_target_variables = Module["_print_target_variables"] = function() {
  return (_print_target_variables = Module["_print_target_variables"] = Module["asm"]["print_target_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_file_variables = Module["_print_file_variables"] = function() {
  return (_print_file_variables = Module["_print_file_variables"] = Module["asm"]["print_file_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _verify_file_data_base = Module["_verify_file_data_base"] = function() {
  return (_verify_file_data_base = Module["_verify_file_data_base"] = Module["asm"]["verify_file_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcache_iscached = Module["_strcache_iscached"] = function() {
  return (_strcache_iscached = Module["_strcache_iscached"] = Module["asm"]["strcache_iscached"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _build_target_list = Module["_build_target_list"] = function() {
  return (_build_target_list = Module["_build_target_list"] = Module["asm"]["build_target_list"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _init_hash_files = Module["_init_hash_files"] = function() {
  return (_init_hash_files = Module["_init_hash_files"] = Module["asm"]["init_hash_files"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _subst_expand = Module["_subst_expand"] = function() {
  return (_subst_expand = Module["_subst_expand"] = Module["asm"]["subst_expand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _next_token = Module["_next_token"] = function() {
  return (_next_token = Module["_next_token"] = Module["asm"]["next_token"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _find_next_token = Module["_find_next_token"] = function() {
  return (_find_next_token = Module["_find_next_token"] = Module["asm"]["find_next_token"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _patsubst_expand = Module["_patsubst_expand"] = function() {
  return (_patsubst_expand = Module["_patsubst_expand"] = Module["asm"]["patsubst_expand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pattern_matches = Module["_pattern_matches"] = function() {
  return (_pattern_matches = Module["_pattern_matches"] = Module["asm"]["pattern_matches"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strip_whitespace = Module["_strip_whitespace"] = function() {
  return (_strip_whitespace = Module["_strip_whitespace"] = Module["asm"]["strip_whitespace"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _shell_completed = Module["_shell_completed"] = function() {
  return (_shell_completed = Module["_shell_completed"] = Module["asm"]["shell_completed"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _func_shell_base = Module["_func_shell_base"] = function() {
  return (_func_shell_base = Module["_func_shell_base"] = Module["asm"]["func_shell_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _construct_command_argv = Module["_construct_command_argv"] = function() {
  return (_construct_command_argv = Module["_construct_command_argv"] = Module["asm"]["construct_command_argv"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _output_start = Module["_output_start"] = function() {
  return (_output_start = Module["_output_start"] = Module["asm"]["output_start"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fileno = Module["_fileno"] = function() {
  return (_fileno = Module["_fileno"] = Module["asm"]["fileno"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _target_environment = Module["_target_environment"] = function() {
  return (_target_environment = Module["_target_environment"] = Module["asm"]["target_environment"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pipe = Module["_pipe"] = function() {
  return (_pipe = Module["_pipe"] = Module["asm"]["pipe"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strerror = Module["_strerror"] = function() {
  return (_strerror = Module["_strerror"] = Module["asm"]["strerror"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fd_noinherit = Module["_fd_noinherit"] = function() {
  return (_fd_noinherit = Module["_fd_noinherit"] = Module["asm"]["fd_noinherit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _child_execute_job = Module["_child_execute_job"] = function() {
  return (_child_execute_job = Module["_child_execute_job"] = Module["asm"]["child_execute_job"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _read = Module["_read"] = function() {
  return (_read = Module["_read"] = Module["asm"]["read"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remove = Module["_remove"] = function() {
  return (_remove = Module["_remove"] = Module["asm"]["remove"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _free_childbase = Module["_free_childbase"] = function() {
  return (_free_childbase = Module["_free_childbase"] = Module["asm"]["free_childbase"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _define_new_function = Module["_define_new_function"] = function() {
  return (_define_new_function = Module["_define_new_function"] = Module["asm"]["define_new_function"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_init_function_table = Module["_hash_init_function_table"] = function() {
  return (_hash_init_function_table = Module["_hash_init_function_table"] = Module["asm"]["hash_init_function_table"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_load = Module["_hash_load"] = function() {
  return (_hash_load = Module["_hash_load"] = Module["asm"]["hash_load"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jhash = Module["_jhash"] = function() {
  return (_jhash = Module["_jhash"] = Module["asm"]["jhash"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strncpy = Module["_strncpy"] = function() {
  return (_strncpy = Module["_strncpy"] = Module["asm"]["strncpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _realpath = Module["_realpath"] = function() {
  return (_realpath = Module["_realpath"] = Module["asm"]["realpath"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_lltoa = Module["_make_lltoa"] = function() {
  return (_make_lltoa = Module["_make_lltoa"] = Module["asm"]["make_lltoa"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _push_new_variable_scope = Module["_push_new_variable_scope"] = function() {
  return (_push_new_variable_scope = Module["_push_new_variable_scope"] = Module["asm"]["push_new_variable_scope"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pop_variable_scope = Module["_pop_variable_scope"] = function() {
  return (_pop_variable_scope = Module["_pop_variable_scope"] = Module["asm"]["pop_variable_scope"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _outputs = Module["_outputs"] = function() {
  return (_outputs = Module["_outputs"] = Module["asm"]["outputs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _eval_buffer = Module["_eval_buffer"] = function() {
  return (_eval_buffer = Module["_eval_buffer"] = Module["asm"]["eval_buffer"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fopen = Module["_fopen"] = function() {
  return (_fopen = Module["_fopen"] = Module["asm"]["fopen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fread = Module["_fread"] = function() {
  return (_fread = Module["_fread"] = Module["asm"]["fread"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ferror = Module["_ferror"] = function() {
  return (_ferror = Module["_ferror"] = Module["asm"]["ferror"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _feof = Module["_feof"] = function() {
  return (_feof = Module["_feof"] = Module["asm"]["feof"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fclose = Module["_fclose"] = function() {
  return (_fclose = Module["_fclose"] = Module["asm"]["fclose"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fputc = Module["_fputc"] = function() {
  return (_fputc = Module["_fputc"] = Module["asm"]["fputc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtoll = Module["_strtoll"] = function() {
  return (_strtoll = Module["_strtoll"] = Module["asm"]["strtoll"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __getopt_internal = Module["__getopt_internal"] = function() {
  return (__getopt_internal = Module["__getopt_internal"] = Module["asm"]["_getopt_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getenv = Module["_getenv"] = function() {
  return (_getenv = Module["_getenv"] = Module["asm"]["getenv"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fiprintf = Module["_fiprintf"] = function() {
  return (_fiprintf = Module["_fiprintf"] = Module["asm"]["fiprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getopt = Module["_getopt"] = function() {
  return (_getopt = Module["_getopt"] = Module["asm"]["getopt"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getopt_long = Module["_getopt_long"] = function() {
  return (_getopt_long = Module["_getopt_long"] = Module["asm"]["getopt_long"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getopt_long_only = Module["_getopt_long_only"] = function() {
  return (_getopt_long_only = Module["_getopt_long_only"] = Module["asm"]["getopt_long_only"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _guile_gmake_setup = Module["_guile_gmake_setup"] = function() {
  return (_guile_gmake_setup = Module["_guile_gmake_setup"] = Module["asm"]["guile_gmake_setup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_delete_at = Module["_hash_delete_at"] = function() {
  return (_hash_delete_at = Module["_hash_delete_at"] = Module["asm"]["hash_delete_at"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_free_items = Module["_hash_free_items"] = function() {
  return (_hash_free_items = Module["_hash_free_items"] = Module["asm"]["hash_free_items"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_delete_items = Module["_hash_delete_items"] = function() {
  return (_hash_delete_items = Module["_hash_delete_items"] = Module["asm"]["hash_delete_items"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_fprintf = Module["___small_fprintf"] = function() {
  return (___small_fprintf = Module["___small_fprintf"] = Module["asm"]["__small_fprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _hash_dump = Module["_hash_dump"] = function() {
  return (_hash_dump = Module["_hash_dump"] = Module["asm"]["hash_dump"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _try_implicit_rule = Module["_try_implicit_rule"] = function() {
  return (_try_implicit_rule = Module["_try_implicit_rule"] = Module["asm"]["try_implicit_rule"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_spaces = Module["_print_spaces"] = function() {
  return (_print_spaces = Module["_print_spaces"] = Module["asm"]["print_spaces"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memrchr = Module["_memrchr"] = function() {
  return (_memrchr = Module["_memrchr"] = Module["asm"]["memrchr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _get_rule_defn = Module["_get_rule_defn"] = function() {
  return (_get_rule_defn = Module["_get_rule_defn"] = Module["asm"]["get_rule_defn"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stemlen_compare = Module["_stemlen_compare"] = function() {
  return (_stemlen_compare = Module["_stemlen_compare"] = Module["asm"]["stemlen_compare"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vpath_search = Module["_vpath_search"] = function() {
  return (_vpath_search = Module["_vpath_search"] = Module["asm"]["vpath_search"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _free_variable_set = Module["_free_variable_set"] = function() {
  return (_free_variable_set = Module["_free_variable_set"] = Module["asm"]["free_variable_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _is_bourne_compatible_shell = Module["_is_bourne_compatible_shell"] = function() {
  return (_is_bourne_compatible_shell = Module["_is_bourne_compatible_shell"] = Module["asm"]["is_bourne_compatible_shell"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _unblock_all_sigs = Module["_unblock_all_sigs"] = function() {
  return (_unblock_all_sigs = Module["_unblock_all_sigs"] = Module["asm"]["unblock_all_sigs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigemptyset = Module["_sigemptyset"] = function() {
  return (_sigemptyset = Module["_sigemptyset"] = Module["asm"]["sigemptyset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigprocmask = Module["_sigprocmask"] = function() {
  return (_sigprocmask = Module["_sigprocmask"] = Module["asm"]["sigprocmask"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _child_handler = Module["_child_handler"] = function() {
  return (_child_handler = Module["_child_handler"] = Module["asm"]["child_handler"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_signal = Module["_jobserver_signal"] = function() {
  return (_jobserver_signal = Module["_jobserver_signal"] = Module["asm"]["jobserver_signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remote_status = Module["_remote_status"] = function() {
  return (_remote_status = Module["_remote_status"] = Module["asm"]["remote_status"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _waitpid = Module["_waitpid"] = function() {
  return (_waitpid = Module["_waitpid"] = Module["asm"]["waitpid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _wait = Module["_wait"] = function() {
  return (_wait = Module["_wait"] = Module["asm"]["wait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _output_dump = Module["_output_dump"] = function() {
  return (_output_dump = Module["_output_dump"] = Module["asm"]["output_dump"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _start_remote_job_p = Module["_start_remote_job_p"] = function() {
  return (_start_remote_job_p = Module["_start_remote_job_p"] = Module["asm"]["start_remote_job_p"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _die = Module["_die"] = function() {
  return (_die = Module["_die"] = Module["asm"]["die"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _shuffle_get_mode = Module["_shuffle_get_mode"] = function() {
  return (_shuffle_get_mode = Module["_shuffle_get_mode"] = Module["asm"]["shuffle_get_mode"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _show_goal_error = Module["_show_goal_error"] = function() {
  return (_show_goal_error = Module["_show_goal_error"] = Module["asm"]["show_goal_error"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strsignal = Module["_strsignal"] = function() {
  return (_strsignal = Module["_strsignal"] = Module["asm"]["strsignal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _message = Module["_message"] = function() {
  return (_message = Module["_message"] = Module["asm"]["message"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _get_bad_stdin = Module["_get_bad_stdin"] = function() {
  return (_get_bad_stdin = Module["_get_bad_stdin"] = Module["asm"]["get_bad_stdin"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _start_remote_job = Module["_start_remote_job"] = function() {
  return (_start_remote_job = Module["_start_remote_job"] = Module["asm"]["start_remote_job"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_pre_child = Module["_jobserver_pre_child"] = function() {
  return (_jobserver_pre_child = Module["_jobserver_pre_child"] = Module["asm"]["jobserver_pre_child"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_post_child = Module["_jobserver_post_child"] = function() {
  return (_jobserver_post_child = Module["_jobserver_post_child"] = Module["asm"]["jobserver_post_child"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _output_close = Module["_output_close"] = function() {
  return (_output_close = Module["_output_close"] = Module["asm"]["output_close"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_enabled = Module["_jobserver_enabled"] = function() {
  return (_jobserver_enabled = Module["_jobserver_enabled"] = Module["asm"]["jobserver_enabled"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_release = Module["_jobserver_release"] = function() {
  return (_jobserver_release = Module["_jobserver_release"] = Module["asm"]["jobserver_release"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _output_init = Module["_output_init"] = function() {
  return (_output_init = Module["_output_init"] = Module["asm"]["output_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_pre_acquire = Module["_jobserver_pre_acquire"] = function() {
  return (_jobserver_pre_acquire = Module["_jobserver_pre_acquire"] = Module["asm"]["jobserver_pre_acquire"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_acquire = Module["_jobserver_acquire"] = function() {
  return (_jobserver_acquire = Module["_jobserver_acquire"] = Module["asm"]["jobserver_acquire"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _start_waiting_jobs = Module["_start_waiting_jobs"] = function() {
  return (_start_waiting_jobs = Module["_start_waiting_jobs"] = Module["asm"]["start_waiting_jobs"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_printf = Module["___small_printf"] = function() {
  return (___small_printf = Module["___small_printf"] = Module["asm"]["__small_printf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawnattr_init = Module["_posix_spawnattr_init"] = function() {
  return (_posix_spawnattr_init = Module["_posix_spawnattr_init"] = Module["asm"]["posix_spawnattr_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = function() {
  return (_posix_spawn_file_actions_init = Module["_posix_spawn_file_actions_init"] = Module["asm"]["posix_spawn_file_actions_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawnattr_destroy = Module["_posix_spawnattr_destroy"] = function() {
  return (_posix_spawnattr_destroy = Module["_posix_spawnattr_destroy"] = Module["asm"]["posix_spawnattr_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawnattr_setsigmask = Module["_posix_spawnattr_setsigmask"] = function() {
  return (_posix_spawnattr_setsigmask = Module["_posix_spawnattr_setsigmask"] = Module["asm"]["posix_spawnattr_setsigmask"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = function() {
  return (_posix_spawn_file_actions_adddup2 = Module["_posix_spawn_file_actions_adddup2"] = Module["asm"]["posix_spawn_file_actions_adddup2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawnattr_setflags = Module["_posix_spawnattr_setflags"] = function() {
  return (_posix_spawnattr_setflags = Module["_posix_spawnattr_setflags"] = Module["asm"]["posix_spawnattr_setflags"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _confstr = Module["_confstr"] = function() {
  return (_confstr = Module["_confstr"] = Module["asm"]["confstr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _find_in_given_path = Module["_find_in_given_path"] = function() {
  return (_find_in_given_path = Module["_find_in_given_path"] = Module["asm"]["find_in_given_path"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawn = Module["_posix_spawn"] = function() {
  return (_posix_spawn = Module["_posix_spawn"] = Module["asm"]["posix_spawn"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = function() {
  return (_posix_spawn_file_actions_destroy = Module["_posix_spawn_file_actions_destroy"] = Module["asm"]["posix_spawn_file_actions_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _exec_command = Module["_exec_command"] = function() {
  return (_exec_command = Module["_exec_command"] = Module["asm"]["exec_command"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _execvp = Module["_execvp"] = function() {
  return (_execvp = Module["_execvp"] = Module["asm"]["execvp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memchr = Module["_memchr"] = function() {
  return (_memchr = Module["_memchr"] = Module["asm"]["memchr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stpcpy = Module["_stpcpy"] = function() {
  return (_stpcpy = Module["_stpcpy"] = Module["asm"]["stpcpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _load_file = Module["_load_file"] = function() {
  return (_load_file = Module["_load_file"] = Module["asm"]["load_file"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isalnum = Module["_isalnum"] = function() {
  return (_isalnum = Module["_isalnum"] = Module["asm"]["isalnum"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dlopen = Module["_dlopen"] = function() {
  return (_dlopen = Module["_dlopen"] = Module["asm"]["dlopen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dlsym = Module["_dlsym"] = function() {
  return (_dlsym = Module["_dlsym"] = Module["asm"]["dlsym"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dlerror = Module["_dlerror"] = function() {
  return (_dlerror = Module["_dlerror"] = Module["asm"]["dlerror"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _do_variable_definition = Module["_do_variable_definition"] = function() {
  return (_do_variable_definition = Module["_do_variable_definition"] = Module["asm"]["do_variable_definition"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dlclose = Module["_dlclose"] = function() {
  return (_dlclose = Module["_dlclose"] = Module["asm"]["dlclose"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmk_alloc = Module["_gmk_alloc"] = function() {
  return (_gmk_alloc = Module["_gmk_alloc"] = Module["asm"]["gmk_alloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmk_free = Module["_gmk_free"] = function() {
  return (_gmk_free = Module["_gmk_free"] = Module["asm"]["gmk_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmk_eval = Module["_gmk_eval"] = function() {
  return (_gmk_eval = Module["_gmk_eval"] = Module["asm"]["gmk_eval"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmk_expand = Module["_gmk_expand"] = function() {
  return (_gmk_expand = Module["_gmk_expand"] = Module["asm"]["gmk_expand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmk_add_function = Module["_gmk_add_function"] = function() {
  return (_gmk_add_function = Module["_gmk_add_function"] = Module["asm"]["gmk_add_function"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _main = Module["_main"] = function() {
  return (_main = Module["_main"] = Module["asm"]["main"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _bsd_signal = Module["_bsd_signal"] = function() {
  return (_bsd_signal = Module["_bsd_signal"] = Module["asm"]["bsd_signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _check_io_state = Module["_check_io_state"] = function() {
  return (_check_io_state = Module["_check_io_state"] = Module["asm"]["check_io_state"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _atexit = Module["_atexit"] = function() {
  return (_atexit = Module["_atexit"] = Module["asm"]["atexit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isspace = Module["_isspace"] = function() {
  return (_isspace = Module["_isspace"] = Module["asm"]["isspace"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _setlocale = Module["_setlocale"] = function() {
  return (_setlocale = Module["_setlocale"] = Module["asm"]["setlocale"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigaddset = Module["_sigaddset"] = function() {
  return (_sigaddset = Module["_sigaddset"] = Module["asm"]["sigaddset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _init_hash_global_variable_set = Module["_init_hash_global_variable_set"] = function() {
  return (_init_hash_global_variable_set = Module["_init_hash_global_variable_set"] = Module["asm"]["init_hash_global_variable_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcache_init = Module["_strcache_init"] = function() {
  return (_strcache_init = Module["_strcache_init"] = Module["asm"]["strcache_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _get_tmpdir = Module["_get_tmpdir"] = function() {
  return (_get_tmpdir = Module["_get_tmpdir"] = Module["asm"]["get_tmpdir"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getcwd = Module["_getcwd"] = function() {
  return (_getcwd = Module["_getcwd"] = Module["asm"]["getcwd"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _decode_env_switches = Module["_decode_env_switches"] = function() {
  return (_decode_env_switches = Module["_decode_env_switches"] = Module["asm"]["decode_env_switches"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _setvbuf = Module["_setvbuf"] = function() {
  return (_setvbuf = Module["_setvbuf"] = Module["asm"]["setvbuf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _shuffle_set_mode = Module["_shuffle_set_mode"] = function() {
  return (_shuffle_set_mode = Module["_shuffle_set_mode"] = Module["asm"]["shuffle_set_mode"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isatty = Module["_isatty"] = function() {
  return (_isatty = Module["_isatty"] = Module["asm"]["isatty"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ttyname = Module["_ttyname"] = function() {
  return (_ttyname = Module["_ttyname"] = Module["asm"]["ttyname"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _chdir = Module["_chdir"] = function() {
  return (_chdir = Module["_chdir"] = Module["asm"]["chdir"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_parse_auth = Module["_jobserver_parse_auth"] = function() {
  return (_jobserver_parse_auth = Module["_jobserver_parse_auth"] = Module["asm"]["jobserver_parse_auth"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _get_tmpfile = Module["_get_tmpfile"] = function() {
  return (_get_tmpfile = Module["_get_tmpfile"] = Module["asm"]["get_tmpfile"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _define_automatic_variables = Module["_define_automatic_variables"] = function() {
  return (_define_automatic_variables = Module["_define_automatic_variables"] = Module["asm"]["define_automatic_variables"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _read_all_makefiles = Module["_read_all_makefiles"] = function() {
  return (_read_all_makefiles = Module["_read_all_makefiles"] = Module["asm"]["read_all_makefiles"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_setup = Module["_jobserver_setup"] = function() {
  return (_jobserver_setup = Module["_jobserver_setup"] = Module["asm"]["jobserver_setup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_get_auth = Module["_jobserver_get_auth"] = function() {
  return (_jobserver_get_auth = Module["_jobserver_get_auth"] = Module["asm"]["jobserver_get_auth"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_setup = Module["_osync_setup"] = function() {
  return (_osync_setup = Module["_osync_setup"] = Module["asm"]["osync_setup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_get_mutex = Module["_osync_get_mutex"] = function() {
  return (_osync_get_mutex = Module["_osync_get_mutex"] = Module["asm"]["osync_get_mutex"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_parse_mutex = Module["_osync_parse_mutex"] = function() {
  return (_osync_parse_mutex = Module["_osync_parse_mutex"] = Module["asm"]["osync_parse_mutex"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _convert_to_pattern = Module["_convert_to_pattern"] = function() {
  return (_convert_to_pattern = Module["_convert_to_pattern"] = Module["asm"]["convert_to_pattern"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _snap_implicit_rules = Module["_snap_implicit_rules"] = function() {
  return (_snap_implicit_rules = Module["_snap_implicit_rules"] = Module["asm"]["snap_implicit_rules"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _build_vpath_lists = Module["_build_vpath_lists"] = function() {
  return (_build_vpath_lists = Module["_build_vpath_lists"] = Module["asm"]["build_vpath_lists"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remote_setup = Module["_remote_setup"] = function() {
  return (_remote_setup = Module["_remote_setup"] = Module["asm"]["remote_setup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _update_goal_chain = Module["_update_goal_chain"] = function() {
  return (_update_goal_chain = Module["_update_goal_chain"] = Module["asm"]["update_goal_chain"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _putenv = Module["_putenv"] = function() {
  return (_putenv = Module["_putenv"] = Module["asm"]["putenv"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __exit = Module["__exit"] = function() {
  return (__exit = Module["__exit"] = Module["asm"]["_exit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _atof = Module["_atof"] = function() {
  return (_atof = Module["_atof"] = Module["asm"]["atof"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tolower = Module["_tolower"] = function() {
  return (_tolower = Module["_tolower"] = Module["asm"]["tolower"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _construct_include_path = Module["_construct_include_path"] = function() {
  return (_construct_include_path = Module["_construct_include_path"] = Module["asm"]["construct_include_path"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _remote_cleanup = Module["_remote_cleanup"] = function() {
  return (_remote_cleanup = Module["_remote_cleanup"] = Module["asm"]["remote_cleanup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_sprintf = Module["___small_sprintf"] = function() {
  return (___small_sprintf = Module["___small_sprintf"] = Module["asm"]["__small_sprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ctime = Module["_ctime"] = function() {
  return (_ctime = Module["_ctime"] = Module["asm"]["ctime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_variable_data_base = Module["_print_variable_data_base"] = function() {
  return (_print_variable_data_base = Module["_print_variable_data_base"] = Module["asm"]["print_variable_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_rule_data_base = Module["_print_rule_data_base"] = function() {
  return (_print_rule_data_base = Module["_print_rule_data_base"] = Module["asm"]["print_rule_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _print_vpath_data_base = Module["_print_vpath_data_base"] = function() {
  return (_print_vpath_data_base = Module["_print_vpath_data_base"] = Module["asm"]["print_vpath_data_base"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcache_print_stats = Module["_strcache_print_stats"] = function() {
  return (_strcache_print_stats = Module["_strcache_print_stats"] = Module["asm"]["strcache_print_stats"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_acquire_all = Module["_jobserver_acquire_all"] = function() {
  return (_jobserver_acquire_all = Module["_jobserver_acquire_all"] = Module["asm"]["jobserver_acquire_all"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _try_variable_definition = Module["_try_variable_definition"] = function() {
  return (_try_variable_definition = Module["_try_variable_definition"] = Module["asm"]["try_variable_definition"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tilde_expand = Module["_tilde_expand"] = function() {
  return (_tilde_expand = Module["_tilde_expand"] = Module["asm"]["tilde_expand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtoul = Module["_strtoul"] = function() {
  return (_strtoul = Module["_strtoul"] = Module["asm"]["strtoul"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_ulltoa = Module["_make_ulltoa"] = function() {
  return (_make_ulltoa = Module["_make_ulltoa"] = Module["asm"]["make_ulltoa"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_seed = Module["_make_seed"] = function() {
  return (_make_seed = Module["_make_seed"] = Module["asm"]["make_seed"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _make_rand = Module["_make_rand"] = function() {
  return (_make_rand = Module["_make_rand"] = Module["asm"]["make_rand"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpid = Module["_getpid"] = function() {
  return (_getpid = Module["_getpid"] = Module["asm"]["getpid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _collapse_continuations = Module["_collapse_continuations"] = function() {
  return (_collapse_continuations = Module["_collapse_continuations"] = Module["asm"]["collapse_continuations"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _realloc = Module["_realloc"] = function() {
  return (_realloc = Module["_realloc"] = Module["asm"]["realloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = function() {
  return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _out_of_memory = Module["_out_of_memory"] = function() {
  return (_out_of_memory = Module["_out_of_memory"] = Module["asm"]["out_of_memory"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _calloc = Module["_calloc"] = function() {
  return (_calloc = Module["_calloc"] = Module["asm"]["calloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strdup = Module["_strdup"] = function() {
  return (_strdup = Module["_strdup"] = Module["asm"]["strdup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strndup = Module["_strndup"] = function() {
  return (_strndup = Module["_strndup"] = Module["asm"]["strndup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _write = Module["_write"] = function() {
  return (_write = Module["_write"] = Module["asm"]["write"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _get_tmpfd = Module["_get_tmpfd"] = function() {
  return (_get_tmpfd = Module["_get_tmpfd"] = Module["asm"]["get_tmpfd"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _os_anontmp = Module["_os_anontmp"] = function() {
  return (_os_anontmp = Module["_os_anontmp"] = Module["asm"]["os_anontmp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _umask = Module["_umask"] = function() {
  return (_umask = Module["_umask"] = Module["asm"]["umask"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mkstemp = Module["_mkstemp"] = function() {
  return (_mkstemp = Module["_mkstemp"] = Module["asm"]["mkstemp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fdopen = Module["_fdopen"] = function() {
  return (_fdopen = Module["_fdopen"] = Module["asm"]["fdopen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _output_tmpfd = Module["_output_tmpfd"] = function() {
  return (_output_tmpfd = Module["_output_tmpfd"] = Module["asm"]["output_tmpfd"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fd_set_append = Module["_fd_set_append"] = function() {
  return (_fd_set_append = Module["_fd_set_append"] = Module["asm"]["fd_set_append"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_acquire = Module["_osync_acquire"] = function() {
  return (_osync_acquire = Module["_osync_acquire"] = Module["asm"]["osync_acquire"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_release = Module["_osync_release"] = function() {
  return (_osync_release = Module["_osync_release"] = Module["asm"]["osync_release"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ftruncate = Module["_ftruncate"] = function() {
  return (_ftruncate = Module["_ftruncate"] = Module["asm"]["ftruncate"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vsprintf = Module["_vsprintf"] = function() {
  return (_vsprintf = Module["_vsprintf"] = Module["asm"]["vsprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _perror = Module["_perror"] = function() {
  return (_perror = Module["_perror"] = Module["asm"]["perror"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _parse_variable_definition = Module["_parse_variable_definition"] = function() {
  return (_parse_variable_definition = Module["_parse_variable_definition"] = Module["asm"]["parse_variable_definition"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _construct_vpath_list = Module["_construct_vpath_list"] = function() {
  return (_construct_vpath_list = Module["_construct_vpath_list"] = Module["asm"]["construct_vpath_list"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _find_percent_cached = Module["_find_percent_cached"] = function() {
  return (_find_percent_cached = Module["_find_percent_cached"] = Module["asm"]["find_percent_cached"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getlogin = Module["_getlogin"] = function() {
  return (_getlogin = Module["_getlogin"] = Module["asm"]["getlogin"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpwnam = Module["_getpwnam"] = function() {
  return (_getpwnam = Module["_getpwnam"] = Module["asm"]["getpwnam"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strpbrk = Module["_strpbrk"] = function() {
  return (_strpbrk = Module["_strpbrk"] = Module["asm"]["strpbrk"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _glob = Module["_glob"] = function() {
  return (_glob = Module["_glob"] = Module["asm"]["glob"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _globfree = Module["_globfree"] = function() {
  return (_globfree = Module["_globfree"] = Module["asm"]["globfree"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fgets = Module["_fgets"] = function() {
  return (_fgets = Module["_fgets"] = Module["asm"]["fgets"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _create_pattern_rule = Module["_create_pattern_rule"] = function() {
  return (_create_pattern_rule = Module["_create_pattern_rule"] = Module["asm"]["create_pattern_rule"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _create_pattern_var = Module["_create_pattern_var"] = function() {
  return (_create_pattern_var = Module["_create_pattern_var"] = Module["asm"]["create_pattern_var"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _assign_variable_definition = Module["_assign_variable_definition"] = function() {
  return (_assign_variable_definition = Module["_assign_variable_definition"] = Module["asm"]["assign_variable_definition"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gpath_search = Module["_gpath_search"] = function() {
  return (_gpath_search = Module["_gpath_search"] = Module["asm"]["gpath_search"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _readlink = Module["_readlink"] = function() {
  return (_readlink = Module["_readlink"] = Module["asm"]["readlink"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcasecmp = Module["_strcasecmp"] = function() {
  return (_strcasecmp = Module["_strcasecmp"] = Module["asm"]["strcasecmp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _create_new_variable_set = Module["_create_new_variable_set"] = function() {
  return (_create_new_variable_set = Module["_create_new_variable_set"] = Module["asm"]["create_new_variable_set"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _jobserver_get_invalid_auth = Module["_jobserver_get_invalid_auth"] = function() {
  return (_jobserver_get_invalid_auth = Module["_jobserver_get_invalid_auth"] = Module["asm"]["jobserver_get_invalid_auth"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _putc = Module["_putc"] = function() {
  return (_putc = Module["_putc"] = Module["asm"]["putc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fcntl = Module["_fcntl"] = function() {
  return (_fcntl = Module["_fcntl"] = Module["asm"]["fcntl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mkfifo = Module["_mkfifo"] = function() {
  return (_mkfifo = Module["_mkfifo"] = Module["asm"]["mkfifo"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sscanf = Module["_sscanf"] = function() {
  return (_sscanf = Module["_sscanf"] = Module["asm"]["sscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fd_inherit = Module["_fd_inherit"] = function() {
  return (_fd_inherit = Module["_fd_inherit"] = Module["asm"]["fd_inherit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pselect = Module["_pselect"] = function() {
  return (_pselect = Module["_pselect"] = Module["asm"]["pselect"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _osync_enabled = Module["_osync_enabled"] = function() {
  return (_osync_enabled = Module["_osync_enabled"] = Module["asm"]["osync_enabled"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tmpfile = Module["_tmpfile"] = function() {
  return (_tmpfile = Module["_tmpfile"] = Module["asm"]["tmpfile"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dup = Module["_dup"] = function() {
  return (_dup = Module["_dup"] = Module["asm"]["dup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _block_remote_children = Module["_block_remote_children"] = function() {
  return (_block_remote_children = Module["_block_remote_children"] = Module["asm"]["block_remote_children"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _unblock_remote_children = Module["_unblock_remote_children"] = function() {
  return (_unblock_remote_children = Module["_unblock_remote_children"] = Module["asm"]["unblock_remote_children"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _concatenated_filename = Module["_concatenated_filename"] = function() {
  return (_concatenated_filename = Module["_concatenated_filename"] = Module["asm"]["concatenated_filename"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _access = Module["_access"] = function() {
  return (_access = Module["_access"] = Module["asm"]["access"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isupper = Module["_isupper"] = function() {
  return (_isupper = Module["_isupper"] = Module["asm"]["isupper"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isalpha = Module["_isalpha"] = function() {
  return (_isalpha = Module["_isalpha"] = Module["asm"]["isalpha"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _iscntrl = Module["_iscntrl"] = function() {
  return (_iscntrl = Module["_iscntrl"] = Module["asm"]["iscntrl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isprint = Module["_isprint"] = function() {
  return (_isprint = Module["_isprint"] = Module["asm"]["isprint"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _islower = Module["_islower"] = function() {
  return (_islower = Module["_islower"] = Module["asm"]["islower"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ispunct = Module["_ispunct"] = function() {
  return (_ispunct = Module["_ispunct"] = Module["asm"]["ispunct"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isxdigit = Module["_isxdigit"] = function() {
  return (_isxdigit = Module["_isxdigit"] = Module["asm"]["isxdigit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___glob_pattern_p = Module["___glob_pattern_p"] = function() {
  return (___glob_pattern_p = Module["___glob_pattern_p"] = Module["asm"]["__glob_pattern_p"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _waitid = Module["_waitid"] = function() {
  return (_waitid = Module["_waitid"] = Module["asm"]["waitid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _times = Module["_times"] = function() {
  return (_times = Module["_times"] = Module["asm"]["times"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getdate = Module["_getdate"] = function() {
  return (_getdate = Module["_getdate"] = Module["asm"]["getdate"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stime = Module["_stime"] = function() {
  return (_stime = Module["_stime"] = Module["asm"]["stime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _clock_getcpuclockid = Module["_clock_getcpuclockid"] = function() {
  return (_clock_getcpuclockid = Module["_clock_getcpuclockid"] = Module["asm"]["clock_getcpuclockid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpwuid = Module["_getpwuid"] = function() {
  return (_getpwuid = Module["_getpwuid"] = Module["asm"]["getpwuid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpwnam_r = Module["_getpwnam_r"] = function() {
  return (_getpwnam_r = Module["_getpwnam_r"] = Module["asm"]["getpwnam_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpwuid_r = Module["_getpwuid_r"] = function() {
  return (_getpwuid_r = Module["_getpwuid_r"] = Module["asm"]["getpwuid_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _setpwent = Module["_setpwent"] = function() {
  return (_setpwent = Module["_setpwent"] = Module["asm"]["setpwent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _endpwent = Module["_endpwent"] = function() {
  return (_endpwent = Module["_endpwent"] = Module["asm"]["endpwent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getpwent = Module["_getpwent"] = function() {
  return (_getpwent = Module["_getpwent"] = Module["asm"]["getpwent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getgrnam = Module["_getgrnam"] = function() {
  return (_getgrnam = Module["_getgrnam"] = Module["asm"]["getgrnam"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getgrgid = Module["_getgrgid"] = function() {
  return (_getgrgid = Module["_getgrgid"] = Module["asm"]["getgrgid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getgrnam_r = Module["_getgrnam_r"] = function() {
  return (_getgrnam_r = Module["_getgrnam_r"] = Module["asm"]["getgrnam_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getgrgid_r = Module["_getgrgid_r"] = function() {
  return (_getgrgid_r = Module["_getgrgid_r"] = Module["asm"]["getgrgid_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _getgrent = Module["_getgrent"] = function() {
  return (_getgrent = Module["_getgrent"] = Module["asm"]["getgrent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _endgrent = Module["_endgrent"] = function() {
  return (_endgrent = Module["_endgrent"] = Module["asm"]["endgrent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _setgrent = Module["_setgrent"] = function() {
  return (_setgrent = Module["_setgrent"] = Module["asm"]["setgrent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _flock = Module["_flock"] = function() {
  return (_flock = Module["_flock"] = Module["asm"]["flock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _chroot = Module["_chroot"] = function() {
  return (_chroot = Module["_chroot"] = Module["asm"]["chroot"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _execve = Module["_execve"] = function() {
  return (_execve = Module["_execve"] = Module["asm"]["execve"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fork = Module["_fork"] = function() {
  return (_fork = Module["_fork"] = Module["asm"]["fork"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vfork = Module["_vfork"] = function() {
  return (_vfork = Module["_vfork"] = Module["asm"]["vfork"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _popen = Module["_popen"] = function() {
  return (_popen = Module["_popen"] = Module["asm"]["popen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pclose = Module["_pclose"] = function() {
  return (_pclose = Module["_pclose"] = Module["asm"]["pclose"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _setgroups = Module["_setgroups"] = function() {
  return (_setgroups = Module["_setgroups"] = Module["asm"]["setgroups"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sysconf = Module["_sysconf"] = function() {
  return (_sysconf = Module["_sysconf"] = Module["asm"]["sysconf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigaltstack = Module["_sigaltstack"] = function() {
  return (_sigaltstack = Module["_sigaltstack"] = Module["asm"]["sigaltstack"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_uname = Module["___syscall_uname"] = function() {
  return (___syscall_uname = Module["___syscall_uname"] = Module["asm"]["__syscall_uname"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setpgid = Module["___syscall_setpgid"] = function() {
  return (___syscall_setpgid = Module["___syscall_setpgid"] = Module["asm"]["__syscall_setpgid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_sync = Module["___syscall_sync"] = function() {
  return (___syscall_sync = Module["___syscall_sync"] = Module["asm"]["__syscall_sync"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getsid = Module["___syscall_getsid"] = function() {
  return (___syscall_getsid = Module["___syscall_getsid"] = Module["asm"]["__syscall_getsid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getpgid = Module["___syscall_getpgid"] = function() {
  return (___syscall_getpgid = Module["___syscall_getpgid"] = Module["asm"]["__syscall_getpgid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getpid = Module["___syscall_getpid"] = function() {
  return (___syscall_getpid = Module["___syscall_getpid"] = Module["asm"]["__syscall_getpid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getppid = Module["___syscall_getppid"] = function() {
  return (___syscall_getppid = Module["___syscall_getppid"] = Module["asm"]["__syscall_getppid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_link = Module["___syscall_link"] = function() {
  return (___syscall_link = Module["___syscall_link"] = Module["asm"]["__syscall_link"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getgroups32 = Module["___syscall_getgroups32"] = function() {
  return (___syscall_getgroups32 = Module["___syscall_getgroups32"] = Module["asm"]["__syscall_getgroups32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setsid = Module["___syscall_setsid"] = function() {
  return (___syscall_setsid = Module["___syscall_setsid"] = Module["asm"]["__syscall_setsid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_umask = Module["___syscall_umask"] = function() {
  return (___syscall_umask = Module["___syscall_umask"] = Module["asm"]["__syscall_umask"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setrlimit = Module["___syscall_setrlimit"] = function() {
  return (___syscall_setrlimit = Module["___syscall_setrlimit"] = Module["asm"]["__syscall_setrlimit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getrusage = Module["___syscall_getrusage"] = function() {
  return (___syscall_getrusage = Module["___syscall_getrusage"] = Module["asm"]["__syscall_getrusage"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getpriority = Module["___syscall_getpriority"] = function() {
  return (___syscall_getpriority = Module["___syscall_getpriority"] = Module["asm"]["__syscall_getpriority"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setpriority = Module["___syscall_setpriority"] = function() {
  return (___syscall_setpriority = Module["___syscall_setpriority"] = Module["asm"]["__syscall_setpriority"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setdomainname = Module["___syscall_setdomainname"] = function() {
  return (___syscall_setdomainname = Module["___syscall_setdomainname"] = Module["asm"]["__syscall_setdomainname"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getuid32 = Module["___syscall_getuid32"] = function() {
  return (___syscall_getuid32 = Module["___syscall_getuid32"] = Module["asm"]["__syscall_getuid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getgid32 = Module["___syscall_getgid32"] = function() {
  return (___syscall_getgid32 = Module["___syscall_getgid32"] = Module["asm"]["__syscall_getgid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_geteuid32 = Module["___syscall_geteuid32"] = function() {
  return (___syscall_geteuid32 = Module["___syscall_geteuid32"] = Module["asm"]["__syscall_geteuid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getegid32 = Module["___syscall_getegid32"] = function() {
  return (___syscall_getegid32 = Module["___syscall_getegid32"] = Module["asm"]["__syscall_getegid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getresuid32 = Module["___syscall_getresuid32"] = function() {
  return (___syscall_getresuid32 = Module["___syscall_getresuid32"] = Module["asm"]["__syscall_getresuid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getresgid32 = Module["___syscall_getresgid32"] = function() {
  return (___syscall_getresgid32 = Module["___syscall_getresgid32"] = Module["asm"]["__syscall_getresgid32"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_pause = Module["___syscall_pause"] = function() {
  return (___syscall_pause = Module["___syscall_pause"] = Module["asm"]["__syscall_pause"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_madvise = Module["___syscall_madvise"] = function() {
  return (___syscall_madvise = Module["___syscall_madvise"] = Module["asm"]["__syscall_madvise"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_mlock = Module["___syscall_mlock"] = function() {
  return (___syscall_mlock = Module["___syscall_mlock"] = Module["asm"]["__syscall_mlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_munlock = Module["___syscall_munlock"] = function() {
  return (___syscall_munlock = Module["___syscall_munlock"] = Module["asm"]["__syscall_munlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_mprotect = Module["___syscall_mprotect"] = function() {
  return (___syscall_mprotect = Module["___syscall_mprotect"] = Module["asm"]["__syscall_mprotect"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_mremap = Module["___syscall_mremap"] = function() {
  return (___syscall_mremap = Module["___syscall_mremap"] = Module["asm"]["__syscall_mremap"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_mlockall = Module["___syscall_mlockall"] = function() {
  return (___syscall_mlockall = Module["___syscall_mlockall"] = Module["asm"]["__syscall_mlockall"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_munlockall = Module["___syscall_munlockall"] = function() {
  return (___syscall_munlockall = Module["___syscall_munlockall"] = Module["asm"]["__syscall_munlockall"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_prlimit64 = Module["___syscall_prlimit64"] = function() {
  return (___syscall_prlimit64 = Module["___syscall_prlimit64"] = Module["asm"]["__syscall_prlimit64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = function() {
  return (___syscall_ugetrlimit = Module["___syscall_ugetrlimit"] = Module["asm"]["__syscall_ugetrlimit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setsockopt = Module["___syscall_setsockopt"] = function() {
  return (___syscall_setsockopt = Module["___syscall_setsockopt"] = Module["asm"]["__syscall_setsockopt"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_acct = Module["___syscall_acct"] = function() {
  return (___syscall_acct = Module["___syscall_acct"] = Module["asm"]["__syscall_acct"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_mincore = Module["___syscall_mincore"] = function() {
  return (___syscall_mincore = Module["___syscall_mincore"] = Module["asm"]["__syscall_mincore"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_pipe2 = Module["___syscall_pipe2"] = function() {
  return (___syscall_pipe2 = Module["___syscall_pipe2"] = Module["asm"]["__syscall_pipe2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_pselect6 = Module["___syscall_pselect6"] = function() {
  return (___syscall_pselect6 = Module["___syscall_pselect6"] = Module["asm"]["__syscall_pselect6"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_recvmmsg = Module["___syscall_recvmmsg"] = function() {
  return (___syscall_recvmmsg = Module["___syscall_recvmmsg"] = Module["asm"]["__syscall_recvmmsg"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_sendmmsg = Module["___syscall_sendmmsg"] = function() {
  return (___syscall_sendmmsg = Module["___syscall_sendmmsg"] = Module["asm"]["__syscall_sendmmsg"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_setitimer = Module["___syscall_setitimer"] = function() {
  return (___syscall_setitimer = Module["___syscall_setitimer"] = Module["asm"]["__syscall_setitimer"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_getitimer = Module["___syscall_getitimer"] = function() {
  return (___syscall_getitimer = Module["___syscall_getitimer"] = Module["asm"]["__syscall_getitimer"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_shutdown = Module["___syscall_shutdown"] = function() {
  return (___syscall_shutdown = Module["___syscall_shutdown"] = Module["asm"]["__syscall_shutdown"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_socketpair = Module["___syscall_socketpair"] = function() {
  return (___syscall_socketpair = Module["___syscall_socketpair"] = Module["asm"]["__syscall_socketpair"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___syscall_wait4 = Module["___syscall_wait4"] = function() {
  return (___syscall_wait4 = Module["___syscall_wait4"] = Module["asm"]["__syscall_wait4"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___cxa_atexit = Module["___cxa_atexit"] = function() {
  return (___cxa_atexit = Module["___cxa_atexit"] = Module["asm"]["__cxa_atexit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___cxa_finalize = Module["___cxa_finalize"] = function() {
  return (___cxa_finalize = Module["___cxa_finalize"] = Module["asm"]["__cxa_finalize"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __Exit = Module["__Exit"] = function() {
  return (__Exit = Module["__Exit"] = Module["asm"]["_Exit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = function() {
  return (___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = Module["asm"]["__emscripten_environ_constructor"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = function() {
  return (_emscripten_builtin_malloc = Module["_emscripten_builtin_malloc"] = Module["asm"]["emscripten_builtin_malloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___fmodeflags = Module["___fmodeflags"] = function() {
  return (___fmodeflags = Module["___fmodeflags"] = Module["asm"]["__fmodeflags"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___fpclassifyl = Module["___fpclassifyl"] = function() {
  return (___fpclassifyl = Module["___fpclassifyl"] = Module["asm"]["__fpclassifyl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___mo_lookup = Module["___mo_lookup"] = function() {
  return (___mo_lookup = Module["___mo_lookup"] = Module["asm"]["__mo_lookup"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___overflow = Module["___overflow"] = function() {
  return (___overflow = Module["___overflow"] = Module["asm"]["__overflow"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___randname = Module["___randname"] = function() {
  return (___randname = Module["___randname"] = Module["asm"]["__randname"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___wasi_syscall_ret = Module["___wasi_syscall_ret"] = function() {
  return (___wasi_syscall_ret = Module["___wasi_syscall_ret"] = Module["asm"]["__wasi_syscall_ret"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___uflow = Module["___uflow"] = function() {
  return (___uflow = Module["___uflow"] = Module["asm"]["__uflow"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _asctime = Module["_asctime"] = function() {
  return (_asctime = Module["_asctime"] = Module["asm"]["asctime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _asctime_r = Module["_asctime_r"] = function() {
  return (_asctime_r = Module["_asctime_r"] = Module["asm"]["asctime_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtod = Module["_strtod"] = function() {
  return (_strtod = Module["_strtod"] = Module["asm"]["strtod"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _copysignl = Module["_copysignl"] = function() {
  return (_copysignl = Module["_copysignl"] = Module["asm"]["copysignl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___nl_langinfo_l = Module["___nl_langinfo_l"] = function() {
  return (___nl_langinfo_l = Module["___nl_langinfo_l"] = Module["asm"]["__nl_langinfo_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___get_tp = Module["___get_tp"] = function() {
  return (___get_tp = Module["___get_tp"] = Module["asm"]["__get_tp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___lock = Module["___lock"] = function() {
  return (___lock = Module["___lock"] = Module["asm"]["__lock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___unlock = Module["___unlock"] = function() {
  return (___unlock = Module["___unlock"] = Module["asm"]["__unlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___libc_free = Module["___libc_free"] = function() {
  return (___libc_free = Module["___libc_free"] = Module["asm"]["__libc_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vsnprintf = Module["_vsnprintf"] = function() {
  return (_vsnprintf = Module["_vsnprintf"] = Module["asm"]["vsnprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___libc_malloc = Module["___libc_malloc"] = function() {
  return (___libc_malloc = Module["___libc_malloc"] = Module["asm"]["__libc_malloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___dl_seterr = Module["___dl_seterr"] = function() {
  return (___dl_seterr = Module["___dl_seterr"] = Module["asm"]["__dl_seterr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_setcancelstate = Module["_pthread_setcancelstate"] = function() {
  return (_pthread_setcancelstate = Module["_pthread_setcancelstate"] = Module["asm"]["pthread_setcancelstate"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = function() {
  return (_pthread_rwlock_wrlock = Module["_pthread_rwlock_wrlock"] = Module["asm"]["pthread_rwlock_wrlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = function() {
  return (_pthread_rwlock_unlock = Module["_pthread_rwlock_unlock"] = Module["asm"]["pthread_rwlock_unlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_dlopen = Module["_emscripten_dlopen"] = function() {
  return (_emscripten_dlopen = Module["_emscripten_dlopen"] = Module["asm"]["emscripten_dlopen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = function() {
  return (_pthread_rwlock_rdlock = Module["_pthread_rwlock_rdlock"] = Module["asm"]["pthread_rwlock_rdlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dladdr = Module["_dladdr"] = function() {
  return (_dladdr = Module["_dladdr"] = Module["asm"]["dladdr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = function() {
  return (_emscripten_get_heap_size = Module["_emscripten_get_heap_size"] = Module["asm"]["emscripten_get_heap_size"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = function() {
  return (_emscripten_builtin_memcpy = Module["_emscripten_builtin_memcpy"] = Module["asm"]["emscripten_builtin_memcpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tzset = Module["_tzset"] = function() {
  return (_tzset = Module["_tzset"] = Module["asm"]["tzset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _timegm = Module["_timegm"] = function() {
  return (_timegm = Module["_timegm"] = Module["asm"]["timegm"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mktime = Module["_mktime"] = function() {
  return (_mktime = Module["_mktime"] = Module["asm"]["mktime"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___clock = Module["___clock"] = function() {
  return (___clock = Module["___clock"] = Module["asm"]["__clock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___time = Module["___time"] = function() {
  return (___time = Module["___time"] = Module["asm"]["__time"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___clock_getres = Module["___clock_getres"] = function() {
  return (___clock_getres = Module["___clock_getres"] = Module["asm"]["__clock_getres"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___gettimeofday = Module["___gettimeofday"] = function() {
  return (___gettimeofday = Module["___gettimeofday"] = Module["asm"]["__gettimeofday"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _dysize = Module["_dysize"] = function() {
  return (_dysize = Module["_dysize"] = Module["asm"]["dysize"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gmtime_r = Module["_gmtime_r"] = function() {
  return (_gmtime_r = Module["_gmtime_r"] = Module["asm"]["gmtime_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _localtime_r = Module["_localtime_r"] = function() {
  return (_localtime_r = Module["_localtime_r"] = Module["asm"]["localtime_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _clock = Module["_clock"] = function() {
  return (_clock = Module["_clock"] = Module["asm"]["clock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _clock_getres = Module["_clock_getres"] = function() {
  return (_clock_getres = Module["_clock_getres"] = Module["asm"]["clock_getres"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _gettimeofday = Module["_gettimeofday"] = function() {
  return (_gettimeofday = Module["_gettimeofday"] = Module["asm"]["gettimeofday"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strnlen = Module["_strnlen"] = function() {
  return (_strnlen = Module["_strnlen"] = Module["asm"]["strnlen"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _execvpe = Module["_execvpe"] = function() {
  return (_execvpe = Module["_execvpe"] = Module["asm"]["execvpe"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fabsl = Module["_fabsl"] = function() {
  return (_fabsl = Module["_fabsl"] = Module["asm"]["fabsl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _feof_unlocked = Module["_feof_unlocked"] = function() {
  return (_feof_unlocked = Module["_feof_unlocked"] = Module["asm"]["feof_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __IO_feof_unlocked = Module["__IO_feof_unlocked"] = function() {
  return (__IO_feof_unlocked = Module["__IO_feof_unlocked"] = Module["asm"]["_IO_feof_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ferror_unlocked = Module["_ferror_unlocked"] = function() {
  return (_ferror_unlocked = Module["_ferror_unlocked"] = Module["asm"]["ferror_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = function() {
  return (__IO_ferror_unlocked = Module["__IO_ferror_unlocked"] = Module["asm"]["_IO_ferror_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fflush_unlocked = Module["_fflush_unlocked"] = function() {
  return (_fflush_unlocked = Module["_fflush_unlocked"] = Module["asm"]["fflush_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fgets_unlocked = Module["_fgets_unlocked"] = function() {
  return (_fgets_unlocked = Module["_fgets_unlocked"] = Module["asm"]["fgets_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fileno_unlocked = Module["_fileno_unlocked"] = function() {
  return (_fileno_unlocked = Module["_fileno_unlocked"] = Module["asm"]["fileno_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fmodl = Module["_fmodl"] = function() {
  return (_fmodl = Module["_fmodl"] = Module["asm"]["fmodl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fopen64 = Module["_fopen64"] = function() {
  return (_fopen64 = Module["_fopen64"] = Module["asm"]["fopen64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fprintf = Module["_fprintf"] = function() {
  return (_fprintf = Module["_fprintf"] = Module["asm"]["fprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vfprintf = Module["_vfprintf"] = function() {
  return (_vfprintf = Module["_vfprintf"] = Module["asm"]["vfprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vfiprintf = Module["_vfiprintf"] = function() {
  return (_vfiprintf = Module["_vfiprintf"] = Module["asm"]["vfiprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_vfprintf = Module["___small_vfprintf"] = function() {
  return (___small_vfprintf = Module["___small_vfprintf"] = Module["asm"]["__small_vfprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_futex_wake = Module["_emscripten_futex_wake"] = function() {
  return (_emscripten_futex_wake = Module["_emscripten_futex_wake"] = Module["asm"]["emscripten_futex_wake"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fputs_unlocked = Module["_fputs_unlocked"] = function() {
  return (_fputs_unlocked = Module["_fputs_unlocked"] = Module["asm"]["fputs_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fread_unlocked = Module["_fread_unlocked"] = function() {
  return (_fread_unlocked = Module["_fread_unlocked"] = Module["asm"]["fread_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _frexp = Module["_frexp"] = function() {
  return (_frexp = Module["_frexp"] = Module["asm"]["frexp"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fstatat = Module["_fstatat"] = function() {
  return (_fstatat = Module["_fstatat"] = Module["asm"]["fstatat"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fstat64 = Module["_fstat64"] = function() {
  return (_fstat64 = Module["_fstat64"] = Module["asm"]["fstat64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fstatat64 = Module["_fstatat64"] = function() {
  return (_fstatat64 = Module["_fstatat64"] = Module["asm"]["fstatat64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ftruncate64 = Module["_ftruncate64"] = function() {
  return (_ftruncate64 = Module["_ftruncate64"] = Module["asm"]["ftruncate64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _fwrite_unlocked = Module["_fwrite_unlocked"] = function() {
  return (_fwrite_unlocked = Module["_fwrite_unlocked"] = Module["asm"]["fwrite_unlocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___intscan = Module["___intscan"] = function() {
  return (___intscan = Module["___intscan"] = Module["asm"]["__intscan"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isdigit = Module["_isdigit"] = function() {
  return (_isdigit = Module["_isdigit"] = Module["asm"]["isdigit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isalnum_l = Module["___isalnum_l"] = function() {
  return (___isalnum_l = Module["___isalnum_l"] = Module["asm"]["__isalnum_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isalnum_l = Module["_isalnum_l"] = function() {
  return (_isalnum_l = Module["_isalnum_l"] = Module["asm"]["isalnum_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isalpha_l = Module["___isalpha_l"] = function() {
  return (___isalpha_l = Module["___isalpha_l"] = Module["asm"]["__isalpha_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isalpha_l = Module["_isalpha_l"] = function() {
  return (_isalpha_l = Module["_isalpha_l"] = Module["asm"]["isalpha_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___iscntrl_l = Module["___iscntrl_l"] = function() {
  return (___iscntrl_l = Module["___iscntrl_l"] = Module["asm"]["__iscntrl_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _iscntrl_l = Module["_iscntrl_l"] = function() {
  return (_iscntrl_l = Module["_iscntrl_l"] = Module["asm"]["iscntrl_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isdigit_l = Module["___isdigit_l"] = function() {
  return (___isdigit_l = Module["___isdigit_l"] = Module["asm"]["__isdigit_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isdigit_l = Module["_isdigit_l"] = function() {
  return (_isdigit_l = Module["_isdigit_l"] = Module["asm"]["isdigit_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isgraph = Module["_isgraph"] = function() {
  return (_isgraph = Module["_isgraph"] = Module["asm"]["isgraph"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isgraph_l = Module["___isgraph_l"] = function() {
  return (___isgraph_l = Module["___isgraph_l"] = Module["asm"]["__isgraph_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isgraph_l = Module["_isgraph_l"] = function() {
  return (_isgraph_l = Module["_isgraph_l"] = Module["asm"]["isgraph_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___islower_l = Module["___islower_l"] = function() {
  return (___islower_l = Module["___islower_l"] = Module["asm"]["__islower_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _islower_l = Module["_islower_l"] = function() {
  return (_islower_l = Module["_islower_l"] = Module["asm"]["islower_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isprint_l = Module["___isprint_l"] = function() {
  return (___isprint_l = Module["___isprint_l"] = Module["asm"]["__isprint_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isprint_l = Module["_isprint_l"] = function() {
  return (_isprint_l = Module["_isprint_l"] = Module["asm"]["isprint_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___ispunct_l = Module["___ispunct_l"] = function() {
  return (___ispunct_l = Module["___ispunct_l"] = Module["asm"]["__ispunct_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ispunct_l = Module["_ispunct_l"] = function() {
  return (_ispunct_l = Module["_ispunct_l"] = Module["asm"]["ispunct_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isspace_l = Module["___isspace_l"] = function() {
  return (___isspace_l = Module["___isspace_l"] = Module["asm"]["__isspace_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isspace_l = Module["_isspace_l"] = function() {
  return (_isspace_l = Module["_isspace_l"] = Module["asm"]["isspace_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isupper_l = Module["___isupper_l"] = function() {
  return (___isupper_l = Module["___isupper_l"] = Module["asm"]["__isupper_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isupper_l = Module["_isupper_l"] = function() {
  return (_isupper_l = Module["_isupper_l"] = Module["asm"]["isupper_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isxdigit_l = Module["___isxdigit_l"] = function() {
  return (___isxdigit_l = Module["___isxdigit_l"] = Module["asm"]["__isxdigit_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _isxdigit_l = Module["_isxdigit_l"] = function() {
  return (_isxdigit_l = Module["_isxdigit_l"] = Module["asm"]["isxdigit_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _raise = Module["_raise"] = function() {
  return (_raise = Module["_raise"] = Module["asm"]["raise"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___nl_langinfo = Module["___nl_langinfo"] = function() {
  return (___nl_langinfo = Module["___nl_langinfo"] = Module["asm"]["__nl_langinfo"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _nl_langinfo = Module["_nl_langinfo"] = function() {
  return (_nl_langinfo = Module["_nl_langinfo"] = Module["asm"]["nl_langinfo"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _nl_langinfo_l = Module["_nl_langinfo_l"] = function() {
  return (_nl_langinfo_l = Module["_nl_langinfo_l"] = Module["asm"]["nl_langinfo_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = function() {
  return (_emscripten_has_threading_support = Module["_emscripten_has_threading_support"] = Module["asm"]["emscripten_has_threading_support"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = function() {
  return (_emscripten_num_logical_cores = Module["_emscripten_num_logical_cores"] = Module["asm"]["emscripten_num_logical_cores"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = function() {
  return (_emscripten_force_num_logical_cores = Module["_emscripten_force_num_logical_cores"] = Module["asm"]["emscripten_force_num_logical_cores"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_futex_wait = Module["_emscripten_futex_wait"] = function() {
  return (_emscripten_futex_wait = Module["_emscripten_futex_wait"] = Module["asm"]["emscripten_futex_wait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = function() {
  return (_emscripten_is_main_runtime_thread = Module["_emscripten_is_main_runtime_thread"] = Module["asm"]["emscripten_is_main_runtime_thread"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = function() {
  return (_emscripten_main_thread_process_queued_calls = Module["_emscripten_main_thread_process_queued_calls"] = Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = function() {
  return (_emscripten_current_thread_process_queued_calls = Module["_emscripten_current_thread_process_queued_calls"] = Module["asm"]["emscripten_current_thread_process_queued_calls"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __emscripten_yield = Module["__emscripten_yield"] = function() {
  return (__emscripten_yield = Module["__emscripten_yield"] = Module["asm"]["_emscripten_yield"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_init = Module["_pthread_mutex_init"] = function() {
  return (_pthread_mutex_init = Module["_pthread_mutex_init"] = Module["asm"]["pthread_mutex_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = function() {
  return (_pthread_mutex_destroy = Module["_pthread_mutex_destroy"] = Module["asm"]["pthread_mutex_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = function() {
  return (_pthread_mutex_consistent = Module["_pthread_mutex_consistent"] = Module["asm"]["pthread_mutex_consistent"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_barrier_init = Module["_pthread_barrier_init"] = function() {
  return (_pthread_barrier_init = Module["_pthread_barrier_init"] = Module["asm"]["pthread_barrier_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = function() {
  return (_pthread_barrier_destroy = Module["_pthread_barrier_destroy"] = Module["asm"]["pthread_barrier_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_barrier_wait = Module["_pthread_barrier_wait"] = function() {
  return (_pthread_barrier_wait = Module["_pthread_barrier_wait"] = Module["asm"]["pthread_barrier_wait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_getspecific = Module["_pthread_getspecific"] = function() {
  return (_pthread_getspecific = Module["_pthread_getspecific"] = Module["asm"]["pthread_getspecific"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_setspecific = Module["_pthread_setspecific"] = function() {
  return (_pthread_setspecific = Module["_pthread_setspecific"] = Module["asm"]["pthread_setspecific"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_wait = Module["_pthread_cond_wait"] = function() {
  return (_pthread_cond_wait = Module["_pthread_cond_wait"] = Module["asm"]["pthread_cond_wait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_signal = Module["_pthread_cond_signal"] = function() {
  return (_pthread_cond_signal = Module["_pthread_cond_signal"] = Module["asm"]["pthread_cond_signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = function() {
  return (_pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = Module["asm"]["pthread_cond_broadcast"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_init = Module["_pthread_cond_init"] = function() {
  return (_pthread_cond_init = Module["_pthread_cond_init"] = Module["asm"]["pthread_cond_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_destroy = Module["_pthread_cond_destroy"] = function() {
  return (_pthread_cond_destroy = Module["_pthread_cond_destroy"] = Module["asm"]["pthread_cond_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_atfork = Module["_pthread_atfork"] = function() {
  return (_pthread_atfork = Module["_pthread_atfork"] = Module["asm"]["pthread_atfork"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cancel = Module["_pthread_cancel"] = function() {
  return (_pthread_cancel = Module["_pthread_cancel"] = Module["asm"]["pthread_cancel"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_testcancel = Module["_pthread_testcancel"] = function() {
  return (_pthread_testcancel = Module["_pthread_testcancel"] = Module["asm"]["pthread_testcancel"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___pthread_detach = Module["___pthread_detach"] = function() {
  return (___pthread_detach = Module["___pthread_detach"] = Module["asm"]["__pthread_detach"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_equal = Module["_pthread_equal"] = function() {
  return (_pthread_equal = Module["_pthread_equal"] = Module["asm"]["pthread_equal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = function() {
  return (_pthread_mutexattr_init = Module["_pthread_mutexattr_init"] = Module["asm"]["pthread_mutexattr_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = function() {
  return (_pthread_mutexattr_setprotocol = Module["_pthread_mutexattr_setprotocol"] = Module["asm"]["pthread_mutexattr_setprotocol"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = function() {
  return (_pthread_mutexattr_settype = Module["_pthread_mutexattr_settype"] = Module["asm"]["pthread_mutexattr_settype"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = function() {
  return (_pthread_mutexattr_destroy = Module["_pthread_mutexattr_destroy"] = Module["asm"]["pthread_mutexattr_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = function() {
  return (_pthread_mutexattr_setpshared = Module["_pthread_mutexattr_setpshared"] = Module["asm"]["pthread_mutexattr_setpshared"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_condattr_init = Module["_pthread_condattr_init"] = function() {
  return (_pthread_condattr_init = Module["_pthread_condattr_init"] = Module["asm"]["pthread_condattr_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = function() {
  return (_pthread_condattr_destroy = Module["_pthread_condattr_destroy"] = Module["asm"]["pthread_condattr_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = function() {
  return (_pthread_condattr_setclock = Module["_pthread_condattr_setclock"] = Module["asm"]["pthread_condattr_setclock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = function() {
  return (_pthread_condattr_setpshared = Module["_pthread_condattr_setpshared"] = Module["asm"]["pthread_condattr_setpshared"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_attr_init = Module["_pthread_attr_init"] = function() {
  return (_pthread_attr_init = Module["_pthread_attr_init"] = Module["asm"]["pthread_attr_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_getattr_np = Module["_pthread_getattr_np"] = function() {
  return (_pthread_getattr_np = Module["_pthread_getattr_np"] = Module["asm"]["pthread_getattr_np"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_attr_destroy = Module["_pthread_attr_destroy"] = function() {
  return (_pthread_attr_destroy = Module["_pthread_attr_destroy"] = Module["asm"]["pthread_attr_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_setcanceltype = Module["_pthread_setcanceltype"] = function() {
  return (_pthread_setcanceltype = Module["_pthread_setcanceltype"] = Module["asm"]["pthread_setcanceltype"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_init = Module["_pthread_rwlock_init"] = function() {
  return (_pthread_rwlock_init = Module["_pthread_rwlock_init"] = Module["asm"]["pthread_rwlock_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = function() {
  return (_pthread_rwlock_destroy = Module["_pthread_rwlock_destroy"] = Module["asm"]["pthread_rwlock_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = function() {
  return (_pthread_rwlock_tryrdlock = Module["_pthread_rwlock_tryrdlock"] = Module["asm"]["pthread_rwlock_tryrdlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = function() {
  return (_pthread_rwlock_timedrdlock = Module["_pthread_rwlock_timedrdlock"] = Module["asm"]["pthread_rwlock_timedrdlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = function() {
  return (_pthread_rwlock_trywrlock = Module["_pthread_rwlock_trywrlock"] = Module["asm"]["pthread_rwlock_trywrlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = function() {
  return (_pthread_rwlock_timedwrlock = Module["_pthread_rwlock_timedwrlock"] = Module["asm"]["pthread_rwlock_timedwrlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = function() {
  return (_pthread_rwlockattr_init = Module["_pthread_rwlockattr_init"] = Module["asm"]["pthread_rwlockattr_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = function() {
  return (_pthread_rwlockattr_destroy = Module["_pthread_rwlockattr_destroy"] = Module["asm"]["pthread_rwlockattr_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = function() {
  return (_pthread_rwlockattr_setpshared = Module["_pthread_rwlockattr_setpshared"] = Module["asm"]["pthread_rwlockattr_setpshared"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_spin_init = Module["_pthread_spin_init"] = function() {
  return (_pthread_spin_init = Module["_pthread_spin_init"] = Module["asm"]["pthread_spin_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_spin_destroy = Module["_pthread_spin_destroy"] = function() {
  return (_pthread_spin_destroy = Module["_pthread_spin_destroy"] = Module["asm"]["pthread_spin_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_spin_lock = Module["_pthread_spin_lock"] = function() {
  return (_pthread_spin_lock = Module["_pthread_spin_lock"] = Module["asm"]["pthread_spin_lock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_spin_trylock = Module["_pthread_spin_trylock"] = function() {
  return (_pthread_spin_trylock = Module["_pthread_spin_trylock"] = Module["asm"]["pthread_spin_trylock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_spin_unlock = Module["_pthread_spin_unlock"] = function() {
  return (_pthread_spin_unlock = Module["_pthread_spin_unlock"] = Module["asm"]["pthread_spin_unlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_attr_setdetachstate = Module["_pthread_attr_setdetachstate"] = function() {
  return (_pthread_attr_setdetachstate = Module["_pthread_attr_setdetachstate"] = Module["asm"]["pthread_attr_setdetachstate"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_attr_setschedparam = Module["_pthread_attr_setschedparam"] = function() {
  return (_pthread_attr_setschedparam = Module["_pthread_attr_setschedparam"] = Module["asm"]["pthread_attr_setschedparam"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_attr_setstacksize = Module["_pthread_attr_setstacksize"] = function() {
  return (_pthread_attr_setstacksize = Module["_pthread_attr_setstacksize"] = Module["asm"]["pthread_attr_setstacksize"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sem_init = Module["_sem_init"] = function() {
  return (_sem_init = Module["_sem_init"] = Module["asm"]["sem_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sem_post = Module["_sem_post"] = function() {
  return (_sem_post = Module["_sem_post"] = Module["asm"]["sem_post"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sem_wait = Module["_sem_wait"] = function() {
  return (_sem_wait = Module["_sem_wait"] = Module["asm"]["sem_wait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sem_trywait = Module["_sem_trywait"] = function() {
  return (_sem_trywait = Module["_sem_trywait"] = Module["asm"]["sem_trywait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sem_destroy = Module["_sem_destroy"] = function() {
  return (_sem_destroy = Module["_sem_destroy"] = Module["asm"]["sem_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = function() {
  return (_emscripten_thread_sleep = Module["_emscripten_thread_sleep"] = Module["asm"]["emscripten_thread_sleep"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = function() {
  return (_pthread_mutex_lock = Module["_pthread_mutex_lock"] = Module["asm"]["pthread_mutex_lock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = function() {
  return (_pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = Module["asm"]["pthread_mutex_unlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = function() {
  return (_pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = Module["asm"]["pthread_mutex_trylock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = function() {
  return (_pthread_mutex_timedlock = Module["_pthread_mutex_timedlock"] = Module["asm"]["pthread_mutex_timedlock"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = function() {
  return (_emscripten_builtin_pthread_create = Module["_emscripten_builtin_pthread_create"] = Module["asm"]["emscripten_builtin_pthread_create"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_create = Module["_pthread_create"] = function() {
  return (_pthread_create = Module["_pthread_create"] = Module["asm"]["pthread_create"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = function() {
  return (_emscripten_builtin_pthread_join = Module["_emscripten_builtin_pthread_join"] = Module["asm"]["emscripten_builtin_pthread_join"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_join = Module["_pthread_join"] = function() {
  return (_pthread_join = Module["_pthread_join"] = Module["asm"]["pthread_join"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_key_delete = Module["_pthread_key_delete"] = function() {
  return (_pthread_key_delete = Module["_pthread_key_delete"] = Module["asm"]["pthread_key_delete"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_key_create = Module["_pthread_key_create"] = function() {
  return (_pthread_key_create = Module["_pthread_key_create"] = Module["asm"]["pthread_key_create"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_once = Module["_pthread_once"] = function() {
  return (_pthread_once = Module["_pthread_once"] = Module["asm"]["pthread_once"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = function() {
  return (_pthread_cond_timedwait = Module["_pthread_cond_timedwait"] = Module["asm"]["pthread_cond_timedwait"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_exit = Module["_pthread_exit"] = function() {
  return (_pthread_exit = Module["_pthread_exit"] = Module["asm"]["pthread_exit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = function() {
  return (_emscripten_builtin_pthread_detach = Module["_emscripten_builtin_pthread_detach"] = Module["asm"]["emscripten_builtin_pthread_detach"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_detach = Module["_pthread_detach"] = function() {
  return (_pthread_detach = Module["_pthread_detach"] = Module["asm"]["pthread_detach"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _thrd_detach = Module["_thrd_detach"] = function() {
  return (_thrd_detach = Module["_thrd_detach"] = Module["asm"]["thrd_detach"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lseek64 = Module["_lseek64"] = function() {
  return (_lseek64 = Module["_lseek64"] = Module["asm"]["lseek64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _lstat64 = Module["_lstat64"] = function() {
  return (_lstat64 = Module["_lstat64"] = Module["asm"]["lstat64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mbrtowc = Module["_mbrtowc"] = function() {
  return (_mbrtowc = Module["_mbrtowc"] = Module["asm"]["mbrtowc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mbsinit = Module["_mbsinit"] = function() {
  return (_mbsinit = Module["_mbsinit"] = Module["asm"]["mbsinit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mknod = Module["_mknod"] = function() {
  return (_mknod = Module["_mknod"] = Module["asm"]["mknod"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mkostemps = Module["_mkostemps"] = function() {
  return (_mkostemps = Module["_mkostemps"] = Module["asm"]["mkostemps"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mkostemps64 = Module["_mkostemps64"] = function() {
  return (_mkostemps64 = Module["_mkostemps64"] = Module["asm"]["mkostemps64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mkstemp64 = Module["_mkstemp64"] = function() {
  return (_mkstemp64 = Module["_mkstemp64"] = Module["asm"]["mkstemp64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _open64 = Module["_open64"] = function() {
  return (_open64 = Module["_open64"] = Module["asm"]["open64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _printf = Module["_printf"] = function() {
  return (_printf = Module["_printf"] = Module["asm"]["printf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_main_browser_thread_id = Module["_emscripten_main_browser_thread_id"] = function() {
  return (_emscripten_main_browser_thread_id = Module["_emscripten_main_browser_thread_id"] = Module["asm"]["emscripten_main_browser_thread_id"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___sig_is_blocked = Module["___sig_is_blocked"] = function() {
  return (___sig_is_blocked = Module["___sig_is_blocked"] = Module["asm"]["__sig_is_blocked"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pthread_sigmask = Module["_pthread_sigmask"] = function() {
  return (_pthread_sigmask = Module["_pthread_sigmask"] = Module["asm"]["pthread_sigmask"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigpending = Module["_sigpending"] = function() {
  return (_sigpending = Module["_sigpending"] = Module["asm"]["sigpending"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var __IO_putc = Module["__IO_putc"] = function() {
  return (__IO_putc = Module["__IO_putc"] = Module["asm"]["_IO_putc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _unsetenv = Module["_unsetenv"] = function() {
  return (_unsetenv = Module["_unsetenv"] = Module["asm"]["unsetenv"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigismember = Module["_sigismember"] = function() {
  return (_sigismember = Module["_sigismember"] = Module["asm"]["sigismember"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigorset = Module["_sigorset"] = function() {
  return (_sigorset = Module["_sigorset"] = Module["asm"]["sigorset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigandset = Module["_sigandset"] = function() {
  return (_sigandset = Module["_sigandset"] = Module["asm"]["sigandset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigdelset = Module["_sigdelset"] = function() {
  return (_sigdelset = Module["_sigdelset"] = Module["asm"]["sigdelset"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _readdir64 = Module["_readdir64"] = function() {
  return (_readdir64 = Module["_readdir64"] = Module["asm"]["readdir64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _scalbn = Module["_scalbn"] = function() {
  return (_scalbn = Module["_scalbn"] = Module["asm"]["scalbn"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _scalbnl = Module["_scalbnl"] = function() {
  return (_scalbnl = Module["_scalbnl"] = Module["asm"]["scalbnl"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sigaction = Module["_sigaction"] = function() {
  return (_sigaction = Module["_sigaction"] = Module["asm"]["sigaction"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___sysv_signal = Module["___sysv_signal"] = function() {
  return (___sysv_signal = Module["___sysv_signal"] = Module["asm"]["__sysv_signal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sprintf = Module["_sprintf"] = function() {
  return (_sprintf = Module["_sprintf"] = Module["asm"]["sprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vsiprintf = Module["_vsiprintf"] = function() {
  return (_vsiprintf = Module["_vsiprintf"] = Module["asm"]["vsiprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_vsprintf = Module["___small_vsprintf"] = function() {
  return (___small_vsprintf = Module["___small_vsprintf"] = Module["asm"]["__small_vsprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vsscanf = Module["_vsscanf"] = function() {
  return (_vsscanf = Module["_vsscanf"] = Module["asm"]["vsscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isoc99_sscanf = Module["___isoc99_sscanf"] = function() {
  return (___isoc99_sscanf = Module["___isoc99_sscanf"] = Module["asm"]["__isoc99_sscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stat64 = Module["_stat64"] = function() {
  return (_stat64 = Module["_stat64"] = Module["asm"]["stat64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _stpncpy = Module["_stpncpy"] = function() {
  return (_stpncpy = Module["_stpncpy"] = Module["asm"]["stpncpy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strcasecmp_l = Module["___strcasecmp_l"] = function() {
  return (___strcasecmp_l = Module["___strcasecmp_l"] = Module["asm"]["__strcasecmp_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcasecmp_l = Module["_strcasecmp_l"] = function() {
  return (_strcasecmp_l = Module["_strcasecmp_l"] = Module["asm"]["strcasecmp_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strchrnul = Module["_strchrnul"] = function() {
  return (_strchrnul = Module["_strchrnul"] = Module["asm"]["strchrnul"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strcspn = Module["_strcspn"] = function() {
  return (_strcspn = Module["_strcspn"] = Module["asm"]["strcspn"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strerror_l = Module["___strerror_l"] = function() {
  return (___strerror_l = Module["___strerror_l"] = Module["asm"]["__strerror_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strerror_l = Module["_strerror_l"] = function() {
  return (_strerror_l = Module["_strerror_l"] = Module["asm"]["strerror_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtof = Module["_strtof"] = function() {
  return (_strtof = Module["_strtof"] = Module["asm"]["strtof"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___trunctfsf2 = Module["___trunctfsf2"] = function() {
  return (___trunctfsf2 = Module["___trunctfsf2"] = Module["asm"]["__trunctfsf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___extendsftf2 = Module["___extendsftf2"] = function() {
  return (___extendsftf2 = Module["___extendsftf2"] = Module["asm"]["__extendsftf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___floatsitf = Module["___floatsitf"] = function() {
  return (___floatsitf = Module["___floatsitf"] = Module["asm"]["__floatsitf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___multf3 = Module["___multf3"] = function() {
  return (___multf3 = Module["___multf3"] = Module["asm"]["__multf3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___addtf3 = Module["___addtf3"] = function() {
  return (___addtf3 = Module["___addtf3"] = Module["asm"]["__addtf3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___extenddftf2 = Module["___extenddftf2"] = function() {
  return (___extenddftf2 = Module["___extenddftf2"] = Module["asm"]["__extenddftf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___getf2 = Module["___getf2"] = function() {
  return (___getf2 = Module["___getf2"] = Module["asm"]["__getf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___netf2 = Module["___netf2"] = function() {
  return (___netf2 = Module["___netf2"] = Module["asm"]["__netf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___floatunsitf = Module["___floatunsitf"] = function() {
  return (___floatunsitf = Module["___floatunsitf"] = Module["asm"]["__floatunsitf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___subtf3 = Module["___subtf3"] = function() {
  return (___subtf3 = Module["___subtf3"] = Module["asm"]["__subtf3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___divtf3 = Module["___divtf3"] = function() {
  return (___divtf3 = Module["___divtf3"] = Module["asm"]["__divtf3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___eqtf2 = Module["___eqtf2"] = function() {
  return (___eqtf2 = Module["___eqtf2"] = Module["asm"]["__eqtf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___letf2 = Module["___letf2"] = function() {
  return (___letf2 = Module["___letf2"] = Module["asm"]["__letf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___trunctfdf2 = Module["___trunctfdf2"] = function() {
  return (___trunctfdf2 = Module["___trunctfdf2"] = Module["asm"]["__trunctfdf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtold = Module["_strtold"] = function() {
  return (_strtold = Module["_strtold"] = Module["asm"]["strtold"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtof_l = Module["_strtof_l"] = function() {
  return (_strtof_l = Module["_strtof_l"] = Module["asm"]["strtof_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtod_l = Module["_strtod_l"] = function() {
  return (_strtod_l = Module["_strtod_l"] = Module["asm"]["strtod_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtold_l = Module["_strtold_l"] = function() {
  return (_strtold_l = Module["_strtold_l"] = Module["asm"]["strtold_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtoull = Module["_strtoull"] = function() {
  return (_strtoull = Module["_strtoull"] = Module["asm"]["strtoull"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___multi3 = Module["___multi3"] = function() {
  return (___multi3 = Module["___multi3"] = Module["asm"]["__multi3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtol = Module["_strtol"] = function() {
  return (_strtol = Module["_strtol"] = Module["asm"]["strtol"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtoimax = Module["_strtoimax"] = function() {
  return (_strtoimax = Module["_strtoimax"] = Module["asm"]["strtoimax"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _strtoumax = Module["_strtoumax"] = function() {
  return (_strtoumax = Module["_strtoumax"] = Module["asm"]["strtoumax"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtol_internal = Module["___strtol_internal"] = function() {
  return (___strtol_internal = Module["___strtol_internal"] = Module["asm"]["__strtol_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtoul_internal = Module["___strtoul_internal"] = function() {
  return (___strtoul_internal = Module["___strtoul_internal"] = Module["asm"]["__strtoul_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtoll_internal = Module["___strtoll_internal"] = function() {
  return (___strtoll_internal = Module["___strtoll_internal"] = Module["asm"]["__strtoll_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtoull_internal = Module["___strtoull_internal"] = function() {
  return (___strtoull_internal = Module["___strtoull_internal"] = Module["asm"]["__strtoull_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtoimax_internal = Module["___strtoimax_internal"] = function() {
  return (___strtoimax_internal = Module["___strtoimax_internal"] = Module["asm"]["__strtoimax_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___strtoumax_internal = Module["___strtoumax_internal"] = function() {
  return (___strtoumax_internal = Module["___strtoumax_internal"] = Module["asm"]["__strtoumax_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tmpfile64 = Module["_tmpfile64"] = function() {
  return (_tmpfile64 = Module["_tmpfile64"] = Module["asm"]["tmpfile64"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___tolower_l = Module["___tolower_l"] = function() {
  return (___tolower_l = Module["___tolower_l"] = Module["asm"]["__tolower_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _tolower_l = Module["_tolower_l"] = function() {
  return (_tolower_l = Module["_tolower_l"] = Module["asm"]["tolower_l"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _ttyname_r = Module["_ttyname_r"] = function() {
  return (_ttyname_r = Module["_ttyname_r"] = Module["asm"]["ttyname_r"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___vfprintf_internal = Module["___vfprintf_internal"] = function() {
  return (___vfprintf_internal = Module["___vfprintf_internal"] = Module["asm"]["__vfprintf_internal"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _wctomb = Module["_wctomb"] = function() {
  return (_wctomb = Module["_wctomb"] = Module["asm"]["wctomb"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vfscanf = Module["_vfscanf"] = function() {
  return (_vfscanf = Module["_vfscanf"] = Module["asm"]["vfscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isoc99_vfscanf = Module["___isoc99_vfscanf"] = function() {
  return (___isoc99_vfscanf = Module["___isoc99_vfscanf"] = Module["asm"]["__isoc99_vfscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _vsniprintf = Module["_vsniprintf"] = function() {
  return (_vsniprintf = Module["_vsniprintf"] = Module["asm"]["vsniprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___small_vsnprintf = Module["___small_vsnprintf"] = function() {
  return (___small_vsnprintf = Module["___small_vsnprintf"] = Module["asm"]["__small_vsnprintf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___isoc99_vsscanf = Module["___isoc99_vsscanf"] = function() {
  return (___isoc99_vsscanf = Module["___isoc99_vsscanf"] = Module["asm"]["__isoc99_vsscanf"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = function() {
  return (___wasi_fd_is_valid = Module["___wasi_fd_is_valid"] = Module["asm"]["__wasi_fd_is_valid"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _wcrtomb = Module["_wcrtomb"] = function() {
  return (_wcrtomb = Module["_wcrtomb"] = Module["asm"]["wcrtomb"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _sbrk = Module["_sbrk"] = function() {
  return (_sbrk = Module["_sbrk"] = Module["asm"]["sbrk"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___libc_calloc = Module["___libc_calloc"] = function() {
  return (___libc_calloc = Module["___libc_calloc"] = Module["asm"]["__libc_calloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___libc_realloc = Module["___libc_realloc"] = function() {
  return (___libc_realloc = Module["___libc_realloc"] = Module["asm"]["__libc_realloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _realloc_in_place = Module["_realloc_in_place"] = function() {
  return (_realloc_in_place = Module["_realloc_in_place"] = Module["asm"]["realloc_in_place"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _memalign = Module["_memalign"] = function() {
  return (_memalign = Module["_memalign"] = Module["asm"]["memalign"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _posix_memalign = Module["_posix_memalign"] = function() {
  return (_posix_memalign = Module["_posix_memalign"] = Module["asm"]["posix_memalign"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _valloc = Module["_valloc"] = function() {
  return (_valloc = Module["_valloc"] = Module["asm"]["valloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _pvalloc = Module["_pvalloc"] = function() {
  return (_pvalloc = Module["_pvalloc"] = Module["asm"]["pvalloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mallinfo = Module["_mallinfo"] = function() {
  return (_mallinfo = Module["_mallinfo"] = Module["asm"]["mallinfo"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _mallopt = Module["_mallopt"] = function() {
  return (_mallopt = Module["_mallopt"] = Module["asm"]["mallopt"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_trim = Module["_malloc_trim"] = function() {
  return (_malloc_trim = Module["_malloc_trim"] = Module["asm"]["malloc_trim"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_usable_size = Module["_malloc_usable_size"] = function() {
  return (_malloc_usable_size = Module["_malloc_usable_size"] = Module["asm"]["malloc_usable_size"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_footprint = Module["_malloc_footprint"] = function() {
  return (_malloc_footprint = Module["_malloc_footprint"] = Module["asm"]["malloc_footprint"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_max_footprint = Module["_malloc_max_footprint"] = function() {
  return (_malloc_max_footprint = Module["_malloc_max_footprint"] = Module["asm"]["malloc_max_footprint"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_footprint_limit = Module["_malloc_footprint_limit"] = function() {
  return (_malloc_footprint_limit = Module["_malloc_footprint_limit"] = Module["asm"]["malloc_footprint_limit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = function() {
  return (_malloc_set_footprint_limit = Module["_malloc_set_footprint_limit"] = Module["asm"]["malloc_set_footprint_limit"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _independent_calloc = Module["_independent_calloc"] = function() {
  return (_independent_calloc = Module["_independent_calloc"] = Module["asm"]["independent_calloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _independent_comalloc = Module["_independent_comalloc"] = function() {
  return (_independent_comalloc = Module["_independent_comalloc"] = Module["asm"]["independent_comalloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _bulk_free = Module["_bulk_free"] = function() {
  return (_bulk_free = Module["_bulk_free"] = Module["asm"]["bulk_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_free = Module["_emscripten_builtin_free"] = function() {
  return (_emscripten_builtin_free = Module["_emscripten_builtin_free"] = Module["asm"]["emscripten_builtin_free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = function() {
  return (_emscripten_builtin_memalign = Module["_emscripten_builtin_memalign"] = Module["asm"]["emscripten_builtin_memalign"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = function() {
  return (_emscripten_get_sbrk_ptr = Module["_emscripten_get_sbrk_ptr"] = Module["asm"]["emscripten_get_sbrk_ptr"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _brk = Module["_brk"] = function() {
  return (_brk = Module["_brk"] = Module["asm"]["brk"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___ashlti3 = Module["___ashlti3"] = function() {
  return (___ashlti3 = Module["___ashlti3"] = Module["asm"]["__ashlti3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___lshrti3 = Module["___lshrti3"] = function() {
  return (___lshrti3 = Module["___lshrti3"] = Module["asm"]["__lshrti3"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___fe_getround = Module["___fe_getround"] = function() {
  return (___fe_getround = Module["___fe_getround"] = Module["asm"]["__fe_getround"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___fe_raise_inexact = Module["___fe_raise_inexact"] = function() {
  return (___fe_raise_inexact = Module["___fe_raise_inexact"] = Module["asm"]["__fe_raise_inexact"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___unordtf2 = Module["___unordtf2"] = function() {
  return (___unordtf2 = Module["___unordtf2"] = Module["asm"]["__unordtf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___lttf2 = Module["___lttf2"] = function() {
  return (___lttf2 = Module["___lttf2"] = Module["asm"]["__lttf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___gttf2 = Module["___gttf2"] = function() {
  return (___gttf2 = Module["___gttf2"] = Module["asm"]["__gttf2"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var setTempRet0 = Module["setTempRet0"] = function() {
  return (setTempRet0 = Module["setTempRet0"] = Module["asm"]["setTempRet0"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var getTempRet0 = Module["getTempRet0"] = function() {
  return (getTempRet0 = Module["getTempRet0"] = Module["asm"]["getTempRet0"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = function() {
  return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = function() {
  return (stackRestore = Module["stackRestore"] = Module["asm"]["stackRestore"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = function() {
  return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = function() {
  return (_emscripten_stack_get_current = Module["_emscripten_stack_get_current"] = Module["asm"]["emscripten_stack_get_current"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var dynCall_jiiiiiijiiii = Module["dynCall_jiiiiiijiiii"] = function() {
  return (dynCall_jiiiiiijiiii = Module["dynCall_jiiiiiijiiii"] = Module["asm"]["dynCall_jiiiiiijiiii"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var dynCall_jiji = Module["dynCall_jiji"] = function() {
  return (dynCall_jiji = Module["dynCall_jiji"] = Module["asm"]["dynCall_jiji"]).apply(null, arguments);
};

var _default_file = Module['_default_file'] = 34520;
var _always_make_flag = Module['_always_make_flag'] = 33776;
var _hash_deleted_item = Module['_hash_deleted_item'] = 32692;
var _one_shell = Module['_one_shell'] = 34600;
var _stopchar_map = Module['_stopchar_map'] = 33792;
var _handling_fatal_signal = Module['_handling_fatal_signal'] = 33288;
var _children = Module['_children'] = 33556;
var _job_slots_used = Module['_job_slots_used'] = 33560;
var _stdout = Module['_stdout'] = 27376;
var _cmd_prefix = Module['_cmd_prefix'] = 32736;
var _suffix_file = Module['_suffix_file'] = 43900;
var _no_builtin_rules_flag = Module['_no_builtin_rules_flag'] = 33756;
var _current_variable_set_list = Module['_current_variable_set_list'] = 32772;
var _no_builtin_variables_flag = Module['_no_builtin_variables_flag'] = 33760;
var _command_count = Module['_command_count'] = 32740;
var _db_level = Module['_db_level'] = 33732;
var _variable_buffer = Module['_variable_buffer'] = 33392;
var _env_recursion = Module['_env_recursion'] = 44016;
var _environ = Module['_environ'] = 45156;
var _expanding_var = Module['_expanding_var'] = 32216;
var _reading_file = Module['_reading_file'] = 43788;
var _warn_undefined_variables_flag = Module['_warn_undefined_variables_flag'] = 34588;
var _question_flag = Module['_question_flag'] = 33752;
var _touch_flag = Module['_touch_flag'] = 34576;
var _just_print_flag = Module['_just_print_flag'] = 34580;
var _run_silent = Module['_run_silent'] = 33728;
var _snapped_deps = Module['_snapped_deps'] = 33400;
var _export_all_variables = Module['_export_all_variables'] = 45104;
var _ignore_errors_flag = Module['_ignore_errors_flag'] = 33744;
var _not_parallel = Module['_not_parallel'] = 34604;
var _second_expansion = Module['_second_expansion'] = 34596;
var _shell_function_pid = Module['_shell_function_pid'] = 33460;
var _output_context = Module['_output_context'] = 35556;
var _stderr = Module['_stderr'] = 27368;
var _starting_directory = Module['_starting_directory'] = 34512;
var _optarg = Module['_optarg'] = 33524;
var _optind = Module['_optind'] = 32680;
var ___getopt_initialized = Module['___getopt_initialized'] = 33528;
var _opterr = Module['_opterr'] = 32684;
var _optopt = Module['_optopt'] = 32688;
var _max_pattern_deps = Module['_max_pattern_deps'] = 43884;
var _max_pattern_dep_length = Module['_max_pattern_dep_length'] = 43880;
var _num_pattern_rules = Module['_num_pattern_rules'] = 43892;
var _max_pattern_targets = Module['_max_pattern_targets'] = 43888;
var _pattern_rules = Module['_pattern_rules'] = 43896;
var _job_counter = Module['_job_counter'] = 33564;
var _output_sync = Module['_output_sync'] = 33784;
var _fatal_signal_set = Module['_fatal_signal_set'] = 34320;
var _keep_going_flag = Module['_keep_going_flag'] = 34584;
var _commands_started = Module['_commands_started'] = 43836;
var _jobserver_tokens = Module['_jobserver_tokens'] = 33568;
var _job_slots = Module['_job_slots'] = 34532;
var _max_load_average = Module['_max_load_average'] = 32720;
var _stdin = Module['_stdin'] = 27372;
var _default_shell = Module['_default_shell'] = 32696;
var _posix_pedantic = Module['_posix_pedantic'] = 34592;
var _unixy_shell = Module['_unixy_shell'] = 32700;
var _batch_mode_shell = Module['_batch_mode_shell'] = 33552;
var _make_sync = Module['_make_sync'] = 34308;
var _program = Module['_program'] = 34448;
var _directory_before_chdir = Module['_directory_before_chdir'] = 34452;
var _stdio_traced = Module['_stdio_traced'] = 35560;
var _shell_var = Module['_shell_var'] = 34456;
var _print_version_flag = Module['_print_version_flag'] = 33768;
var _makelevel = Module['_makelevel'] = 34492;
var _print_directory = Module['_print_directory'] = 34508;
var _jobserver_auth = Module['_jobserver_auth'] = 33772;
var _default_goal_var = Module['_default_goal_var'] = 34524;
var _rebuilding_makefiles = Module['_rebuilding_makefiles'] = 33780;
var _print_data_base_flag = Module['_print_data_base_flag'] = 33748;
var _clock_skew_detected = Module['_clock_skew_detected'] = 34564;
var _verify_flag = Module['_verify_flag'] = 34572;
var _output_sync_option = Module['_output_sync_option'] = 33736;
var _remote_description = Module['_remote_description'] = 45148;
var _make_host = Module['_make_host'] = 32780;
var _version_string = Module['_version_string'] = 32776;
var _env_overrides = Module['_env_overrides'] = 33740;
var _check_symlink_flag = Module['_check_symlink_flag'] = 33764;
var _default_load_average = Module['_default_load_average'] = 32728;
var _last_pattern_rule = Module['_last_pattern_rule'] = 43904;
var ___environ = Module['___environ'] = 45156;
var ____environ = Module['____environ'] = 45156;
var __environ = Module['__environ'] = 45156;
var _timezone = Module['_timezone'] = 45248;
var _daylight = Module['_daylight'] = 45252;
var _tzname = Module['_tzname'] = 45256;
var ___sig_pending = Module['___sig_pending'] = 46280;
var ___sig_actions = Module['___sig_actions'] = 46560;



// === Auto-generated postamble setup entry stuff ===

Module["ERRNO_CODES"] = ERRNO_CODES;
Module["allocateUTF8"] = allocateUTF8;
Module["FS"] = FS;
Module["PROXYFS"] = PROXYFS;


var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain(args) {

  var entryFunction = Module['_main'];

  args = args || [];
  args.unshift(thisProgram);

  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv >> 2;
  args.forEach((arg) => {
    HEAP32[argv_ptr++] = allocateUTF8OnStack(arg);
  });
  HEAP32[argv_ptr] = 0;

  try {

    var ret = entryFunction(argc, argv);

    // In PROXY_TO_PTHREAD builds, we should never exit the runtime below, as
    // execution is asynchronously handed off to a pthread.
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain(args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();







  return Module.ready
}
);
})();
export default Module;