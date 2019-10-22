import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import Mail from '../../lib/Mail';

// Job que envia email para o estudante quando sua help order é respondida
class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    const formattedDate = format(
      parseISO(helpOrder.answer_at),
      'HH:mm dd/MM/yyyy',
      { locale: pt }
    );

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Sua pergunta foi respondida - GYM Point',
      template: 'answer',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: formattedDate,
      },
    });
  }
}

export default new AnswerMail();
