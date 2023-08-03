//JS file mainly to communicate with micropython.worker.js

const micropythonWorker = new Worker('micropython.worker.js', {type:"module"});

function buildMicropython(){ 
    micropythonWorker.postMessage("Build");
}

micropythonWorker.onmessage = (e) => {
    // console.log(e);
    download(hex2ascii(toHexString(e.data)), "MICROBIT.hex");
}
document.getElementById("build").onclick = buildMicropython;

// Awkward html to download a file that is stored locally
function download(data, name) {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], {type: "text/plain"}));
    a.download = name;
    a.click();
    a.remove();
}

// Convert a byte array to hex
function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

// Convert hex to ascii hex (ihex). Format read by the microbit.
function hex2ascii(hexx) {
    var hex = hexx.toString()
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}