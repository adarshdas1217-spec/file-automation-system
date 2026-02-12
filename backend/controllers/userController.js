const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password, role, unit } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role,
      unit
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
