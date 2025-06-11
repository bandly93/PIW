// src/server/models/Log.js
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    date: DataTypes.DATEONLY,
    type: DataTypes.STRING,
    details: DataTypes.TEXT,
    calories: DataTypes.FLOAT,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Log.associate = (models) => {
    Log.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };  

  return Log;
};
