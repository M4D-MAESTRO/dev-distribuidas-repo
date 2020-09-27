const { workerData, parentPort } = require('worker_threads');

const start = Date.now()
console.log(start)

console.log('thread', workerData);
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        console.log(workerData, i, j)
    }
}

parentPort.postMessage({ start, end: Date.now() })