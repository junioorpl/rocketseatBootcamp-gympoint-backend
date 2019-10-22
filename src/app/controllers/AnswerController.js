import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import AnswerMail from '../job/AnswerMail';

class AnswerController {
  // Método que retorna todas as help orders sem resposta
  async index(req, res) {
    // Carrega as help orders sem resposta juntamente do usuário
    const unansweredQuestions = await HelpOrder.findAll({
      where: { answer: null },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
      ],
    });

    // Verifica se há help orders sem resposta
    if (unansweredQuestions.lenght === 0) {
      return res.json({ message: 'No unanswered questions' });
    }

    return res.json(unansweredQuestions);
  }

  // Método de resposta da help order
  async store(req, res) {
    // Verificação de requisição
    const request = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Carrega a help order pelo id juntamente com o usuário
    const helpOrder = await HelpOrder.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    // Verifica se a help order existe
    if (!helpOrder) {
      return res.status(404).json({ error: 'Couldn`t find Help Order' });
    }

    // Verifica se a help order ja tem resposta
    if (helpOrder.answer !== null) {
      return res.json({ message: 'Help Order already answered' });
    }

    // Salva resposta da help order
    await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    // Adiciona email de resposta de help order na fila
    await Queue.add(AnswerMail.key, {
      helpOrder,
    });

    return res.json(helpOrder);
  }
}

export default new AnswerController();
