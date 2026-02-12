module.exports = (sequelize, DataTypes) => {
  return sequelize.define("SavingsTransaction", {
    savings_account_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    transaction_type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    remark: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    tableName: "savings_transactions",
    updatedAt: false
  });
};