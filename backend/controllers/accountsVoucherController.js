const { AccountsVoucher, File, sequelize } = require("../models");

/**
 * CREATE VOUCHER → pending
 * Allowed: ACCOUNTS, ADMIN
 */
exports.createVoucher = async (req, res) => {
  try {
    if (!["ACCOUNTS", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only Accounts can create vouchers",
      });
    }

    const { file_id, voucher_type, amount } = req.body;

    if (!file_id || !voucher_type || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = await File.findByPk(file_id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const voucher = await AccountsVoucher.create({
      file_id,
      voucher_no: `VCH/${file.unit}/${Date.now()}`,
      voucher_type,
      amount,
      financial_year: new Date().getFullYear(),
      status: "pending",
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Voucher created successfully",
      voucher,
    });
  } catch (error) {
    console.error("CREATE VOUCHER ERROR:", error);
    res.status(500).json({ message: "Failed to create voucher" });
  }
};

/**
 * GET ALL VOUCHERS
 * Allowed: any authenticated user
 */
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await AccountsVoucher.findAll({
      include: [
        {
          model: File,
          as: "File",
          attributes: ["file_no"],
        },
      ],
      order: [["id", "DESC"]], // ✅ SAFE
    });

    res.json(vouchers);
  } catch (error) {
    console.error("GET VOUCHERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch vouchers" });
  }
};

/**
 * APPROVE → pending → approved
 * Allowed: TREASURER, HONORARY_SECRETARY, ADMIN
 */
exports.approveVoucher = async (req, res) => {
  try {
    // ROLE CHECK
    if (
      !["TREASURER", "HONORARY_SECRETARY", "ADMIN"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Not authorized to approve vouchers",
      });
    }

    const voucher = await AccountsVoucher.findByPk(req.params.id);

    if (!voucher) {
      return res.status(404).json({
        message: "Voucher not found",
      });
    }

    // 🔑 NORMALIZE STATUS
    const status = voucher.status.toLowerCase().trim();

    if (status !== "pending") {
      return res.status(400).json({
        message: `Voucher cannot be approved. Current status: ${voucher.status}`,
      });
    }

    voucher.status = "approved";
    voucher.approved_by = req.user.id;

    await voucher.save();

    return res.json({
      message: "Voucher approved successfully",
    });
  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return res.status(500).json({
      message: "Approval failed",
    });
  }
};

/**
 * REJECT → pending → rejected
 * Allowed: TREASURER, HONORARY_SECRETARY, ADMIN
 */
exports.rejectVoucher = async (req, res) => {
  try {
    if (!["TREASURER", "HONORARY_SECRETARY", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized to reject vouchers",
      });
    }

    const voucher = await AccountsVoucher.findByPk(req.params.id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.status !== "pending") {
      return res.status(400).json({
        message: "Only pending vouchers can be rejected",
      });
    }

    voucher.status = "rejected";
    await voucher.save();

    res.json({
      message: "Voucher rejected successfully",
      status: voucher.status,
    });
  } catch (error) {
    console.error("REJECT VOUCHER ERROR:", error);
    res.status(500).json({ message: "Rejection failed" });
  }
};

/**
 * PAY → approved → paid
 * Allowed: ACCOUNTS, ADMIN
 */
exports.payVoucher = async (req, res) => {
  try {
    if (!["ACCOUNTS", "ADMIN"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only Accounts can pay vouchers",
      });
    }

    const voucher = await AccountsVoucher.findByPk(req.params.id);

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.status !== "approved") {
      return res.status(400).json({
        message: "Only approved vouchers can be paid",
      });
    }

    voucher.status = "paid";
    voucher.paid_by = req.user.id;
    voucher.paid_at = new Date();
    await voucher.save();

    await File.update(
      { status: "accounts_completed" },
      { where: { id: voucher.file_id } }
    );

    res.json({
      message: "Voucher paid successfully",
    });
  } catch (error) {
    console.error("PAY VOUCHER ERROR:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};
