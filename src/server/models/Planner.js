module.exports = (sequelize, DataTypes) => {
  const Planner = sequelize.define('Planner', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Planner.associate = (models) => {
    Planner.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Planner.hasMany(models.Task, { foreignKey: 'plannerId', as: 'tasks' });
  };
  

  return Planner;
};
