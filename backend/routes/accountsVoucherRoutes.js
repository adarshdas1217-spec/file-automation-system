const express = require("express");
const router = express.Router();

const {
  createVoucher,
  getVouchers,
  approveVoucher,
  rejectVoucher,
  payVoucher,
  
} = require("../controllers/accountsVoucherController");

const {
  printVoucher,
} = require("../controllers/voucherPrintController");

const auth = require("../middleware/authMiddleware");

/**
 * CREATE VOUCHER
 * POST /api/accounts/vouchers
 */
router.post("/", auth, createVoucher);

/**
 * GET ALL VOUCHERS
 * GET /api/accounts/vouchers
 */
router.get("/", auth, getVouchers);

/**
 * APPROVE VOUCHER
 * POST /api/accounts/vouchers/:id/approve
 */
router.post("/:id/approve", auth, approveVoucher);

/**
 * REJECT VOUCHER
 * POST /api/accounts/vouchers/:id/reject
 */
router.post("/:id/reject", auth, rejectVoucher);

/**
 * PAY VOUCHER
 * POST /api/accounts/vouchers/:id/pay
 */
router.post("/:id/pay", auth, payVoucher);

router.get("/:id/print", auth, printVoucher);


module.exports = router;