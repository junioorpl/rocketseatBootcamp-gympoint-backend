import Sequelize from 'sequelize';
import User from '../app/models/User';
import config from '../config/database';
import Student from '../app/models/Student';
import Plan from '../app/models/Plan';
import Enrollment from '../app/models/Enrollment';
import CheckIn from '../app/models/CheckIn';
import HelpOrder from '../app/models/HelpOrder';

// Array que contém todos os models da aplicação
const models = [User, Student, Plan, Enrollment, CheckIn, HelpOrder];

// Classe que inicia a conexão dos models com o banco de dados
class Database {
  constructor() {
    this.init();
  }

  // Método que inicia a conexão com o postgre dos models inclusos no array
  init() {
    this.connection = new Sequelize(config);
    models
      .map(model => model.init(this.connection))
      // Start do método associate em modelos que o possuirem
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
