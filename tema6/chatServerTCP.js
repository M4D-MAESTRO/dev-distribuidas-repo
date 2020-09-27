const http = require("http").createServer();
const io = require("socket.io")(http);

http.listen(3001, () => {
  console.log("Chat server listening at port 3001.");
});

var users = {};

io.on("connection", (socket) => {
  users[socket.id] = `Candango${users.length}`;
  console.log("Client connected", socket.id, users.length);
  socket.broadcast.emit("message", `Maluco ${users[socket.id]}`);

  socket.on("message", (event) => {
    console.log(event);
    socket.broadcast.emit("message", event);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} logged out.`);
    socket.broadcast.emit(
      "message",
      ` Maluco ${users[socket.id]} pediu pra sair.`
    );
  });
});
