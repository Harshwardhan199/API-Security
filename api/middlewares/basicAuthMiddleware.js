const User = require("../models/User");
//const bcrypt = require("bcrypt");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Missing Basic Auth Header" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");

    // 🔍 Find user in MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔐 Compare password with hashed password
    //const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = (password == user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 👍 Auth successful
    req.user = user; // optional - attach user to request
    next();

  } catch (err) {
    console.error("Basic Auth error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
