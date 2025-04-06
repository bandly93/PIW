const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // 🆕 Macro & calorie goals
  calorieGoal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 2000,
  },
  proteinGoal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 150,
  },
  carbGoal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 200,
  },
  fatGoal: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 70,
  },
});

module.exports = User;
