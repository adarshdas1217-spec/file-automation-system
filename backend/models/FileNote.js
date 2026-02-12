module.exports = (sequelize, DataTypes) => {
  const FileNote = sequelize.define("FileNote", {
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return FileNote;
};
