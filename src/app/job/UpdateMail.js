import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

// Job que envia o email para o estudante quando o mesmo modifica seu plano
class UpdateMail {
  get key() {
    return 'UpdateMail';
  }

  async handle({ data }) {
    const { enrollment } = data;
    const { plan } = enrollment;
    const { student } = enrollment;
    const formattedStartDay = format(
      parseISO(enrollment.start_date),
      'dd/MM/yyyy',
      {
        locale: pt,
      }
    );
    const formattedEndDay = format(
      parseISO(enrollment.end_date),
      'dd/MM/yyyy',
      {
        locale: pt,
      }
    );

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Sua jornada foi atualizada! - GYM Point!',
      template: 'update',
      context: {
        student: student.name,
        start_date: formattedStartDay,
        end_date: formattedEndDay,
        plan_name: plan.title,
        price: enrollment.price,
      },
    });
  }
}

export default new UpdateMail();
