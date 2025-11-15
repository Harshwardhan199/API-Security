const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OAuth
 *   description: Google OAuth 2.0 authentication and protected CRUD operations
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     googleOAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     GoogleAuthRequest:
 *       type: object
 *       required:
 *         - code
 *       properties:
 *         code:
 *           type: string
 *           example: 4/0AfJohXk89jfdsfjsdf9834jfdsf
 *
 *     GoogleAuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: ya29.A0ARrdaM8...
 *         expires_in:
 *           type: integer
 *           example: 3599
 *
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *           example: Pixel 9 Pro
 *         category:
 *           type: string
 *           example: Mobile
 *         price:
 *           type: number
 *           example: 99999
 */

/**
 * @swagger
 * /oAuth/google:
 *   post:
 *     summary: Exchange Google OAuth code for an access token
 *     tags: [OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/GoogleAuthRequest"
 *     responses:
 *       200:
 *         description: Google access token returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GoogleAuthResponse"
 *       400:
 *         description: Missing authorization code
 *       500:
 *         description: Google login failed
 */
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
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }
    const token = authHeader.split(" ")[1];

    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    req.user = googleResponse.data;
    next();
  } catch (error) {
    console.error("Token verify error:", error.response?.data || error.message);
    return res.status(401).json({ message: "Invalid or expired Google access token" });
  }
};

// -------------------- CRUD ROUTES --------------------

/**
 * @swagger
 * /oAuth/add:
 *   post:
 *     summary: Add a new product (Google OAuth protected)
 *     tags: [OAuth]
 *     security:
 *       - googleOAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */
router.post("/add", verifyGoogleAccessToken, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

/**
 * @swagger
 * /oAuth/get:
 *   get:
 *     summary: Get all products (Google OAuth protected)
 *     tags: [OAuth]
 *     security:
 *       - googleOAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Product"
 */
router.get("/get", verifyGoogleAccessToken, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/**
 * @swagger
 * /oAuth/update/{id}:
 *   patch:
 *     summary: Update a product by ID (Google OAuth protected)
 *     tags: [OAuth]
 *     security:
 *       - googleOAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Product"
 *     responses:
 *       200:
 *         description: Updated product data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */
router.patch("/update/:id", verifyGoogleAccessToken, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

/**
 * @swagger
 * /oAuth/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID (Google OAuth protected)
 *     tags: [OAuth]
 *     security:
 *       - googleOAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted
 */
router.delete("/delete/:id", verifyGoogleAccessToken, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
});

module.exports = router;
