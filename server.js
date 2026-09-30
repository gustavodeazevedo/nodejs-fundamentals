// Importanto o módulo http do Node.js
import { createServer } from 'node:http';

// Criando um simples servidor HTTP
const server = createServer((request, response) => {
    console.log('Server is running...');

    return response.end('Hello, World!');
});

// Ouvindo na porta 3000
// "listen" é um método do objeto "server"
server.listen(3000);