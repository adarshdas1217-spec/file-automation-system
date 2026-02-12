const express = require("express");
const router = express.Router();

const { closeFile } = require("../controllers/fileClosureController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/close", authMiddleware, closeFile);

module.exports = router;