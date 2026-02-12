const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createFile,
  getFiles,
  getFileById,
  sendFile          // 👈 ADD THIS
} = require("../controllers/fileController");

router.post("/", authMiddleware, createFile);
router.get("/", authMiddleware, getFiles);
router.get("/:id", getFileById);

// ✅ SEND FILE ROUTE (ADD THIS)
router.post("/:id/send", authMiddleware, sendFile);

module.exports = router;
