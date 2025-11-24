const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('planner_db', 'bandly', 'supersecure', {
  host: 'localhost',
  dialect: 'postgres',
  timezone: 'America/Los_Angeles', // or your preferred time zone
  dialectOptions: {
    useUTC: false, // for reading from database
  },
});

module.exports = sequelize;
