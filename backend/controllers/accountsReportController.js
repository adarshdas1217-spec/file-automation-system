const {
  AccountsVoucher,
  SavingsAccount,
  SavingsTransaction,
  Deposit,
} = require("../models");

const { Op } = require("sequelize");

/**
 * =========================================================
 * 1️⃣ VOUCHER REGISTER
 * Govt-style list of vouchers (read-only)
 * =========================================================
 */
exports.voucherRegister = async (req, res) => {
  try {
    const { year, file_id } = req.query;

    const where = {};
    if (year) where.financial_year = year;
    if (file_id) where.file_id = file_id;

    const vouchers = await AccountsVoucher.findAll({
      where,
      order: [["id", "DESC"]], // SAFE: id always exists
    });

    res.json(vouchers);
  } catch (error) {
    console.error("VOUCHER REGISTER ERROR:", error);
    res.status(500).json({ message: "Voucher register error" });
  }
};

/**
 * =========================================================
 * 2️⃣ SAVINGS SUMMARY
 * Govt-style savings abstract
 * =========================================================
 */
exports.savingsSummary = async (req, res) => {
  try {
    const accounts = await SavingsAccount.findAll();
    const summary = [];

    for (const acc of accounts) {
      const credits =
        (await SavingsTransaction.sum("amount", {
          where: {
            savings_account_id: acc.id,
            transaction_type: "CREDIT",
          },
        })) || 0;

      const debits =
        (await SavingsTransaction.sum("amount", {
          where: {
            savings_account_id: acc.id,
            transaction_type: "DEBIT",
          },
        })) || 0;

      summary.push({
        account: acc.account_name,
        opening: acc.opening_balance,
        credits,
        debits,
        closing: acc.current_balance,
      });
    }

    res.json(summary);
  } catch (error) {
    console.error("SAVINGS SUMMARY ERROR:", error);
    res.status(500).json({ message: "Savings summary error" });
  }
};

/**
 * =========================================================
 * 3️⃣ DEPOSIT REGISTER
 * Govt deposit register
 * =========================================================
 */
exports.depositRegister = async (req, res) => {
  try {
    const { status } = req.query;

    const deposits = await Deposit.findAll({
      where: status ? { status } : {},
      order: [["id", "DESC"]], // SAFE
    });

    res.json(deposits);
  } catch (error) {
    console.error("DEPOSIT REGISTER ERROR:", error);
    res.status(500).json({ message: "Deposit register error" });
  }
};

/**
 * =========================================================
 * 4️⃣ CASH FLOW SNAPSHOT
 * Govt-style financial snapshot
 * =========================================================
 */
exports.cashFlowSnapshot = async (req, res) => {
  try {
    const savingsBalance =
      (await SavingsAccount.sum("current_balance")) || 0;

    const depositsHeld =
      (await Deposit.sum("amount", {
        where: { status: "HELD" },
      })) || 0;

    const approvedPayments =
      (await AccountsVoucher.sum("amount", {
        where: {
          voucher_type: "payment", // MATCHES ENUM
          status: "approved",
        },
      })) || 0;

    const approvedReceipts =
      (await AccountsVoucher.sum("amount", {
        where: {
          voucher_type: "receipt", // MATCHES ENUM
          status: "approved",
        },
      })) || 0;

    res.json({
      savings_balance: savingsBalance,
      deposits_held: depositsHeld,
      approved_payments: approvedPayments,
      approved_receipts: approvedReceipts,
    });
  } catch (error) {
    console.error("CASH FLOW SNAPSHOT ERROR:", error);
    res.status(500).json({ message: "Cash flow snapshot error" });
  }
};
