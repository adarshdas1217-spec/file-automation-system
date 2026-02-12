const express = require("express");
const router = express.Router();

// ✅ CORRECT AUTH PATH (NO middlewares folder confusion)
const auth = require("../middleware/authMiddleware");

// ✅ IMPORT CONTROLLER (EXACT NAMES)
const {
  exportPaymentRegisterPDF,
} = require("../controllers/paymentRegisterExportController");

// ==============================
// PAYMENT REGISTER EXPORT ROUTES
// ==============================

// PDF EXPORT
router.get(
  "/export/pdf",
  auth,
  exportPaymentRegisterPDF // 🔥 MUST BE A FUNCTION
);



module.exports = router;
