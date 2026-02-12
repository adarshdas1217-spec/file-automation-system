const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  addNote,
  getNotes
} = require("../controllers/fileNoteController");

router.post("/", authMiddleware, addNote);
router.get("/:fileId", authMiddleware, getNotes);

module.exports = router;
