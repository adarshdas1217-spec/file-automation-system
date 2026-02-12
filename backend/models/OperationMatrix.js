module.exports = (sequelize, DataTypes) => {
  const OperationMatrix = sequelize.define(
    "OperationMatrix",
    {
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      file_prefix: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      current_counter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "operation_matrices", // 🔥 CRITICAL
      timestamps: false,               // 🔥 CRITICAL
    }
  );

  return OperationMatrix;
};
