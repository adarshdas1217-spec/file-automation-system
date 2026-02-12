module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      voucher_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      payment_mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },

      reference_no: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      bank_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      transaction_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      paid_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "payments",
      timestamps: false, // 🔥 THIS FIXES THE ERROR
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.AccountsVoucher, {
      foreignKey: "voucher_id",
      as: "voucher",
    });

    Payment.belongsTo(models.User, {
      foreignKey: "paid_by",
      as: "payer",
    });
  };

  return Payment;
};
