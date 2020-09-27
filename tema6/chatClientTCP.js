const socket = require("socket.io-client")("http://localhost:3002");
const repl = require("repl");
const chalk = require("chalk");

socket.on("connect", () => {});
socket.on("message", (event) => {
  console.log(event);
});

repl.start({
  prompt: "",
  eval: (mensagem) => {
    socket.send(mensagem);
  },
});
