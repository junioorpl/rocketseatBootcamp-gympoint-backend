import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  // Método que retorna todos os planos
  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  // Método para cadastrar novo plano
  async store(req, res) {
    // Verificação de requisição
    const request = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .integer()
        .positive()
        .required(),
      price: Yup.number()
        .integer()
        .positive()
        .required(),
    });

    if (!(await request.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation failed. Invalid request' });
    }

    // Criação e retorno de plano
    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  // Método de atualização de plano
  async update(req, res) {
    // Verificação de requisição
    const request = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer(),
      price: Yup.number().integer(),
    });

    if (!(await request.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation failed. Invalid request' });
    }

    const plan = await Plan.findByPk(req.params.id);

    // Verifica se plano existe
    if (!plan) {
      return res.status(404).json('Sorry, this plan doesn`t exist');
    }

    // Atualiza e retorna o plano
    await plan.update({
      title: req.body.title ? req.body.title : plan.title,
      duration: req.body.duration ? req.body.duration : plan.duration,
      price: req.body.price ? req.body.price : plan.price,
    });

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json('Sorry, this plan doesn`t exist');
    }

    await plan.destroy();
    return res.json({ message: 'Succesfully deleted' });
  }
}

export default new PlanController();
