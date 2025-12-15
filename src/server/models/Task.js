const { id } = require("date-fns/locale");

// src/server/models/Task.js
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: 'Other'
    },
    notes: {
      type: DataTypes.TEXT
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    date: {
      type: DataTypes.DATEONLY,  // YYYY-MM-DD format
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    logId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Planner, {
      foreignKey: 'plannerId',
      as: 'planner'
    });
  };

  return Task;
};
