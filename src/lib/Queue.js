import Bee from 'bee-queue';
import WelcomeMail from '../app/job/WelcomeMail';

import redisConfig from '../config/redis';
import AnswerMail from '../app/job/AnswerMail';
import UpdateMail from '../app/job/UpdateMail';

// Array de jobs que serão inicializados
const jobs = [WelcomeMail, AnswerMail, UpdateMail];

class Queue {
  constructor() {
    // Declaração de filas
    this.queues = {};
    this.init();
  }

  // Inicializaçao de job
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // Função de adicionar job a fila
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  // Função que processa a fila
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  // Função de output de erros no console
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name} FAILED`, err);
  }
}
export default new Queue();
