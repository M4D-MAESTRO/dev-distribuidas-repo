const request = require('request');
const { Worker, workerData } = require('worker_threads');

function startWorker(path, wd, cb) {
    const worker = new Worker(path, { workerData: wd });
    worker.on('message', msg => {
        cb(null, msg);
    });
    worker.on('error', cb);
    worker.on('exit', code => {
        if (code != 0) {
            console.error(new Error(`Worker finalizado com exit code ${code}`))
        }
    });
    return worker;
}

startWorker('./workerCode.js', 'Thread 01', (err, result) => {
    if (err) return console.error(err);
    console.log(`Duração: ${(result.end - result.start) / 1000} segundos`)

})

startWorker('./workerCode.js', 'Thread 02', (err, result) => {
    if (err) return console.error(err);
    console.log(`Duração: ${(result.end - result.start) / 1000} segundos`)

})

request.get('http://duckduckgo.com', (err, res) => {
    if (err) return console.error(err);
    console.log(res.body)
})  