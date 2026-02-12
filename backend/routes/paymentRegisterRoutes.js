const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getPaymentRegister } = require("../controllers/paymentRegisterController");

router.get("/", auth, getPaymentRegister);

module.exports = router;