const http = require("http");

const tasks = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;

  if (method === "GET" && url === "/tasks") {
    response.setHeader("Content-Type", "application/json");
    return response.end(JSON.stringify(tasks));
  }

  if (method === "POST" && url === "/tasks") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      const data = JSON.parse(body);

      const task = {
        id: tasks.length + 1,
        title: data.title,
      };

      tasks.push(task);

      response.statusCode = 201;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(task));
    });

    return;
  }

  // Verifica se a requisição é PUT e se começa com /tasks/
if (method === "PUT" && url.startsWith("/tasks/")) {
  // Pega o ID informado na URL
  const id = Number(url.split("/")[2]);

  // Procura a tarefa pelo ID
  const task = tasks.find((task) => task.id === id);

  // Retorna 404 caso a tarefa não exista
  if (!task) {
    response.statusCode = 404;
    return response.end("Tarefa nao encontrada");
  }

  // Variável que irá armazenar o body recebido
  let body = "";

  // Recebe os dados da requisição em partes
  request.on("data", (chunk) => {
    body += chunk;
  });

  // Executa quando todo o body foi recebido
  request.on("end", () => {
    // Converte o JSON recebido em objeto JavaScript
    const data = JSON.parse(body);

    // Atualiza o título da tarefa
    task.title = data.title;

    // Retorna a tarefa atualizada
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(task));
  });

  return;
}

  // Verifica se a requisição é DELETE e se começa com /tasks/
if (method === "DELETE" && url.startsWith("/tasks/")) {
  // Pega o ID que veio na URL
  const id = Number(url.split("/")[2]);

  // Procura a posição da tarefa no array
  const taskIndex = tasks.findIndex((task) => task.id === id);

  // Retorna 404 caso a tarefa não exista
  if (taskIndex === -1) {
    response.statusCode = 404;
    return response.end("Tarefa nao encontrada");
  }

  // Remove a tarefa encontrada
  tasks.splice(taskIndex, 1);

  // Retorna status 204: sucesso sem conteúdo na resposta
  response.statusCode = 204;
  return response.end();
}

  response.statusCode = 404;
  response.end("Rota nao encontrada");
});

server.listen(3333, () => {
  console.log("Servidor rodando em http://localhost:3333");
});