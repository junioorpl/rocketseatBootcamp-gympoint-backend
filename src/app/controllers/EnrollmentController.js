import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Queue from '../../lib/Queue';
import WelcomeMail from '../job/WelcomeMail';
import UpdateMail from '../job/UpdateMail';

class EnrollmentController {
  // Método que retorna todas as matriculas ativas
  async index(req, res) {
    const enrollments = await Enrollment.findAll({ where: { active: true } });
    return res.json(enrollments);
  }

  // Método que cria uma nova matricula
  async store(req, res) {
    // Verifica requisição
    const request = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    const student = await Student.findByPk(req.body.student_id);

    // Verifica se estudante existe
    if (!student) {
      return res.status(404).json({ error: 'Couldn`t find student' });
    }

    const enrollmentExists = await Enrollment.findOne({
      where: { student_id: req.body.student_id },
    });

    // Verifica se a matricula já existe
    if (enrollmentExists) {
      return res.status(401).json({
        error:
          'Student already have an enrollment. Try updating the existing one',
      });
    }

    const selectedPlan = await Plan.findByPk(req.body.plan_id);

    // Verifica se o plano selecionado existe
    if (!selectedPlan) {
      return res.status(404).json({ error: 'Plan doesn`t exist' });
    }

    const startDay = startOfDay(parseISO(req.body.start_date));

    // Verifica se data de incio já passou
    if (isBefore(startDay, new Date())) {
      return res.status(400).json({ error: 'Invalid start date' });
    }

    // Calcula final de prazo do plano
    const endDay = addMonths(startDay, selectedPlan.duration);
    // Calcula valor total da matricula
    const price = selectedPlan.price * selectedPlan.duration;

    // Salva matricula
    await Enrollment.create({
      student_id: student.id,
      plan_id: selectedPlan.id,
      start_date: startDay,
      end_date: endDay,
      price,
    });

    // Busca matricula carregando o plano e o estudante
    const enrollment = await Enrollment.findOne({
      where: { student_id: student.id },
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
        'active',
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attirbutes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attirbutes: ['id', 'title'],
        },
      ],
    });

    // Adiciona email de boas vindas na fila de envio
    await Queue.add(WelcomeMail.key, {
      enrollment,
    });

    return res.json(enrollment);
  }

  // Método que atualiza uma matricula existente
  async update(req, res) {
    // Verifica requisição
    const request = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .positive()
        .required(),
      plan_id: Yup.number()
        .integer()
        .positive()
        .required(),
      start_date: Yup.date().required(),
      active: Yup.boolean(),
    });

    if (!(await request.isValid(req.body))) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Busca matricula junto com o estudante e o plano
    const enrollment = await Enrollment.findOne({
      where: { student_id: req.body.student_id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    // Verifica existencia de matricula
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment doensn`t exists' });
    }

    const newPlan = await Plan.findByPk(req.body.plan_id);

    // Verifica novo plano existe
    if (!newPlan) {
      return res.status(404).json({ error: 'Plan doesn`t exist' });
    }

    const newStartDay = startOfDay(parseISO(req.body.start_date));

    // Verifica se data de incio é antes da data ataual
    if (isBefore(newStartDay, new Date())) {
      return res.status(400).json({ error: 'Invalid start date' });
    }

    // Calcula final do prazo do plano
    const newEndDay = addMonths(newStartDay, newPlan.duration);
    // Calcula novo valor total do plano
    const newPrice = newPlan.price * newPlan.duration;

    await enrollment.save({
      plan_id: newPlan.id,
      start_date: newStartDay,
      end_date: newEndDay,
      price: newPrice,
      // Se houver o campo active no corpo da requisição a matricula esta sendo reativada
      active: req.body.active ? true : enrollment.active,
    });

    // Adiciona email de atualização na fila de envio
    await Queue.add(UpdateMail.key, {
      enrollment,
    });

    return res.json(enrollment);
  }

  // Método de cancelamento de matricula
  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    // Verifica se matricula existe
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment doensn`t exists' });
    }

    // Verifica se matricula é ativa
    if (!enrollment.active) {
      return res.status(400).json({ error: 'Enrollment already cancelled' });
    }

    // Desativa matricula
    enrollment.active = false;
    enrollment.save();

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
