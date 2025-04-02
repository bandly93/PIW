const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fitness_db', 'fitness_user', 'supersecure', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
