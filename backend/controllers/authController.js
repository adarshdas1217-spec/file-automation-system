const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    // ✅ DEFENSIVE CHECK
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { name, email, password, role, unit } = req.body;

    if (!name || !email || !password || !role || !unit) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      unit
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    // ✅ DEFENSIVE CHECK (FIXES YOUR ERROR)
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }

    const { email, password } = req.body;

    // ✅ EXTRA SAFETY
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,        // ✅ useful for notesheet
        unit: user.unit         // ✅ useful for file ownership
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        unit: user.unit
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
