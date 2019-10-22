import Sequelize, { Model } from 'sequelize';

// Classe modelo dos checkins, responsável pela integração com o banco de dados
class CheckIn extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'checkins',
      }
    );
    return this;
  }

  // Método que associa o estudante ao checkin
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default CheckIn;
