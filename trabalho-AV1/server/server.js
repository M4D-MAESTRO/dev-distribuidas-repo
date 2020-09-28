const jsonServer = require("json-server");
const path = require("path");
const http = require("http");
const axios = require("axios");
const socketio = require("socket.io");
const UU = require("./userUtils");

const server = jsonServer.create();
const httpServer = http.createServer(server);
const router = jsonServer.router(path.join(__dirname, "db.json"));
const root = path.resolve("./public/");
const io = socketio(httpServer).listen(3002);
const middlewares = jsonServer.defaults([root]);
const PREFIX = "[SERVER]";

server.use(middlewares);
server.use(jsonServer.bodyParser);

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, roomId }) => {
    const user = UU.logUser({ id: socket.id, username, roomId });
    socket.join(user.roomId);

    console.log(
      `${PREFIX} Cliente connectado com id ${user.id} e nome ${user.username}.`
    );

    socket.broadcast.to(user.roomId).emit("serverLog", {
      users: UU.getUsersByRoomId(user.roomId),
      text: `${user.username} entrou na sala.`,
    });

    socket.emit("serverLog", {
      users: UU.getUsersByRoomId(user.roomId),
      text: `Bem-vindo ${user.username}!`,
    });

    socket.on("message", (event) => {
      console.log(`${PREFIX} Nova mensagem: ${event}`);
      socket.broadcast.to(user.roomId).emit("message", event);
    });

    socket.on("chatMessage", (message) => {
      axios
        .post("http://localhost:3001/messages", {
          author: message.author,
          body: message.body,
          roomId: parseInt(message.roomId),
        })
        .then((res) => {
          socket.broadcast.to(user.roomId).emit("message", res.data);
          socket.emit("message", res.data);
        })
        .catch((e) => console.error(e));
    });

    socket.on("disconnect", () => {
      UU.removeUser(user.id);
      socket.broadcast.to(user.roomId).emit("serverLog", {
        users: UU.getUsersByRoomId(user.roomId),
        text: `${user.username} saiu da sala.`,
      });
    });
  });
});

server.use((req, res, next) => {
  if (req.method.toUpperCase() == "POST")
    req.body.timestamp = new Date().toLocaleString();
  next();
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running on http://localhost:3001");
});
