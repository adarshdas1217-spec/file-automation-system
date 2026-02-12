const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  closeFile,
  reopenFile,
  archiveFile
} = require("../controllers/fileStatusController");

router.post("/:fileId/close", authMiddleware, closeFile);
router.post("/:fileId/reopen", authMiddleware, reopenFile);
router.post("/:fileId/archive", authMiddleware, archiveFile);

module.exports = router;
