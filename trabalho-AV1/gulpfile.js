const gulp = require("gulp");
const watch = gulp.watch;
const series = gulp.series;
const { exec, spawn } = require("child_process");
var serverProc = undefined;

const watcher = watch([
  "./client/**/*",
  "./server/**/*",
  "!./server/**/*.json",
]);

watcher.on("change", function (path, stats) {
  console.log(`File ${path} was changed - Relaunching...`);
  serverProc.kill("SIGINT");
  exports.default();
});

watcher.on("error", function (e) {
  console.error(e.stack);
});

function purge() {
  return exec("shx rm -rf ./public/*");
}

function bundle() {
  return exec(
    "parcel build --experimental-scope-hoisting ./client/html/*.html --out-dir public --no-source-maps"
  );
}

function serve() {
  if (serverProc) serverProc.kill("SIGINT");
  serverProc = spawn("node", ["server/server.js"], { stdio: "inherit" });
  serverProc.on("close", function (code) {
    if (code === 8) {
      gulp.log("Error detected, waiting for changes...");
    }
  });
}

exports.default = series(purge, bundle, serve);
