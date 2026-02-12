module.exports = (sequelize, DataTypes) => {
  const FileMovement = sequelize.define(
    "FileMovement",
    {
      file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      from_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      to_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remark: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "file_movements",
      timestamps: true, // uses createdAt, updatedAt
    }
  );

  FileMovement.associate = (models) => {
    FileMovement.belongsTo(models.File, {
      foreignKey: "file_id",
    });

    FileMovement.belongsTo(models.User, {
      as: "fromUser",
      foreignKey: "from_user",
    });

    FileMovement.belongsTo(models.User, {
      as: "toUser",
      foreignKey: "to_user",
    });
  };

  return FileMovement;
};
