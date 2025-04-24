// src/server/models/Log.js
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    date: DataTypes.DATEONLY,
    type: DataTypes.STRING,
    details: DataTypes.TEXT,
    calories: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Log;
};
