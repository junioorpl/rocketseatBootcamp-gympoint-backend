import 'dotenv/config';

// Config de credenciais de acesso ao servidor de email
export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  // Define o remetente da mensagem
  default: {
    from: 'Equipe GYM Point <noreply@gympoint.com>',
  },
};
