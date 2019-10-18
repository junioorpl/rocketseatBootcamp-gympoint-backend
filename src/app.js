import express from 'express';
import routes from './routes';

// Import que realiza a conexão com o banco de dados - MEGA IMPORTANTE !!!!!
import './database';

// Criação do núcleo da aplicação
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  // Importa todos os middlewares a serem utilizados no app
  middlewares() {
    this.server.use(express.json());
  }

  // Define as rotas do app - Importando o arquivo de rotas (Routes)
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
