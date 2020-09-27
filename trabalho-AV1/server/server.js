const jsonServer = require("json-server");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const server = jsonServer.create();
const httpServer = http.createServer(server);
const router = jsonServer.router(path.join(__dirname, "db.json"));
const root = path.resolve("./public/");
const io = socketio(httpServer).listen(3002);
const middlewares = jsonServer.defaults([root]);

server.use(middlewares);
server.use(jsonServer.bodyParser);

io.on("connection", (socket) => {
  console.log("Cliente connectado com id:", socket.id);
  socket.broadcast.emit("message", `Usuário #${socket.id} entrou na sala.`);
  socket.send(`Bem-vindo usuário #${socket.id}`);

  socket.on("message", (event) => {
    console.log(event);
    socket.broadcast.emit("message", event);
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
