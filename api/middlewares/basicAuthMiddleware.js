module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Missing Basic Auth Header" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (username === "admin" && password === "password123") {
    next();
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
