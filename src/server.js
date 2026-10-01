const http = require("http");

const users = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/users") {
    response.setHeader("Content-Type", "application/json");
    return response.end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    users.push({
      id: users.length + 1,
      name: "Gustavo",
    });

    response.statusCode = 201;
    return response.end("Usuario criado");
  }

  response.statusCode = 404;
  response.end("Rota nao encontrada");
});

server.listen(3333, () => {
  console.log("Servidor rodando em http://localhost:3333");
});