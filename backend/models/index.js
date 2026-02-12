const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

// ==================== CORE SYSTEM ====================

const User = require("./User")(sequelize, DataTypes);
const File = require("./File")(sequelize, DataTypes);
const FileMovement = require("./FileMovement")(sequelize, DataTypes);
const FileNoteSheet = require("./FileNoteSheet")(sequelize, DataTypes);
const FileNote = require("./FileNote")(sequelize, DataTypes);
const FileAttachment = require("./FileAttachment")(sequelize, DataTypes);
const OperationMatrix = require("./OperationMatrix")(sequelize, DataTypes);
const MovementRule = require("./MovementRule")(sequelize, DataTypes);

// ==================== ACCOUNTS & FINANCE ====================

const AccountsVoucher = require("./AccountsVoucher")(sequelize, DataTypes);
const Payment = require("./Payment")(sequelize, DataTypes);

const SavingsAccount = require("./SavingsAccount")(sequelize, DataTypes);
const SavingsTransaction = require("./SavingsTransaction")(sequelize, DataTypes);
const Deposit = require("./Deposit")(sequelize, DataTypes);
const DepositTransaction = require("./DepositTransaction")(sequelize, DataTypes);

// ==================== ASSOCIATIONS ====================

// ---------- File ↔ AccountsVoucher ----------
FileNoteSheet.belongsTo(User, {
  foreignKey: "created_by",
  as: "author",
});

File.hasMany(AccountsVoucher, {
  foreignKey: "file_id",
  onDelete: "CASCADE",
});

AccountsVoucher.belongsTo(File, {
  foreignKey: "file_id",
  as: "File",
});

// ---------- AccountsVoucher ↔ User ----------
AccountsVoucher.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

AccountsVoucher.belongsTo(User, {
  foreignKey: "approved_by",
  as: "approver",
});

AccountsVoucher.belongsTo(User, {
  foreignKey: "paid_by",
  as: "payer",
});

// ---------- AccountsVoucher ↔ Payment ----------
AccountsVoucher.hasMany(Payment, {
  foreignKey: "voucher_id",
  as: "payments",
});

Payment.belongsTo(AccountsVoucher, {
  foreignKey: "voucher_id",
  as: "voucher",
});

// ---------- Payment ↔ User ----------
Payment.belongsTo(User, {
  foreignKey: "paid_by",
  as: "payer",
});

// ==================== EXPORT ====================

module.exports = {
  sequelize,

  // Core
  User,
  File,
  FileMovement,
  FileNote,
  FileAttachment,
  OperationMatrix,
  MovementRule,
  FileNoteSheet,

  // Accounts
  AccountsVoucher,
  Payment,
  SavingsAccount,
  SavingsTransaction,
  Deposit,
  DepositTransaction,
};
