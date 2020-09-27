const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const root = path.resolve("./public/");
const middlewares = jsonServer.defaults([root]);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method.toUpperCase() == "POST")
    req.body.timestamp = new Date().toLocaleString();
  next();
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server is running on http://localhost:3001");
});

