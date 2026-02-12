const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getDeposits,
  createDeposit
} = require("../controllers/depositController");

router.get("/", auth, getDeposits);
router.post("/", auth, createDeposit);

module.exports = router;
