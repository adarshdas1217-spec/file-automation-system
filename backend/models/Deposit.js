module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define("Deposit", {
    deposit_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    interest_rate: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Deposit;
};
