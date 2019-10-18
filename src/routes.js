import { Router } from 'express';
import tokenValidator from './app/middlewares/tokenValidator';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

// Declaração de novo roteador
const routes = new Router();

// Definição de rotas
routes.post('/sessions', SessionController.store);

// Middleware que será acionado para todas as que forem chamadas depois dele
routes.use(tokenValidator);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;
