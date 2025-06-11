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
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order: { // New field for task order
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
