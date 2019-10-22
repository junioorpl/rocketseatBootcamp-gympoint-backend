import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

// Job de envio de email para o estudante quando realiza sua matricula
class WelcomeMail {
  get key() {
    return 'WelcomeMail';
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
      subject: 'Bem-Vindo a família GYM Point!',
      template: 'welcome',
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

export default new WelcomeMail();
