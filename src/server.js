const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./routers');

// Inicialize uma nova instância do express
const app = express();

// Use o middleware body-parser para lidar com requisições com corpo JSON
app.use(bodyParser.json());

// Use o routers para todas as rotas que começam com /schedule
app.use('/api', routers);

module.exports = app;
