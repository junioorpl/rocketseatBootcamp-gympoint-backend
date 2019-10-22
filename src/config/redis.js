import 'dotenv/config';

// Config de credenciais de acesso ao banco redis
export default {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};
