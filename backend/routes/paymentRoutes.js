const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPayment } = require("../controllers/paymentController");

// CREATE PAYMENT
router.post("/", auth, createPayment);

module.exports = router;