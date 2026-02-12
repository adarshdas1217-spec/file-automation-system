const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const db = require("../models");

// 🔒 SAFELY RESOLVE USER MODEL
const User = db.User || db.Users;

if (!User) {
  throw new Error("User model not found in Sequelize models");
}

// ✅ LIST USERS (for Send File)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "role", "unit"], // ⬅️ NO designation yet
      order: [["name", "ASC"]],
    });

    res.json(users);
  } catch (err) {
    console.error("FETCH USERS ERROR:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

// ✅ ADMIN create user (unchanged)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  createUser
);

module.exports = router;
