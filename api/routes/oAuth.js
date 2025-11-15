const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");

const router = express.Router();

// JWT Secret for your app (not Google's)
const JWT_SECRET = process.env.JWT_SECRET || "demo_oauth_secret_key";

// ----- 1️⃣ Exchange Google code for access token -----
router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Authorization code required" });

    // Exchange code -> access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage", // for popup flow
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, expires_in } = tokenResponse.data;

    res.json({
      access_token,
      expires_in,
    });
  } catch (err) {
    console.error("Google login error:", err.response?.data || err.message);
    res.status(500).json({ message: "Google login failed" });
  }
});

// ----- 2️⃣ Middleware: Verify our own JWT -----
const verifyGoogleAccessToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;    
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }
    const token = authHeader.split(" ")[1];
    
    // Verify token by calling Google
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Attach Google user info to request
    req.user = googleResponse.data;

    next();
  } catch (error) {
    console.error("Token verify error:", error.response?.data || error.message);
    return res.status(401).json({ message: "Invalid or expired Google access token" });
  }
};

// ----- 3️⃣ CRUD Routes -----
router.post("/add", verifyGoogleAccessToken, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

router.get("/get", verifyGoogleAccessToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.patch("/update/:id", verifyGoogleAccessToken, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

router.delete("/delete/:id", verifyGoogleAccessToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
