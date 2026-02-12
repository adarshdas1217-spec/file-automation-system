const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getUnits,
  addUnit,
} = require("../controllers/operationMatrixController");

// View units
router.get("/units", authMiddleware, getUnits);

// Add unit (ADMIN ONLY later)
router.post("/units", authMiddleware, addUnit);

module.exports = router;
        