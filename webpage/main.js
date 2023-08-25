//JS file mainly to communicate with micropython.worker.js

const micropythonWorker = new Worker('micropython.worker.js', {type:"module"});

function buildMicropython(){ 
    micropythonWorker.postMessage("Build");
}

micropythonWorker.onmessage = (e) => {
    console.log(e);
    if(e.data?.origin == "hex") download(hex2ascii(toHexString(e.data.body)), "MICROBIT.hex");
    else if(e.data?.origin == "pyfile") PYeditor.setValue(e.data.body);
    else if(e.data?.origin == "cfile") Ceditor.setValue(e.data.body); 
    else if(e.data?.origin == "log"){
        Terminal.setValue(Terminal.getValue()+"\n"+"> "+e.data.body);
        Terminal.gotoLine(Terminal.session.getLength());
    }
}

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

function generateHTML(){ 
    // Create GoldenLayout with, Two boxes on the left, one on the right. 
    var config = {
        content: [{
            type: 'row',
            content: [{
                type: 'column',
                //width: 50, // Adjust the width as needed
                content: [{
                    type: 'component',
                    componentName: 'CCode',
                }, {
                    type: 'component',
                    componentName: 'PYCode',
                }]
            }, {
                type: 'column',
                content: [{
                    type: 'component',
                    componentName: 'Terminal',
                },{
                    height: 10,
                    type: 'component',
                    componentName: 'Build',
                }]
            }]
        }]
    };
    var myLayout = new GoldenLayout( config );

    myLayout.registerComponent( 'CCode', function( container ){
        container.getElement().html( '<div id="Ceditor">Testing, Edit C Code here</div>' );
    });
    myLayout.registerComponent( 'PYCode', function( container ){
        container.getElement().html( '<div id="PYeditor">Testing, Edit PY Code here</div>' );
    });
    myLayout.registerComponent( 'Terminal', function( container ){
        container.getElement().html( '<div id="Terminal">Loading... Please Wait</div>' );
    });
    myLayout.registerComponent( 'Build', function( container ){
        container.getElement().html( '<button id="build" style="height: 10vh; width: 50vw; background-color: #4CAF50; ">PRESS TO BUILD</button>' );
    });


    myLayout.init();
    myLayout.on("initialised",setup)
}
generateHTML();

let Ceditor, PYeditor, Terminal = null;
function setup(){
    document.getElementById("build").onclick = buildMicropython;

    Ceditor = ace.edit("Ceditor");
    Ceditor.setTheme("ace/theme/twilight");
    document.getElementById('Ceditor').style.fontSize='2vh';
    
    PYeditor = ace.edit("PYeditor");
    PYeditor.setTheme("ace/theme/twilight");
    document.getElementById('PYeditor').style.fontSize='2vh';

    Terminal = ace.edit("Terminal");
    Terminal.setTheme("ace/theme/twilight");
    document.getElementById('Terminal').style.fontSize='2vh';
    Terminal.renderer.setShowGutter(false);
    Terminal.setReadOnly(true); 
}
