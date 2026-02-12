module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("File", {
    file_no: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },

    unit: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "OPEN"
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    current_holder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return File;
};
