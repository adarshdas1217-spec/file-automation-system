module.exports = (sequelize, DataTypes) => {
  const FileNoteSheet = sequelize.define(
    "FileNoteSheet",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      file_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      note_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      forwarded_to: {
        type: DataTypes.INTEGER,
        allowNull: true, // ✅ allow notes without forwarding
      },
    },
    {
      tableName: "file_note_sheets",
      timestamps: true,
      updatedAt: false, // 🔒 GOVERNMENT RULE: NO EDITS
    }
  );

  FileNoteSheet.associate = (models) => {
    FileNoteSheet.belongsTo(models.File, {
      foreignKey: "file_id",
      as: "File",
    });

    FileNoteSheet.belongsTo(models.User, {
      foreignKey: "created_by",
      as: "author",
    });

    FileNoteSheet.belongsTo(models.User, {
      foreignKey: "forwarded_to",
      as: "receiver",
    });
  };

  return FileNoteSheet;
};
