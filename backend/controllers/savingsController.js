const { SavingsAccount } = require("../models");

/**
 * GET /api/savings
 */
exports.getSavingsAccounts = async (req, res) => {
  try {
    const accounts = await SavingsAccount.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(accounts);
  } catch (err) {
    console.error("FETCH SAVINGS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch savings accounts",
      error: err.message
    });
  }
};

/**
 * POST /api/savings
 */
exports.createSavingsAccount = async (req, res) => {
  try {
    const { account_name, opening_balance } = req.body;

    if (!account_name || opening_balance === undefined) {
      return res.status(400).json({
        message: "account_name and opening_balance are required"
      });
    }

    const account = await SavingsAccount.create({
      account_name,
      opening_balance,
      current_balance: opening_balance,
      created_by: req.user.id
    });

    res.status(201).json({
      message: "Savings account created successfully",
      account
    });
  } catch (err) {
    console.error("CREATE SAVINGS ERROR:", err);
    res.status(500).json({
      message: "Failed to create savings account",
      error: err.message
    });
  }
};
