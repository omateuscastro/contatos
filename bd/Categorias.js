const Sequelize = require('sequelize');
const conexao = require('./conexao')

const Categorias = conexao.define('categorias', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: Sequelize.STRING
});

// O parâmetro force, controla se a tabela será recriada mesmo já existindo no banco de dados.
Categorias.sync({force: false});

module.exports = Categorias;