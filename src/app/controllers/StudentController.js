import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  // Método de criação de estudante
  async store(req, res) {
    // Validação de dados da requisição
    const request = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number()
        .positive()
        .required(),
      weight: Yup.number()
        .positive()
        .required(),
      height: Yup.number()
        .positive()
        .required(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid request data' });
    }

    // Verificação de existencia de estudante já cadastrado com mesmo email
    const exists = await Student.findOne({ where: { email: req.body.email } });
    if (exists) {
      return res.status(401).json({ error: 'Email is already in use' });
    }

    // Criação do estudante no banco de dados
    const { name, email, age, height, weight } = await Student.create(req.body);

    return res.json({
      name,
      email,
      age,
      height,
      weight,
    });
  }

  // Método de atualização de estudante
  async update(req, res) {
    // Validação de dados da requisição
    const request = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      age: Yup.number()
        .positive()
        .integer(),
      height: Yup.number()
        .positive()
        .integer(),
      weight: Yup.number().positive(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(401).json({ error: 'Invalid request data' });
    }

    // Busca estudante na base de dados de acordo com id passado na URL
    const student = await Student.findByPk(req.params.id);

    // Verifica se estudante existe
    if (!student) {
      return res.status(401).json({ error: 'Student does not exist' });
    }

    // Verifica se email ja está sendo usado
    if (req.body.email) {
      const { email } = req.body;
      if (await Student.findOne({ where: { email } })) {
        return res.status(401).json({ error: 'Email already in use' });
      }
    }

    // Atualiza estudante no banco de dados
    const { name, email, age, height, weight } = await student.update(req.body);

    return res.json({
      name,
      email,
      age,
      height,
      weight,
    });
  }
}

export default new StudentController();
