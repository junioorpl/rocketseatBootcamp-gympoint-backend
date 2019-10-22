import { Router } from 'express';
import tokenValidator from './app/middlewares/tokenValidator';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';

// Declaração de novo roteador
const routes = new Router();

// Definição de rotas
routes.post('/sessions', SessionController.store);

// Rotas para que os estudantes utilzem

// Rotas de help orders
routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

// Middleware que será acionado para todas as que forem chamadas depois dele
routes.use(tokenValidator);

// Rotas dos students
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

// Rotas dos planos
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Rotas das matriculas
routes.post('/enrollments', EnrollmentController.store);
routes.get('/enrollments', EnrollmentController.index);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

// Rotas de checkin
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

// Rotas de help orders
routes.post('/help-orders/:id/answer', AnswerController.store);
routes.get('/help-orders/unanswered', AnswerController.index);

export default routes;
