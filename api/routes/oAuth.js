const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");

const router = express.Router();

router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Authorization code required" });

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
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

// -------------------- MIDDLEWARE --------------------
const verifyGoogleAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );
    req.user = response.data;
    next();

  } catch (error) {
    console.error("Token verify error:", error.response?.data || error.message);
    return res.status(401).json({ message: "Invalid or expired Google access token" });
  }
};

// -------------------- CRUD ROUTES --------------------

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
