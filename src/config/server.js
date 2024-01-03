const port = 3003;

const cors = require('./cors');
const express = require('express');
const router = require('./routes/routes');
const server = express();


// Inicialização dos Middlewares 
server.use(cors);
server.use(express.json());
server.use(router);

server.listen(port, function(error){
    if (error) {
        console.error(`Erro ao iniciar o servidor: ${error}`);
    } else {
        console.log(`O backend está rodando na porta ${port}`);
    }
})