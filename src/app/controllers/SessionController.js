import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // Validação de dados da requisição
    const request = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(401).json({
        error: 'Invalid request',
      });
    }

    // Verificação de existência de usuário
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verificação de corretude de senha
    if (!(await user.verifyPassword(password))) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Retorno de dados juntamente do token de sessão do sistema
    const { id, name } = user;
    return res.json({
      user: {
        id,
        email,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
