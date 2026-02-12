const express = require("express");
const router = express.Router();

const {
  createSavingsAccount,
  getSavingsAccounts
} = require("../controllers/savingsController");

const auth = require("../middleware/authMiddleware");

// GET all savings accounts
router.get("/", auth, getSavingsAccounts);

// CREATE savings account
router.post("/", auth, createSavingsAccount);

module.exports = router;
