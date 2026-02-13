const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./models");
const { sequelize } = db;

console.log(
  "Voucher associations:",
  Object.keys(db.AccountsVoucher.associations)
);

// ---------------- ROUTES ----------------
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fileRoutes = require("./routes/fileRoutes");
const fileMovementRoutes = require("./routes/fileMovementRoutes");
const fileStatusRoutes = require("./routes/fileStatusRoutes");
const fileNoteRoutes = require("./routes/fileNoteRoutes");
const fileNoteSheetRoutes = require("./routes/fileNoteSheetRoutes");
const fileClosureRoutes = require("./routes/fileClosureRoutes");
const fileReopenRoutes = require("./routes/fileReopenRoutes");

// ✅ OPERATION MATRIX (UNITS)
const operationMatrixRoutes = require("./routes/operationMatrixRoutes");

// ---------------- ACCOUNTS ROUTES (FROZEN) ----------------
const accountsVoucherRoutes = require("./routes/accountsVoucherRoutes");
const paymentRegisterRoutes = require("./routes/paymentRegisterRoutes");
const savingsRoutes = require("./routes/savingsRoutes");
const depositRoutes = require("./routes/depositRoutes");
const accountsReportRoutes = require("./routes/accountsReportRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentRegisterExportRoutes = require("./routes/paymentRegisterExportRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Files & Notes
app.use("/api/files", fileRoutes);
app.use("/api/file-movements", fileMovementRoutes);
app.use("/api/file-status", fileStatusRoutes);
app.use("/api/file-notes", fileNoteSheetRoutes);
app.use("/api/files", fileClosureRoutes);
app.use("/api/files", fileReopenRoutes);

// ✅ OPERATION MATRIX (UNITS API)
app.use("/api/operation-matrix", operationMatrixRoutes);

// ---------------- ACCOUNTS (DO NOT TOUCH) ----------------
app.use("/api/accounts/vouchers", accountsVoucherRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/reports/accounts", accountsReportRoutes);
app.use("/api/accounts/payment-register", paymentRegisterRoutes);
app.use(
  "/api/accounts/payment-register/export",
  paymentRegisterExportRoutes
);

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Backend + MySQL + Models connected successfully");
});

// ---------------- START SERVER ----------------
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database synced (tables created)");
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
  });
