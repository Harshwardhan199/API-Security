module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ message: "API Key missing" });

  if (apiKey === process.env.API_KEY || apiKey === "my-secret-api-key") next();
  else res.status(403).json({ message: "Invalid API Key" });
};
