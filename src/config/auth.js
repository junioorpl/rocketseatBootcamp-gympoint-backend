import 'dotenv/config';

// Exporta parâmetros que são utilizados para gerar o token
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '3d',
};
