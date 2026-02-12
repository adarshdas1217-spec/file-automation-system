module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      role: {
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
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["email"]
        }
      ]
    }
  );

  return User;
};
