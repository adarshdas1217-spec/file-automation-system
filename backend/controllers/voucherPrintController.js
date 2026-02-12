const { AccountsVoucher, File, User } = require("../models");
const { generatePDF } = require("../services/pdfService");
const { voucherTemplate } = require("../templates/voucherTemplate");
const { amountToWords } = require("../utils/amountToWords");
const { getLogoBase64 } = require("../utils/logoBase64");

exports.printVoucher = async (req, res) => {
  try {
    const { id } = req.params;

    const voucher = await AccountsVoucher.findByPk(id, {
      include: [
        { model: File, as: "File" },
        { model: User, as: "creator", attributes: ["name"] },
        { model: User, as: "approver", attributes: ["name"] },
        { model: User, as: "payer", attributes: ["name"] },
      ],
    });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    if (voucher.status.toLowerCase() !== "paid") {
      return res.status(400).json({
        message: "Only PAID vouchers can be printed",
      });
    }

    const preparedBy = voucher.creator?.name || "—";
    const approvedBy = voucher.approver?.name || "—";
    const paidBy = voucher.payer?.name || "—";
    


    const paidDate = voucher.paid_at
      ? new Date(voucher.paid_at).toLocaleDateString("en-GB")
      : "—";

    const html = voucherTemplate({
      logo: getLogoBase64(),
      fileNo: voucher.File.file_no,
      voucherNo: voucher.voucher_no,
      date: voucher.updatedAt.toLocaleDateString("en-GB"),
      particulars: voucher.voucher_type,
      amount: voucher.amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      }),
      amountWords: amountToWords(voucher.amount) + " Only",
      preparedBy,
      approvedBy,
      paidBy,
      paidDate,
    });

    const pdf = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=voucher-${voucher.id}.pdf`,
    });

    res.send(pdf);
  } catch (error) {
    console.error("PRINT VOUCHER ERROR:", error);
    res.status(500).json({
      message: "Failed to generate PDF",
    });
  }
};
