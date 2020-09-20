const Sequelize = require('sequelize');
const conexao = require('./conexao');
const Categorias = require('./Categorias');

const Contatos = conexao.define('contatos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: Sequelize.STRING,
  email: Sequelize.STRING,
  nascimento: Sequelize.DataTypes.DATEONLY
});

Contatos.belongsTo(Categorias);

// O parâmetro force, controla se a tabela será recriada mesmo já existindo no banco de dados.
Contatos.sync({force: false});

module.exports = Contatos;