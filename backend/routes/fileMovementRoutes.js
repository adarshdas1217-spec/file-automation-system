const express = require("express");
const router = express.Router();

const { moveFile, getFileHistory } = require("../controllers/fileMovementController");
const authMiddleware = require("../middleware/authMiddleware");

// MOVE FILE
router.post("/", authMiddleware, moveFile);

// FILE HISTORY
router.get("/:fileId", authMiddleware, getFileHistory);

module.exports = router;

