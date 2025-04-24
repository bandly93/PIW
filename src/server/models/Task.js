module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Planner, {
      foreignKey: 'plannerId',
      as: 'planner'
    });
  };

  return Task;
};
