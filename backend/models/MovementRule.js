module.exports = (sequelize, DataTypes) => {
  const MovementRule = sequelize.define("MovementRule", {
    from_role: {
      type: DataTypes.STRING,
      allowNull: false
    },

    to_role: {
      type: DataTypes.STRING,
      allowNull: false
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  return MovementRule;
};
