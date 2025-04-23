const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('fitness_db', 'fitness_user', 'supersecure', {
  host: 'localhost',
  dialect: 'postgres',
  timezone: 'America/Los_Angeles', // or your preferred time zone
  dialectOptions: {
    useUTC: false, // for reading from database
  },
});

module.exports = sequelize;
