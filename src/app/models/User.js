import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Classe modelo de usuário, responsável pela integração com o banco de dados
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Hook que gera o hash da senha do usuário
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // Função para verificar a senha
  async verifyPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
