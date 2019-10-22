import Sequelize, { Model } from 'sequelize';

// Classe modelo dos planos, responsável pela integração com o banco de dados
class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Plan;
