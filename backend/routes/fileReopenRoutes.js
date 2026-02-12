const express = require("express");
const router = express.Router();

const { reopenFile } = require("../controllers/fileReopenController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/reopen", authMiddleware, reopenFile);

module.exports = router;