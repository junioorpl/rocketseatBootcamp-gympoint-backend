import { Op } from 'sequelize';
import { startOfWeek, endOfWeek } from 'date-fns';
import CheckIn from '../models/CheckIn';
import Enrollment from '../models/Enrollment';

class CheckinController {
  // Método que retorna todos os checkins de um usuário
  async index(req, res) {
    const enrollment = await Enrollment.findOne({
      where: { student_id: req.params.id },
    });

    // Verifica se matrícula existe
    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'The student doesn`t have an enrollment' });
    }

    // Verifica se matricula é ativa
    if (!enrollment.active) {
      return res
        .status(401)
        .json({ error: 'Student`s enrollment is not active' });
    }

    // Resgata todos os checkins de um usuário
    const allTimeCheckins = await CheckIn.findAll({
      where: { student_id: req.params.id },
    });

    // Mensagem caso o usuário não possua checkins
    if (allTimeCheckins.length === 0) {
      return res.json({ message: 'Student doesn`t have any checkins' });
    }

    return res.json(allTimeCheckins);
  }

  // Método de realização de checkin
  async store(req, res) {
    const enrollment = await Enrollment.findOne({
      where: { student_id: req.params.id },
    });

    // Verifica se a matrícula existe
    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'The student doesn`t have an enrollment' });
    }

    // Verifica se a matrícula é ativa
    if (!enrollment.active) {
      return res
        .status(401)
        .json({ error: 'Student`s enrollment is not active' });
    }

    const currentDate = new Date();

    // Resgata todos os checkins do usuário na semana
    const checkinCounter = await CheckIn.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [startOfWeek(currentDate), endOfWeek(currentDate)],
        },
      },
    });

    // Verifica se o usuário tem 5 checkins na semana
    if (checkinCounter.length >= 5) {
      return res.status(401).json({ error: 'Checkin limit reached' });
    }

    // Registra checkin
    const checkin = await CheckIn.create({
      student_id: req.params.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
