module.exports = (sequelize, DataTypes) => {
  const FileAttachment = sequelize.define("FileAttachment", {
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },

    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return FileAttachment;
};
