import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  // Método que retorna todos os help orders de um estudante
  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    // Verifica se estudante existe
    if (!student) {
      return res.status(404).json({ error: 'Student doesn`t exists' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.id },
    });

    // Verifica se estudante tem alguma help order
    if (helpOrders.length === 0) {
      return res.json({ message: 'This student doesn`t have any help orders' });
    }

    return res.json(helpOrders);
  }

  // Método que cria uma help order
  async store(req, res) {
    // Verificação de request
    const request = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const student = await Student.findByPk(req.params.id);

    // Verifica se estudante existe
    if (!student) {
      return res.status(404).json({ error: 'Student doesn`t exists' });
    }

    // Cria e retorna help order
    const helpOrder = await HelpOrder.create({
      student_id: student.id,
      question: req.body.question,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
