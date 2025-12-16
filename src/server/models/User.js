module.exports = (sequelize, DataTypes) => {
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
    calorieGoal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 2000,
    },
    proteinsGoal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 150,
    },
    carbsGoal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 200,
    },
    fatsGoal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 70,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Planner, { foreignKey: 'userId', as: 'planners' });
    User.hasMany(models.Log, { foreignKey: 'userId', as: 'logs' });
  };
  
  return User;
};
