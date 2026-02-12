const { Payment, AccountsVoucher, File } = require("../models");

exports.createPayment = async (req, res) => {
  try {
    // 🔒 ROLE CHECK
    if (req.user.role.toLowerCase() !== "accounts") {
      return res.status(403).json({
        message: "Only Accounts can make payments",
      });
    }

    const {
      voucher_id,
      payment_mode,
      amount,
      reference_no,
      bank_name,
      transaction_date,
      remarks,
    } = req.body;

    // 🔒 Voucher validation
    const voucher = await AccountsVoucher.findByPk(voucher_id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.status.toLowerCase() !== "approved") {
      return res.status(400).json({
        message: "Only APPROVED vouchers can be paid",
      });
    }

    // 🔹 Create payment entry
    await Payment.create({
      voucher_id,
      payment_mode,
      amount,
      reference_no,
      bank_name,
      transaction_date,
      remarks,
      paid_by: req.user.id,
    });

    // 🔹 Update voucher
    voucher.status = "paid";
    voucher.paid_by = req.user.id;
    voucher.paid_at = new Date();
    await voucher.save();

    // 🔹 Update file
    await File.update(
      { status: "accounts_completed" },
      { where: { id: voucher.file_id } }
    );

    res.json({
      message: "Payment recorded successfully",
    });
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);
    res.status(500).json({
      message: "Failed to record payment",
    });
  }
};
