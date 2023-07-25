//JS file mainly to communicate with micropython.worker.js

const micropythonWorker = new Worker('micropython.worker.js', {type:"module"});