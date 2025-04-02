const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Log = sequelize.define('Log', {
  date: DataTypes.DATEONLY,
  type: DataTypes.STRING,
  details: DataTypes.TEXT,
  calories: DataTypes.INTEGER,
  // userId: DataTypes.INTEGER
});

module.exports = Log
