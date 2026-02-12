const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createNote,
  getNotesByFile,
} = require("../controllers/fileNoteSheetController");

router.get("/:fileId", authMiddleware, getNotesByFile);
router.post("/", authMiddleware, createNote);

module.exports = router;
