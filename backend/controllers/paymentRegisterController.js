const { Payment, AccountsVoucher, File, User } = require("../models");

exports.getPaymentRegister = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: AccountsVoucher,
          as: "voucher",
          attributes: ["voucher_no", "voucher_type"],
          include: [
            {
              model: File,
              as: "File",
              attributes: ["file_no"],
            },
          ],
        },
        {
          model: User,
          as: "payer",
          attributes: ["name"],
        },
      ],
      order: [["transaction_date", "ASC"]],
    });

    res.json(payments);
  } catch (error) {
    console.error("PAYMENT REGISTER ERROR:", error);
    res.status(500).json({ message: "Failed to fetch payment register" });
  }
};
