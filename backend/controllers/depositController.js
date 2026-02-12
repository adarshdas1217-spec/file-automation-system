const { Deposit } = require("../models");

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.findAll({
      order: [["createdAt", "DESC"]]
    });
    res.json(deposits);
  } catch (err) {
    console.error("FETCH DEPOSITS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch deposits",
      error: err.message
    });
  }
};

exports.createDeposit = async (req, res) => {
  try {
    const { deposit_name, amount, interest_rate } = req.body;

    if (!deposit_name || !amount || !interest_rate) {
      return res.status(400).json({
        message: "deposit_name, amount and interest_rate are required"
      });
    }

    const deposit = await Deposit.create({
      deposit_name,
      amount,
      interest_rate,
      created_by: req.user.id
    });

    res.status(201).json({
      message: "Deposit created successfully",
      deposit
    });
  } catch (err) {
    console.error("CREATE DEPOSIT ERROR:", err);
    res.status(500).json({
      message: "Failed to create deposit",
      error: err.message
    });
  }
};
