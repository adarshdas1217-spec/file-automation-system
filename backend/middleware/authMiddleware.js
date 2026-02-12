const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = null;

  // 1️⃣ HEADER TOKEN (NORMAL API CALLS)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ QUERY TOKEN (EXPORT / WINDOW.OPEN)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      message: "Authentication token missing. Please login again.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
