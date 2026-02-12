module.exports = (sequelize, DataTypes) => {
  const SavingsAccount = sequelize.define("SavingsAccount", {
    account_name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    opening_balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    current_balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return SavingsAccount;
};
