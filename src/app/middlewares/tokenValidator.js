import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// Importa parametros para verificação de token
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  // Verifica existencia do token do header da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // Separa o token do "Bearer" inicial da string
  const [, token] = authHeader.split(' ');

  // Verificação de validade do token
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
