const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const apiKeyAuth = require("../middlewares/apiKeyMiddleware");

/**
 * @swagger
 * tags:
 *   name: APIKeyAuth
 *   description: CRUD operations protected by API Key Authentication
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 *
 *   schemas:
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
 *           example: MacBook Pro M3
 *         category:
 *           type: string
 *           example: Laptop
 *         price:
 *           type: number
 *           example: 149999
 */

/**
 * @swagger
 * /apiKey/add:
 *   post:
 *     summary: Add a new product (API Key protected)
 *     tags: [APIKeyAuth]
 *     security:
 *       - apiKeyAuth: []
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
router.post("/add", apiKeyAuth, async (req, res) => {
  const newProd = new Product(req.body);
  await newProd.save();
  res.json(newProd);
});

/**
 * @swagger
 * /apiKey/get:
 *   get:
 *     summary: Get all products (API Key protected)
 *     tags: [APIKeyAuth]
 *     security:
 *       - apiKeyAuth: []
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
router.get("/get", apiKeyAuth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/**
 * @swagger
 * /apiKey/update/{id}:
 *   patch:
 *     summary: Update a product by ID (API Key protected)
 *     tags: [APIKeyAuth]
 *     security:
 *       - apiKeyAuth: []
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
 *         description: Updated product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Product"
 */
router.patch("/update/:id", apiKeyAuth, async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(prod);
});

/**
 * @swagger
 * /apiKey/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID (API Key protected)
 *     tags: [APIKeyAuth]
 *     security:
 *       - apiKeyAuth: []
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
 *                   example: Deleted
 */
router.delete("/delete/:id", apiKeyAuth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
