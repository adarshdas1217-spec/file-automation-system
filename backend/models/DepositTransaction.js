module.exports = (sequelize, DataTypes) => {
  return sequelize.define("DepositTransaction", {
    deposit_id: DataTypes.INTEGER,
    transaction_type: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    remark: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    tableName: "deposit_transactions",
    updatedAt: false
  });
};
