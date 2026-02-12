const PDFDocument = require("pdfkit");
const { Payment, AccountsVoucher, File, User } = require("../models");

exports.exportPaymentRegisterPDF = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: AccountsVoucher,
          as: "voucher",
          include: [{ model: File, as: "File" }],
        },
        {
          model: User,
          as: "payer",
          attributes: ["name"],
        },
      ],
      order: [["transaction_date", "ASC"]],
    });

    // ✅ LANDSCAPE A4
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 30,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=payment-register.pdf"
    );

    doc.pipe(res);

    /* ================= HEADER ================= */
    doc.font("Helvetica-Bold").fontSize(14).text(
      "INDIAN RED CROSS SOCIETY",
      { align: "center" }
    );

    doc.fontSize(11).text(
      "Odisha State Branch, Bhubaneswar – 751022",
      { align: "center" }
    );

    doc.moveDown(0.8);
    doc.fontSize(12).text("PAYMENT REGISTER", { align: "center" });
    doc.moveDown(1.5);

    /* ================= TABLE CONFIG ================= */
    const startY = doc.y;
    const rowHeight = 22;

    const X = {
      sl: 30,
      date: 60,
      voucher: 120,
      file: 260,
      purpose: 390,
      amount: 510,
      mode: 590,
      bank: 650,
      paidBy: 760,
    };

    const W = {
      sl: 20,
      date: 55,
      voucher: 130,
      file: 120,
      purpose: 110,
      amount: 65,
      mode: 55,
      bank: 95,
      paidBy: 120,
    };

    /* ================= TABLE HEADER ================= */
    doc.font("Helvetica-Bold").fontSize(10);

    doc.text("Sl", X.sl, startY, { width: W.sl });
    doc.text("Date", X.date, startY, { width: W.date });
    doc.text("Voucher No", X.voucher, startY, { width: W.voucher });
    doc.text("File No", X.file, startY, { width: W.file });
    doc.text("Purpose", X.purpose, startY, { width: W.purpose });
    doc.text("Amount", X.amount, startY, { width: W.amount, align: "right" });
    doc.text("Mode", X.mode, startY, { width: W.mode });
    doc.text("Bank / Ref", X.bank, startY, { width: W.bank });
    doc.text("Paid By", X.paidBy, startY, { width: W.paidBy });

    doc.moveDown(0.6);
    doc.font("Helvetica");

    /* ================= TABLE ROWS ================= */
    let y = startY + rowHeight;
    let total = 0;

    payments.forEach((p, i) => {
      total += Number(p.amount || 0);

      doc.text(i + 1, X.sl, y, { width: W.sl });

      doc.text(
        p.transaction_date
          ? new Date(p.transaction_date).toLocaleDateString("en-GB")
          : "-",
        X.date,
        y,
        { width: W.date }
      );

      // 🔒 FIXED WIDTH — NO OVERLAP
      doc.text(
        p.voucher?.voucher_no || "-",
        X.voucher,
        y,
        { width: W.voucher, ellipsis: true }
      );

      doc.text(
        p.voucher?.File?.file_no || "-",
        X.file,
        y,
        { width: W.file, ellipsis: true }
      );

      doc.text(
        p.voucher?.voucher_type || "-",
        X.purpose,
        y,
        { width: W.purpose, ellipsis: true }
      );

      doc.text(
        Number(p.amount || 0).toFixed(2),
        X.amount,
        y,
        { width: W.amount, align: "right" }
      );

      doc.text(p.payment_mode || "-", X.mode, y, { width: W.mode });

      doc.text(
        p.bank_name || "-",
        X.bank,
        y,
        { width: W.bank, ellipsis: true }
      );

      doc.text(
        p.payer?.name || "-",
        X.paidBy,
        y,
        { width: W.paidBy, ellipsis: true }
      );

      y += rowHeight;

      // ✅ PAGE BREAK HANDLING
      if (y > 520) {
        doc.addPage({ layout: "landscape", margin: 30 });
        y = 50;
      }
    });

    /* ================= TOTAL ================= */
    /* ================= TOTAL (LEFT SIDE) ================= */
doc.moveDown(2);
doc.font("Helvetica-Bold").fontSize(11);

doc.text(
  `TOTAL AMOUNT PAID: ₹ ${total.toLocaleString("en-IN")}`,
  30, // ⬅ LEFT MARGIN
  doc.y,
  { align: "left" }
);

/* ================= FOOTER (LEFT ALIGNED – GOVT STYLE) ================= */
doc.moveDown(1.5);
doc.font("Helvetica").fontSize(10);

doc.text("Prepared By: Accounts Section", 30);
doc.moveDown(0.3);

doc.text("Verified By: Treasurer", 30);
doc.moveDown(0.3);

doc.text("Approved By: Honorary Secretary", 30);

/* ================= DISCLAIMER ================= */
doc.moveDown(2);
doc.fontSize(8).text(
  "This is a computer generated register.",
  30,
  doc.y,
  { align: "left" }
);

    doc.end();
  } catch (error) {
    console.error("PAYMENT REGISTER PDF ERROR:", error);
    res.status(500).json({ message: "Failed to export PDF" });
  }
};
