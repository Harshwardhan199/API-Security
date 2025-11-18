const ApiKey = require("../models/ApiKey"); // your Mongo model

module.exports = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ message: "API Key missing" });
    }

    // 🔍 Check API key in MongoDB
    const record = await ApiKey.findOne({ key: apiKey, active: true });

    if (!record) {
      return res.status(403).json({ message: "Invalid API Key" });
    }

    // (optional) attach API key owner
    req.apiKeyOwner = record.owner;

    next();

  } catch (err) {
    console.error("API Key Auth Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
