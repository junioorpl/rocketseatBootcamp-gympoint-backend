import Sequelize, { Model } from 'sequelize';

// Classe modelo das help orders, responsável pela integração com o banco de dados
class HelpOrder extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        question: Sequelize.STRING,
        answer: Sequelize.STRING,
        answer_at: Sequelize.DATE,
      },
      {
        sequelize,
        modelName: 'help_orders',
      }
    );
    return this;
  }

  // Método que faz o relacionamento do estudante com a help order
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default HelpOrder;
