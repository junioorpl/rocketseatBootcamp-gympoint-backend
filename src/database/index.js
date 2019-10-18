import Sequelize from 'sequelize';
import User from '../app/models/User';
import config from '../config/database';
import Student from '../app/models/Student';

// Array que contém todos os models da aplicação
const models = [User, Student];

// Classe que inicia a conexão dos models com o banco de dados
class Database {
  constructor() {
    this.init();
  }

  // Método que inicia a conexão dos models inclusos no array
  init() {
    this.connection = new Sequelize(config);
    models.map(model => {
      return model.init(this.connection);
    });
  }
}

export default new Database();
