module.exports = (sequelize, DataTypes) => {
  const AccountsVoucher = sequelize.define(
    "AccountsVoucher",
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

      voucher_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      voucher_type: {
        type: DataTypes.ENUM("receipt", "payment", "journal"),
        allowNull: false,
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },

      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      financial_year: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      created_by: DataTypes.INTEGER,
      approved_by: DataTypes.INTEGER,
      paid_by: DataTypes.INTEGER,
      paid_at: DataTypes.DATE,
    },
    {
      tableName: "accounts_vouchers",
      timestamps: true,
    }
  );

  return AccountsVoucher;
};
