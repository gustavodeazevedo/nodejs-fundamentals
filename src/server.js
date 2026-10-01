// Importa o módulo HTTP nativo do Node.js
const http = require("http");

// Array que armazena as tarefas em memória
const tasks = [];

// Cria o servidor HTTP
const server = http.createServer((request, response) => {
  // Extrai o método HTTP e a URL da requisição
  const { method, url } = request;

  // Lista todas as tarefas
  if (method === "GET" && url === "/tasks") {
    // Define que a resposta será em JSON
    response.setHeader("Content-Type", "application/json");

    // Converte o array para JSON e envia a resposta
    return response.end(JSON.stringify(tasks));
  }

  // Cria uma nova tarefa
  if (method === "POST" && url === "/tasks") {
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

      // Cria uma nova tarefa
      const task = {
        id: tasks.length + 1,
        title: data.title,
      };

      // Adiciona a tarefa ao array
      tasks.push(task);

      // Define o status 201: recurso criado com sucesso
      response.statusCode = 201;

      // Define que a resposta será em JSON
      response.setHeader("Content-Type", "application/json");

      // Retorna a tarefa criada
      response.end(JSON.stringify(task));
    });

    return;
  }

  // Atualiza uma tarefa existente
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

      // Define que a resposta será em JSON
      response.setHeader("Content-Type", "application/json");

      // Retorna a tarefa atualizada
      response.end(JSON.stringify(task));
    });

    return;
  }

  // Exclui uma tarefa
  if (method === "DELETE" && url.startsWith("/tasks/")) {
    // Pega o ID informado na URL
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

    // Define o status 204: sucesso sem conteúdo na resposta
    response.statusCode = 204;

    // Finaliza a resposta
    return response.end();
  }

  // Retorna 404 caso nenhuma rota seja encontrada
  response.statusCode = 404;
  response.end("Rota nao encontrada");
});

// Inicia o servidor na porta 3333
server.listen(3333, () => {
  // Exibe no terminal que o servidor está rodando
  console.log("Servidor rodando em http://localhost:3333");
});